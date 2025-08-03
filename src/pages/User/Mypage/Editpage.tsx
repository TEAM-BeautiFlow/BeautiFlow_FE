import { useState } from "react";
import CameraIcon from "@/assets/camera.svg";
import PlusIcon from "@/assets/icon_plus.svg";
import LeftChevron from "@/assets/icon_left-chevron.svg";

export default function Editpage() {
  const [text, setText] = useState("");
  const maxImages = 5;
  const [images, setImages] = useState<File[]>([]);
  const maxLength = 100;

  // 이미지 업로드 핸들러 (실제 업로드 로직은 추후 구현)
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
          <span className="label1 text-[var(--color-white)]">선호 스타일</span>
          <button className="body1 p-2 text-[var(--color-purple-500)]">
            저장
          </button>
        </div>
        {/* 안내문구 */}
        <div className="label2 mb-8 w-full text-left text-[#fff]">
          디자이너가 고객님의 취향과 스타일을
          <br />더 잘 이해하기 위해 참고하는 자료예요.
        </div>
        {/* 사진 업로드 */}
        <div className="mb-8 w-full">
          <div className="title2 mb-2 text-left text-[var(--color-white)]">
            사진
          </div>
          <label className="flex h-[88px] w-[88px] cursor-pointer flex-col items-center justify-center rounded-md border border-[#444] bg-transparent">
            <div className="relative flex flex-col items-center justify-center">
              <img src={CameraIcon} alt="사진 추가" className="h-8 w-8" />
              <img
                src={PlusIcon}
                alt="추가"
                className="absolute bottom-5 left-6 h-5 w-5"
              />
            </div>
            <span className="caption2 mt-2 text-[#A1A1A1]">
              {images.length}/{maxImages}
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
        </div>
        {/* 글 입력 */}
        <div className="w-full">
          <div className="title2 mb-2 text-left text-[var(--color-white)]">
            글
          </div>
          <div className="caption2 mb-2 text-left text-[#A1A1A1]">
            요청사항이나 선호하는 스타일 등에 대하여 작성해주세요.
          </div>
          <div className="relative">
            <textarea
              className="body2 w-full resize-none rounded-md border border-[#444] bg-transparent p-4 text-[var(--color-white)] placeholder:text-[#A1A1A1]"
              rows={5}
              maxLength={maxLength}
              placeholder="요청사항을 입력해주세요."
              value={text}
              onChange={e => setText(e.target.value)}
            />
          </div>
          <div className="caption2 mt-1 w-full text-right text-[#A1A1A1]">
            {text.length}/{maxLength}
          </div>
        </div>
      </div>
    </div>
  );
}
