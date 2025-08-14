import { useNavigate } from "react-router-dom";
import { useState } from "react";
import { useMutation } from "@tanstack/react-query";
import { createUserStyle } from "@/apis/mypage/mypage";
import CameraIcon from "@/assets/camera.svg";
import PlusIcon from "@/assets/icon_plus.svg";
import LeftChevron from "@/assets/icon_left-chevron.svg";

export default function EditStyle() {
  const navigate = useNavigate();
  const [notes, setNotes] = useState("");
  const [images, setImages] = useState<File[]>([]);
  const maxImages = 5;
  const maxLength = 100;

  function handleImageChange(e: React.ChangeEvent<HTMLInputElement>) {
    if (!e.target.files) return;
    const files = Array.from(e.target.files);
    setImages(prev => prev.concat(files).slice(0, maxImages));
    e.currentTarget.value = "";
  }

  function handleRemoveImage(idx: number) {
    setImages(prev => prev.filter((_, i) => i !== idx));
  }

  const { mutate: saveStyle, isPending } = useMutation({
    mutationFn: () => createUserStyle(notes, images),
    onSuccess: () => {
      alert("선호 스타일이 저장되었습니다.");
      navigate(-1);
    },
    onError: () => {
      alert("저장에 실패했습니다. 잠시 후 다시 시도해주세요.");
    },
  });

  function handleSave() {
    if (!notes.trim() && images.length === 0) {
      alert("사진 또는 설명을 최소 1개 이상 입력해주세요.");
      return;
    }
    saveStyle();
  }

  return (
    <div className="mx-auto flex min-h-screen w-[375px] flex-col bg-[var(--color-grey-1000)]">
      <header className="flex items-center justify-between px-5 pt-8">
        <button
          type="button"
          aria-label="뒤로가기"
          className="px-1"
          onClick={() => navigate(-1)}
        >
          <img src={LeftChevron} alt="뒤로가기" className="h-6 w-6" />
        </button>
        <h1 className="label1 font-semibold text-[var(--color-white)]">
          정보 수정하기
        </h1>
        <button
          type="button"
          onClick={handleSave}
          className="text-sm font-semibold text-violet-400"
        >
          {isPending ? "저장 중..." : "저장"}
        </button>
      </header>

      <main className="flex flex-1 flex-col gap-8 px-5 pt-6 pb-24 text-[var(--color-white)]">
        <section>
          <p className="label2 text-left text-[var(--color-white)]">
            디자이너가 고객님의 취향과 스타일을
            <br />더 잘 이해하기 위해 참고하는 자료예요.
          </p>
        </section>

        <section>
          <h2 className="title2 mb-2 text-left">사진</h2>
          <div className="flex items-start gap-3">
            {images.map((file, idx) => (
              <div
                key={idx}
                className="relative h-[88px] w-[88px] overflow-hidden rounded-md border border-[#444]"
              >
                <img
                  src={URL.createObjectURL(file)}
                  alt="업로드 이미지 미리보기"
                  className="h-full w-full object-cover"
                />
                <button
                  type="button"
                  className="absolute top-1 right-1 rounded bg-black/60 px-1 text-xs"
                  onClick={() => handleRemoveImage(idx)}
                >
                  삭제
                </button>
              </div>
            ))}
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
        </section>

        <section>
          <h2 className="title2 mb-2 text-left">글</h2>
          <p className="caption2 mb-2 text-left text-[#A1A1A1]">
            요청사항이나 선호하는 스타일 등에 대하여 작성해주세요.
          </p>
          <div className="relative">
            <textarea
              className="body2 w-full resize-none rounded-md border border-[#444] bg-transparent p-4 text-[var(--color-white)] placeholder:text-[#A1A1A1]"
              rows={5}
              maxLength={maxLength}
              placeholder="요청사항을 입력해주세요."
              value={notes}
              onChange={e => setNotes(e.target.value)}
            />
          </div>
          <p className="caption2 mt-1 w-full text-right text-[#A1A1A1]">
            {notes.length}/{maxLength}
          </p>
        </section>
      </main>
    </div>
  );
}
