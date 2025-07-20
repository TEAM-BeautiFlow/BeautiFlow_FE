// import MessageList from "./MessageList";
import ChatHeader from "./components/ChatHeader";
import ChatInput from "./components/ChatInput";
const messages = [
  { sender: "you", text: "안녕하세요 내일 추가 시술 가능할까요?" },
  { sender: "me", text: "안녕하세요 하늘님:)" },
  {
    sender: "me",
    text: "아쉽지만 바로 다음 시간대에 다른 시술이 예정되어 있어서 임의로 연장하기는 쉽지 않을 것 같아요ㅜㅜ",
  },
];
export default function ChatRoom() {
  return (
    <div className="mx-auto flex h-screen w-[375px] flex-col bg-[#1A1A1A] px-5 py-2 text-white">
      <ChatHeader />

      {/* 채팅 메시지 */}
      <div className="mt-3 flex-1 gap-2.5 space-y-2 overflow-y-auto py-2">
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

      <ChatInput />
    </div>
  );
}
