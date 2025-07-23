import { useState } from "react";
import ChatHeader from "./components/ChatHeader";

export default function GroupChat() {
  const [text, setText] = useState("");

  return (
    <div className="mx-auto flex h-[812px] w-[375px] flex-col bg-[var(--color-grey-1000)] px-5">
      <ChatHeader
        title="VIP, 손하늘"
        rightContent={
          <div className="label2 text-[var(--color-purple)]">발송</div>
        }
        onRightClick={() => console.log("아이콘 클릭됨")}
      />

      {/* 임시  */}
      <div className="mb-20">
        <label className="label2 block py-3 text-[var(--color-grey-150)]">
          본문
        </label>
        <textarea
          value={text}
          onChange={e => setText(e.target.value)}
          maxLength={500}
          rows={4}
          className="caption1 h-[285px] w-full rounded-[6px] border-[1px] border-[var(--color-grey-650)] bg-transparent px-4 py-[13px] text-[var(--color-grey-150)]"
          placeholder="500자 내로 ~"
        />
        <div className="caption2 mt-[3px] flex justify-end text-[var(--color-grey-550)]">
          {text.length}/500
        </div>
      </div>
    </div>
  );
}
