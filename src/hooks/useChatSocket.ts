import { useEffect, useRef } from "react";
import { Client, type IMessage } from "@stomp/stompjs";
import SockJS from "sockjs-client";
import { getUserInfo } from "@/apis/mypage/mypage";

export default function useChatSocket(
  roomId: number,
  onMessage: (msg: IMessage) => void,
) {
  const clientRef = useRef<Client | null>(null);
  const userIdRef = useRef<number | null>(null);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const userInfo = await getUserInfo();
        if (!cancelled) userIdRef.current = userInfo.id;
      } catch (e) {
        console.error("failed to load user info", e);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, []);

  useEffect(() => {
    const token = localStorage.getItem("accessToken");
    if (!token) {
      console.warn("No accessToken found. Skip WS connection.");
      return;
    }
    const socket = new SockJS(`${import.meta.env.VITE_API_BASE_URL}/connect`);
    const client = new Client({
      webSocketFactory: () => socket,
      connectHeaders: {
        Authorization: `Bearer ${token}`,
      },
      debug: str => console.log("[STOMP]", str),
      reconnectDelay: 5000,
      onConnect: () => {
        const topic = `/topic/${roomId}`;
        client.subscribe(topic, onMessage, {
          Authorization: `Bearer ${token}`,
        });
      },
      onStompError: frame => {
        console.error("STOMP 오류", frame);
      },
    });

    client.activate();
    clientRef.current = client;

    return () => {
      client.deactivate();
      clientRef.current = null;
    };
  }, [roomId, onMessage]);

  // 메시지 전송용 함수 반환
  const sendMessage = (content: string) => {
    const client = clientRef.current;
    if (!client?.connected) {
      console.warn("STOMP client가 연결되지 않았습니다.");
      return;
    }
    const token = localStorage.getItem("accessToken");
    const senderId = userIdRef.current;
    const senderType = localStorage.getItem("loginProvider");

    client.publish({
      destination: `/publish/${roomId}`,
      headers: {
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({
        roomId,
        senderId,
        senderType,
        content,
        imageUrl: null,
      }),
    });
  };

  return { sendMessage };
}
