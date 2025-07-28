import { useEffect, useRef } from "react";
import { Client, type IMessage } from "@stomp/stompjs";
import SockJS from "sockjs-client";

export default function useChatSocket(
  roomId: number,
  onMessage: (msg: IMessage) => void,
) {
  const clientRef = useRef<Client | null>(null);

  useEffect(() => {
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

  // 메시지 전송용 함수 반환
  const sendMessage = (content: string) => {
    const token = localStorage.getItem("accessToken");

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
        senderId: 3, // 나중에 로그인한 유저 ID로 교체
        senderType: "DESIGNER", // 이것도 가져오기 ..?
        content,
        imageUrl: null,
      }),
    });
  };

  return { sendMessage };
}
