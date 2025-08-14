import ChatHeader from "./components/ChatHeader";
import noImage from "../../../assets/no_image.png";
import { useLocation } from "react-router-dom";
import { type UserStyleResponse, getUserStyle } from "@/apis/mypage/mypage";
import { useState, useEffect } from "react";

type LocationState = {
  designerId?: number;
  designerName?: string;
  shopName?: string;
};

export default function ChatProfile() {
  const { state } = useLocation() as { state?: LocationState };
  // const designerId = state?.designerId ?? "";
  const designerName = state?.designerName ?? "";
  const shopName = state?.shopName ?? "";
  const [style, setStyle] = useState<UserStyleResponse | null>(null);

  useEffect(() => {
    (async () => {
      const res = await getUserStyle();
      setStyle(res);
    })();
  }, []);

  return (
    <div className="mx-auto flex h-screen w-[375px] flex-col bg-[var(--color-grey-1000)]">
      {/* 상단 헤더 */}
      <ChatHeader
        shopName={shopName}
        title={designerName || "상대방 이름"}
        rightContent={
          <svg
            width="40"
            height="40"
            viewBox="0 0 40 40"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <rect width="40" height="40" rx="20" fill="#3A3A3A" />
            <path
              d="M32.6501 14.275C39.6246 15.6933 34.6096 29.3353 27.6248 30.7086C25.9997 31.0282 24.9667 31.1437 23.3726 30.7086C18.5143 29.3827 25.0573 21.8036 19.9966 21.7493C14.9199 21.6948 21.3383 29.3737 16.466 30.7086C14.8821 31.1426 13.8566 31.0418 12.2396 30.7322C5.25651 29.3953 0.427964 15.6846 7.39473 14.275C8.87021 13.9765 9.79684 13.9288 11.2603 14.275C16.5638 15.5298 8.96268 26.8631 14.4301 27.0358C19.944 27.21 12.7449 15.5546 18.0896 14.275C19.6106 13.9109 20.5903 13.9058 22.1098 14.275C27.4022 15.5611 20.0959 27.0568 25.5631 26.9652C31.0064 26.874 23.4838 15.5348 28.7587 14.275C30.2311 13.9234 31.1651 13.9731 32.6501 14.275Z"
              fill="#6E6E6E"
            />
          </svg>
        }
        onRightClick={() => console.log("아이콘 클릭됨")}
      />
      {/* 프로필 */}
      <div className="px-5">
        <div className="mb-4 h-[95px] w-[95px] shrink-0 overflow-hidden rounded-[4px] bg-white">
          <img
            src={style?.images?.[0]?.imageUrl || noImage}
            alt="profile"
            className="h-full w-full object-cover"
            onError={e => {
              (e.currentTarget as HTMLImageElement).src = noImage;
            }}
          />
        </div>

        {/* 해시태그 & 소개문구 */}
        <span className="label2 text-[var(--color-grey-450)]">
          {style?.description || "잘 부탁드립니다:)"}
        </span>
      </div>
    </div>
  );
}
