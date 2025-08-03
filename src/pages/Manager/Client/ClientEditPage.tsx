import { useState } from "react";
import LeftChevron from "@/assets/icon_left-chevron.svg";
import PlusIcon from "@/assets/icon_plus.svg";
import DownChevron from "@/assets/icon_chevron-down.svg";

export default function ClientEditPage() {
  const [phone, setPhone] = useState("");
  const [group, setGroup] = useState("");
  const [styleText, setStyleText] = useState("");
  const [memo, setMemo] = useState("");
  const [images, setImages] = useState<File[]>([]);
  const maxImages = 5;
  const maxLength = 100;
  const groupOptions = ["단골", "신규", "VIP", "기타"];
  const [groupOpen, setGroupOpen] = useState(false);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files) return;
    const files = Array.from(e.target.files).slice(
      0,
      maxImages - images.length,
    );
    setImages(prev => [...prev, ...files].slice(0, maxImages));
  };

  return (
    <div className="flex min-h-[812px] min-w-[375px] flex-col items-center justify-center">
      <div className="relative flex w-full max-w-[375px] flex-grow flex-col items-center overflow-hidden bg-[var(--color-grey-1000)] px-5 pt-8 pb-6">
        {/* 상단 네비게이션 */}
        <div className="mb-6 flex w-full items-center justify-between">
          <button className="p-2">
            <img src={LeftChevron} alt="뒤로가기" className="h-6 w-6" />
          </button>
          <span className="label1 text-[var(--color-white)]">
            손하늘 고객님
          </span>
          <button className="body1 p-2 text-[var(--color-purple-500)]">
            저장
          </button>
        </div>
        {/* 연락처 */}
        <div className="mb-6 w-full">
          <div className="title2 mb-2 text-left text-[var(--color-white)]">
            연락처 <span className="text-[var(--color-purple-500)]">*</span>
          </div>
          <input
            className="body2 w-full rounded-md border border-[#444] bg-[var(--color-grey-950)] p-4 text-[var(--color-white)] placeholder:text-[#A1A1A1]"
            placeholder="010-1234-5678"
            value={phone}
            onChange={e => setPhone(e.target.value)}
            maxLength={13}
          />
        </div>
        {/* 그룹 설정 */}
        <div className="mb-6 w-full">
          <div className="title2 mb-2 text-left text-[var(--color-white)]">
            그룹 설정
          </div>
          <div className="relative">
            <button
              className="body2 flex w-full items-center justify-between rounded-md border border-[#444] bg-[var(--color-grey-950)] p-4 text-left text-[#A1A1A1]"
              onClick={() => setGroupOpen(v => !v)}
              type="button"
            >
              {group ? group : "고객 그룹을 선택해주세요."}
              <img src={DownChevron} alt="드롭다운" className="ml-2 h-6 w-6" />
            </button>
            {groupOpen && (
              <ul className="absolute top-full right-0 left-0 z-10 mt-1 rounded-md border border-[#444] bg-[var(--color-grey-1000)] shadow">
                {groupOptions.map(opt => (
                  <li
                    key={opt}
                    className="body2 cursor-pointer px-4 py-2 text-[var(--color-white)] hover:bg-[var(--color-grey-900)]"
                    onClick={() => {
                      setGroup(opt);
                      setGroupOpen(false);
                    }}
                  >
                    {opt}
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>
        {/* 선호 스타일 */}
        <div className="mb-6 w-full">
          <div className="title2 mb-2 text-left text-[var(--color-white)]">
            선호 스타일
          </div>
          <div className="mb-4 flex items-center">
            <label className="mr-4 flex h-[72px] w-[72px] cursor-pointer flex-col items-center justify-center rounded-md border border-[#444] bg-[var(--color-grey-950)]">
              <span className="flex flex-col items-center justify-center">
                <img src={PlusIcon} alt="추가" className="mb-1 h-6 w-6" />
                <span className="body2 text-[#A1A1A1]">
                  사진 {images.length}/{maxImages}
                </span>
              </span>
              <input
                type="file"
                accept="image/*"
                multiple
                className="hidden"
                onChange={handleImageChange}
                disabled={images.length >= maxImages}
              />
            </label>
            {/* 업로드된 이미지 썸네일 */}
            <div className="flex gap-2">
              {images.map((img, idx) => (
                <div
                  key={idx}
                  className="flex h-[72px] w-[72px] items-center justify-center overflow-hidden rounded-md border border-[#444] bg-[#222]"
                >
                  <img
                    src={URL.createObjectURL(img)}
                    alt={`업로드 이미지 ${idx + 1}`}
                    className="h-full w-full object-cover"
                  />
                </div>
              ))}
            </div>
          </div>
          <textarea
            className="body2 w-full resize-none rounded-md border border-[#444] bg-[var(--color-grey-950)] p-4 text-[var(--color-white)] placeholder:text-[#A1A1A1]"
            rows={3}
            maxLength={maxLength}
            placeholder="선호하는 스타일에 대해 작성해주세요."
            value={styleText}
            onChange={e => setStyleText(e.target.value)}
          />
          <div className="caption2 mt-1 w-full text-right text-[#A1A1A1]">
            {styleText.length}/{maxLength}
          </div>
        </div>
        {/* 고객 메모 */}
        <div className="mb-2 w-full">
          <div className="title2 mb-2 text-left text-[var(--color-white)]">
            고객 메모
          </div>
          <textarea
            className="body2 w-full resize-none rounded-md border border-[#444] bg-[var(--color-grey-950)] p-4 text-[var(--color-white)] placeholder:text-[#A1A1A1]"
            rows={3}
            maxLength={maxLength}
            placeholder="고객의 특징, 주의사항 등의 메모를 남겨주세요."
            value={memo}
            onChange={e => setMemo(e.target.value)}
          />
          <div className="caption2 mt-1 w-full text-right text-[#A1A1A1]">
            {memo.length}/{maxLength}
          </div>
        </div>
      </div>
    </div>
  );
}
