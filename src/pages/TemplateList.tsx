export default function TemplateList() {
  return (
    <div className="mx-auto h-screen w-screen bg-[#1A1A1A] text-white">
      {/* 상단 네비게이션 */}
      <div className="border-b border-gray-700 px-4 pt-2">
        <h1 className="mx-1 mt-3 text-xl font-bold text-[#9A50E0]">
          BEAUTIFLOW
        </h1>
        <div className="mx-1 flex">
          <span className="mt-3 mr-4 text-gray-400">채팅</span>
          <span className="mt-3 border-b-2 border-white pb-1 font-semibold text-white">
            템플릿
          </span>
        </div>
      </div>

      {/* 템플릿 리스트 */}
      <div></div>
    </div>
  );
}
