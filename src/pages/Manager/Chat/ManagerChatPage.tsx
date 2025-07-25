import { useState } from "react";
import ChatHeader from "./components/ChatHeader";
import ChatInput from "./components/ChatInput";
import ChatRoomModal from "./components/ChatRoomModal";

interface Message {
  sender: "me" | "you";
  text: string;
}

export default function ManagerChatPage() {
  const [isOptionOpen, setIsOptionOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);

  const handleSend = (text: string) => {
    setMessages(prev => [...prev, { sender: "me", text }]);
  };

  return (
    <div className="mx-auto flex h-screen w-[375px] flex-col bg-[#1A1A1A] py-2 text-white">
      <ChatHeader
        title="상대방 이름"
        rightContent={
          <svg
            width="40"
            height="40"
            viewBox="0 0 40 40"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <rect width="40" height="40" rx="20" fill="#3A3A3A" />
            <path
              d="M32.6501 14.275C39.6246 15.6933 34.6096 29.3353 27.6248 30.7086C25.9997 31.0282 24.9667 31.1437 23.3726 30.7086C18.5143 29.3827 25.0573 21.8036 19.9966 21.7493C14.9199 21.6948 21.3383 29.3737 16.466 30.7086C14.8821 31.1426 13.8566 31.0418 12.2396 30.7322C5.25651 29.3953 0.427964 15.6846 7.39473 14.275C8.87021 13.9765 9.79684 13.9288 11.2603 14.275C16.5638 15.5298 8.96268 26.8631 14.4301 27.0358C19.944 27.21 12.7449 15.5546 18.0896 14.275C19.6106 13.9109 20.5903 13.9058 22.1098 14.275C27.4022 15.5611 20.0959 27.0568 25.5631 26.9652C31.0064 26.874 23.4838 15.5348 28.7587 14.275C30.2311 13.9234 31.1651 13.9731 32.6501 14.275Z"
              fill="#6E6E6E"
            />
          </svg>
        }
        onRightClick={() => console.log("아이콘 클릭됨")}
      />

      {/* 채팅 메시지 */}
      <div className="mt-3 flex-1 gap-2.5 space-y-2 overflow-y-auto px-5 py-2">
        {messages.map((message, index) => {
          const isLastOfSender =
            index === messages.length - 1 ||
            messages[index + 1].sender !== message.sender;

          return (
            <div
              key={index}
              className={`flex ${message.sender === "me" ? "justify-end" : "justify-start"}`}
            >
              <div
                className={`body2 max-w-[80%] rounded-[20px] px-4 py-2 text-[var(--color-grey-50)] ${
                  message.sender === "me"
                    ? "bg-[var(--color-purple)]"
                    : "bg-[var(--color-grey-850)]"
                } ${message.sender === "me" && isLastOfSender ? "rounded-br-[2px]" : ""} ${message.sender === "you" && isLastOfSender ? "rounded-bl-[2px]" : ""}`}
              >
                {message.text}
              </div>
            </div>
          );
        })}
      </div>

      <ChatInput
        onSend={handleSend}
        onClick={() => setIsOptionOpen(prev => !prev)}
      />
      {isOptionOpen && <ChatRoomModal />}
    </div>
  );
}

// import { useEffect, useState } from "react";
// import { useParams } from "react-router-dom";
// import useChatSocket from "../../../hooks/useChatSocket";
// import ChatHeader from "./components/ChatHeader";
// import ChatInput from "./components/ChatInput";
// import ChatRoomModal from "./components/ChatRoomModal";

// interface Message {
//   sender: "me" | "you";
//   text: string;
// }

// export default function ManagerChatPage() {
//   const { roomId } = useParams<{ roomId: string }>();
//   const [messages, setMessages] = useState<Message[]>([]);
//   const [isOptionOpen, setIsOptionOpen] = useState(false);

//   // 수신 메시지 처리
//   const handleIncomingMessage = (msg: any) => {
//     const parsed = JSON.parse(msg.body);
//     setMessages(prev => [
//       ...prev,
//       {
//         sender: parsed.senderType === "DESIGNER" ? "me" : "you",
//         text: parsed.content,
//       },
//     ]);
//   };

//   // WebSocket 연결 + 전송 함수
//   const { sendMessage } = useChatSocket(Number(roomId), handleIncomingMessage);

//   // 메시지 전송 (예: ChatInput에서 호출)
//   const handleSend = (text: string) => {
//     sendMessage(text);
//     setMessages(prev => [...prev, { sender: "me", text }]);
//   };

//   return (
//     <div className="mx-auto flex h-screen w-[375px] flex-col bg-[#1A1A1A] py-2 text-white">
//       <ChatHeader title="상대방 이름" />
//       <div className="mt-3 flex-1 space-y-2 overflow-y-auto px-5 py-2">
//         {messages.map((message, index) => {
//           const isLastOfSender =
//             index === messages.length - 1 ||
//             messages[index + 1].sender !== message.sender;

//           return (
//             <div
//               key={index}
//               className={`flex ${message.sender === "me" ? "justify-end" : "justify-start"}`}
//             >
//               <div
//                 className={`body2 max-w-[80%] rounded-[20px] px-4 py-2 text-[var(--color-grey-50)] ${
//                   message.sender === "me"
//                     ? "bg-[var(--color-purple)]"
//                     : "bg-[var(--color-grey-850)]"
//                 } ${message.sender === "me" && isLastOfSender ? "rounded-br-[2px]" : ""} ${
//                   message.sender === "you" && isLastOfSender
//                     ? "rounded-bl-[2px]"
//                     : ""
//                 }`}
//               >
//                 {message.text}
//               </div>
//             </div>
//           );
//         })}
//       </div>
//       <ChatInput
//         onSend={handleSend}
//         onClick={() => setIsOptionOpen(prev => !prev)}
//       />
//       {isOptionOpen && <ChatRoomModal />}
//     </div>
//   );
// }
