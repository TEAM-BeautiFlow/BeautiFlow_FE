interface MessageItemProps {
  sender: string;
  text: string;
  isLastOfSender: boolean;
}

export default function MessageItem({
  sender,
  text,
  isLastOfSender,
}: MessageItemProps) {
  return (
    <div
      className={`flex ${sender === "me" ? "justify-end" : "justify-start"}`}
    >
      <div
        className={`max-w-[80%] rounded-3xl px-4 py-3 text-[13px] leading-relaxed tracking-tight ${
          sender === "me" ? "bg-[#9A50E0]" : "bg-[#3A3A3A]"
        } ${sender === "me" && isLastOfSender ? "rounded-br-none" : ""} ${
          sender === "you" && isLastOfSender ? "rounded-bl-none" : ""
        }`}
      >
        {text}
      </div>
    </div>
  );
}
