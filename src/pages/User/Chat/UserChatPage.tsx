import { useState } from "react";
// import ChatHeader from "./components/ChatHeader";
import ChatInput from "./components/ChatInput";

interface Message {
  sender: "me" | "you";
  text: string;
}

export default function UserChatPage() {
  const [, setIsOptionOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);

  const handleSend = (text: string) => {
    setMessages(prev => [...prev, { sender: "me", text }]);
  };

  return (
    <div className="mx-auto flex h-screen w-[375px] flex-col bg-[var(--color-grey-1000)] py-2">
      {/* 상단 헤더 -> api 에 따라서 고쳐야함 */}
      {/* <ChatHeader /> */}

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

      {/* 하단 입력창 */}
      <ChatInput
        onSend={handleSend}
        onClick={() => setIsOptionOpen(prev => !prev)}
      />
    </div>
  );
}
