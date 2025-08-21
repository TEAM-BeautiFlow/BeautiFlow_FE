import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useMutation, useQuery } from "@tanstack/react-query";
import {
  getShopMemberInfo,
  patchShopMemberInfo,
  type PatchShopMemberInfoReq,
  type ShopMemberInfoRes,
  getUserInfo,
  type UserInfo,
} from "@/apis/mypage/mypage";
import ChevronLeft from "../../../assets/icon_left-chevron.svg";

export default function ManagerMypageModify() {
  const navigate = useNavigate();
  const { data: userInfo } = useQuery<UserInfo>({
    queryKey: ["userInfo"],
    queryFn: getUserInfo,
    staleTime: 60_000,
  });
  const resolvedShopId = userInfo?.shopId?.[0] ?? null;

  const [introText, setIntroText] = useState<string>("");
  const maxIntroLength = 100;

  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreviewUrl, setImagePreviewUrl] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [didPatchImage, setDidPatchImage] = useState<boolean>(false);

  const { data: memberInfo } = useQuery<ShopMemberInfoRes>({
    queryKey: ["shopMemberInfo", resolvedShopId],
    queryFn: () => getShopMemberInfo(resolvedShopId as number),
    enabled: resolvedShopId != null,
    staleTime: 60_000,
  });

  useEffect(() => {
    if (!memberInfo) return;
    setIntroText(memberInfo.intro ?? "");
    setImagePreviewUrl(memberInfo.imageUrl ?? null);
    setDidPatchImage(false);
    setImageFile(null);
  }, [memberInfo]);

  useEffect(() => {
    if (!imageFile) {
      setImagePreviewUrl(null);
      return;
    }
    const objectUrl = URL.createObjectURL(imageFile);
    setImagePreviewUrl(objectUrl);
    return () => URL.revokeObjectURL(objectUrl);
  }, [imageFile]);

  const handleClickUpload = () => {
    if (imageFile) return; // 1장 제한
    fileInputRef.current?.click();
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] ?? null;
    if (file) {
      setImageFile(file);
      setDidPatchImage(true);
    }
    // 같은 파일 재선택 허용
    e.currentTarget.value = "";
  };

  const handleRemoveImage = () => {
    setImageFile(null);
    setImagePreviewUrl(null);
    setDidPatchImage(true);
  };

  const { mutate: doSave, isPending } = useMutation({
    mutationFn: async (params: {
      shopId: number;
      request: PatchShopMemberInfoReq;
      image?: File;
    }) => patchShopMemberInfo(params.shopId, params.request, params.image),
    onSuccess: () => {
      alert("저장되었습니다.");
      navigate(-1);
    },
    onError: () => {
      alert("저장에 실패했습니다. 잠시 후 다시 시도해주세요.");
    },
  });

  const handleSave = () => {
    if (!introText.trim()) {
      alert("한 줄 소개를 입력해주세요.");
      return;
    }
    if (resolvedShopId == null) {
      alert("가게 식별자 정보를 찾을 수 없습니다. 다시 로그인해주세요.");
      return;
    }
    // 이미지 유효성: 기존 프리뷰도 없고 새 파일도 없고 삭제도 아닌 경우 막기
    const hasAnyImage = Boolean(imagePreviewUrl) || Boolean(imageFile);
    if (!hasAnyImage && !didPatchImage) {
      alert("프로필 사진을 업로드해주세요.");
      return;
    }

    const request: PatchShopMemberInfoReq = {
      intro: introText.trim(),
      patchImage: didPatchImage,
    };

    doSave({ shopId: resolvedShopId, request, image: imageFile ?? undefined });
  };

  return (
    <div className="flex min-h-[812px] min-w-[375px] flex-col items-center justify-center">
      <div className="relative flex w-full max-w-[375px] flex-grow flex-col overflow-hidden bg-[var(--color-grey-1000)] px-5 pt-8 pb-6 text-[var(--color-white)]">
        <header className="mb-6 flex h-12 items-center justify-between border-b border-[#232323]">
          <button
            type="button"
            aria-label="뒤로가기"
            className="px-1"
            onClick={() => navigate(-1)}
          >
            <img src={ChevronLeft} alt="뒤로가기" className="h-6 w-6" />
          </button>
          <h1 className="label1 font-semibold">디자이너 정보 수정</h1>
          <button
            type="button"
            onClick={handleSave}
            disabled={isPending}
            className="text-sm font-semibold text-violet-400 disabled:opacity-60"
          >
            {isPending ? "저장 중..." : "저장"}
          </button>
        </header>

        <main className="space-y-8">
          <section>
            <h2 className="label1 font-semibold">
              디자이너 한 줄 소개 <span className="text-violet-400">*</span>
            </h2>
            <p className="caption1 mt-1 text-[#A1A1A1]">
              디자이너 선택 페이지에서 노출되는 소개글이에요.
            </p>
            <div className="relative mt-3">
              <textarea
                value={introText}
                onChange={e =>
                  setIntroText(e.target.value.slice(0, maxIntroLength))
                }
                placeholder="한 줄 소개를 입력해주세요."
                maxLength={maxIntroLength}
                className="h-24 w-full rounded-md border border-[#232323] bg-[var(--color-grey-900)] p-3 text-sm outline-none placeholder:text-[#7A7A7A] focus:ring-2 focus:ring-violet-500"
              />
              <span className="absolute right-3 bottom-2 text-[11px] text-[#7A7A7A]">
                {introText.length}/{maxIntroLength}
              </span>
            </div>
          </section>

          <section>
            <h2 className="label1 font-semibold">
              디자이너 프로필 사진 <span className="text-violet-400">*</span>
            </h2>
            <p className="caption1 mt-1 text-[#A1A1A1]">
              디자이너 선택 페이지에서 노출되는 대표 사진이에요.
            </p>
            <div className="mt-3 flex gap-3">
              <button
                type="button"
                onClick={handleClickUpload}
                disabled={!!imageFile}
                className={`relative flex h-28 w-28 flex-col items-center justify-center rounded-md border bg-[var(--color-grey-900)]/40 text-[#D1D1D1] ${
                  imageFile
                    ? "cursor-not-allowed border-[#232323] opacity-60"
                    : "border-[#232323] hover:border-[#404040]"
                }`}
              >
                <span className="text-3xl leading-none">+</span>
                <span className="mt-1 text-xs text-[#A1A1A1]">사진 1/1</span>
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  onChange={handleFileChange}
                  className="hidden"
                />
              </button>

              {imagePreviewUrl && (
                <div className="relative h-28 w-28 overflow-hidden rounded-md border border-[#232323] bg-[var(--color-grey-900)]">
                  <img
                    src={imagePreviewUrl}
                    alt="프로필 미리보기"
                    className="h-full w-full object-cover"
                  />
                  <button
                    type="button"
                    aria-label="이미지 삭제"
                    onClick={handleRemoveImage}
                    className="absolute -top-2 -right-2 h-7 w-7 rounded-full border border-[#232323] bg-[var(--color-grey-1000)] text-sm"
                  >
                    ×
                  </button>
                </div>
              )}
            </div>
          </section>
        </main>
      </div>
    </div>
  );
}
