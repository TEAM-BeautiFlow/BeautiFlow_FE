import { useEffect, useRef, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import axios from "axios";
import ChatHeader from "./components/ChatHeader";
import { Client } from "@stomp/stompjs";
import SockJS from "sockjs-client";
import { getUserInfo } from "@/apis/mypage/mypage";
export default function GroupChat() {
  const [text, setText] = useState("");
  const location = useLocation();
  const navigate = useNavigate();
  const customerIds = (location.state?.customerIds as number[]) ?? [];
  const customerNames = location.state?.customerNames ?? [];

  const [sending, setSending] = useState(false);

  const title = () => {
    if (customerNames.length <= 2) return customerNames.join(", ");
    return `${customerNames.slice(0, 2).join(", ")} 외 ${
      customerNames.length - 2
    }명`;
  };
  const userIdRef = useRef<number | null>(null);
  const shopIdRef = useRef<number | null>(null);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const userInfo = await getUserInfo();
        if (!cancelled) {
          userIdRef.current = userInfo.id;
          shopIdRef.current = userInfo.shopMembers?.[0]?.shopId ?? null;
          if (shopIdRef.current) {
            localStorage.setItem("shopId", String(shopIdRef.current));
          }
        }
      } catch (e) {
        console.error("failed to load user info", e);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, []);

  const ensureRoom = async (customerId: number): Promise<number> => {
    const token = localStorage.getItem("accessToken");
    const shopId = shopIdRef.current;
    const designerId = userIdRef.current;
    if (!token || !shopId || !designerId)
      throw new Error("shopId/designerId/token 누락");

    try {
      const res = await axios.post(
        `${import.meta.env.VITE_API_BASE_URL}/chat/rooms`,
        { shopId, customerId, designerId },
        { headers: { Authorization: `Bearer ${token}` } },
      );
      return res.data?.data?.roomId as number;
    } catch (err: any) {
      // 서버가 '이미 존재' 에서 roomId를 내려주는 경우 처리
      const existingId =
        err?.response?.data?.data?.roomId ??
        err?.response?.data?.roomId ??
        null;
      if (existingId) return Number(existingId);
      throw err;
    }
  };

  // ② 일회성 WebSocket 전송: 연결 → publish → 즉시 disconnect
  const sendOnceViaWS = (roomId: number, content: string) =>
    new Promise<void>((resolve, reject) => {
      const token = localStorage.getItem("accessToken");
      if (!token) return reject(new Error("token 누락"));
      const senderId = userIdRef.current;
      const senderType = localStorage.getItem("loginProvider") ?? "STAFF";
      const WS_ENDPOINT = `${import.meta.env.VITE_API_BASE_URL}/connect`; // 훅과 동일
      const DESTINATION = `/publish/${roomId}`; // 훅과 동일

      const client = new Client({
        webSocketFactory: () => new SockJS(WS_ENDPOINT),
        connectHeaders: { Authorization: `Bearer ${token}` },
        debug: () => {},
        onConnect: () => {
          try {
            client.publish({
              destination: DESTINATION,
              headers: { Authorization: `Bearer ${token}` },
              body: JSON.stringify({
                roomId,
                senderId,
                senderType,
                content,
                imageUrl: null,
              }),
            });
            setTimeout(() => {
              client
                .deactivate()
                .then(() => resolve())
                .catch(() => resolve());
            }, 50); // 전송 여유
          } catch (e) {
            client.deactivate().finally(() => reject(e));
          }
        },
        onStompError: frame => {
          client
            .deactivate()
            .finally(() => reject(new Error(frame.body || "STOMP error")));
        },
        onWebSocketError: err => {
          client.deactivate().finally(() => reject(err));
        },
      });

      const to = setTimeout(() => {
        try {
          client.deactivate();
        } finally {
          reject(new Error("WS timeout"));
        }
      }, 7000);
      client.onDisconnect = () => clearTimeout(to);

      client.activate();
    });

  const postMessage = async (roomId: number, content: string) => {
    const token = localStorage.getItem("accessToken");
    if (!token) throw new Error("token 누락");

    const senderType = localStorage.getItem("senderType") ?? "STAFF";
    const senderId = userIdRef.current;

    await axios.post(
      `${import.meta.env.VITE_API_BASE_URL}/chat/rooms/${roomId}/messages`,
      { roomId, senderId, senderType, content, imageUrl: null },
      { headers: { Authorization: `Bearer ${token}` } },
    );
  };

  const handleSend = async () => {
    if (!customerIds.length || !text.trim() || sending) return;

    setSending(true);
    try {
      const content = text.trim();

      const tasks = customerIds.map(async cid => {
        const roomId = await ensureRoom(cid); // 방 확보
        await sendOnceViaWS(roomId, content); // WS 1회 전송
        await postMessage(roomId, content); // (옵션) 저장
        return { cid, roomId };
      });

      const results = await Promise.allSettled(tasks);
      const ok = results.filter(r => r.status === "fulfilled").length;
      const fail = results.length - ok;
      console.log("Group send done", { ok, fail, results });

      setText("");
      navigate("/chat/rooms");
    } finally {
      setSending(false);
    }
  };

  return (
    <div className="mx-auto flex h-[812px] w-[375px] flex-col bg-[var(--color-grey-1000)]">
      <ChatHeader
        title={title()}
        rightContent={
          <div
            className={`label2 ${
              text.trim() && customerIds.length
                ? "cursor-pointer text-[var(--color-purple)]"
                : "text-[var(--color-grey-650)]"
            }`}
          >
            발송
          </div>
        }
        onRightClick={handleSend}
      />

      {/* 임시  */}
      <div className="mb-20 px-5">
        <label className="label2 block py-3 text-[var(--color-grey-150)]">
          발송 내용
        </label>
        <textarea
          value={text}
          onChange={e => setText(e.target.value)}
          maxLength={500}
          rows={4}
          className="body2 h-[116px] w-full rounded-[4px] border-[1px] border-[var(--color-grey-650)] bg-[var(--color-grey-950)] px-4 py-[13px] text-[var(--color-grey-150)]"
          placeholder="발송할 내용을 입력하세요"
        />
        <div className="caption2 mt-[3px] flex justify-end text-[var(--color-grey-550)]">
          {text.length}/500
        </div>
      </div>
    </div>
  );
}
