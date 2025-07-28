import { useEffect, useRef } from "react";
import { Client, type IMessage } from "@stomp/stompjs";
import SockJS from "sockjs-client";

export default function useChatSocket(
  roomId: number,
  onMessage: (msg: IMessage) => void,
) {
  const clientRef = useRef<Client | null>(null);

  useEffect(() => {
    // 개발용 accessToken 임시 저장
    const devToken = "chattest"; // 테스트용 토큰
    if (!localStorage.getItem("accessToken")) {
      localStorage.setItem("accessToken", devToken);
      console.log("💡 개발용 accessToken이 저장되었습니다.");
    }
    const token = localStorage.getItem("accessToken");
    const socket = new SockJS(`${import.meta.env.VITE_API_BASE_URL}/connect`);
    const client = new Client({
      webSocketFactory: () => socket,
      connectHeaders: {
        Authorization: `Bearer ${token}`,
      },
      debug: str => console.log("[STOMP]", str),
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
    };
  }, [roomId, onMessage]);

  // 메시지 전송
  const sendMessage = (content: string) => {
    const token = localStorage.getItem("accessToken");
    const senderId = localStorage.getItem("userId");
    const senderType = localStorage.getItem("userType");
    if (!clientRef.current?.connected) {
      console.warn("STOMP client가 연결되지 않았습니다.");
      return;
    }

    clientRef.current?.publish({
      destination: `/publish/${roomId}`,
      headers: {
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({
        roomId,
        senderId: Number(senderId),
        senderType,
        content,
        imageUrl: null,
      }),
    });
  };

  return { sendMessage };
}
