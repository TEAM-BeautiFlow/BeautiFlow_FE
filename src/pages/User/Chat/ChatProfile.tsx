// import ChatHeader from "./components/ChatHeader";

export default function ChatProfile() {
  return (
    <div className="mx-auto flex h-screen w-[375px] flex-col bg-[var(--color-grey-1000)]">
      {/* 상단 헤더 */}
      {/* <ChatHeader /> */}
      {/* 프로필 */}
      <div className="my-4 flex flex-col px-5">
        <div className="mb-4 h-[95px] w-[95px] shrink-0 rounded-[4px] bg-[var(--color-grey-450)]"></div>
        <span className="label2 text-[var(--color-grey-450)]">
          #연장맛집 #유지력최고
        </span>
        <span className="label2 text-[var(--color-grey-450)]">
          인생을 디자인합니다. 당신의 모든 취향을 실현시켜 드릴게요:)
        </span>
      </div>
    </div>
  );
}
