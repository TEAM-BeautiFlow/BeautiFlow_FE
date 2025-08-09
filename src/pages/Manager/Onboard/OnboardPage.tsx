// import OnboardFirst from "./components/OnboardFirst";
// import OnboardJoin from "./components/OnboardJoin";
// import OnboardJoinFin from "./components/OnboardJoinFin";
// import OnboardShopFin from "./components/OnboardShopFin";
import OnboardShopRegister from "./components/OnboardShopRegister";
import { useEffect, useState } from "react";
import { postSignup } from "@/apis/login";
import { useSearchParams } from "react-router-dom";

export default function OnboardPage() {
  const [search] = useSearchParams();
  const [signupInfo, setSignupInfo] = useState<{
    kakaoId: string;
    provider: string;
  } | null>(null);

  useEffect(() => {
    const kakaoId = search.get("kakaoId");
    const provider = search.get("provider");
    if (kakaoId && provider) {
      setSignupInfo({ kakaoId, provider });
    }
  }, [search]);

  async function handleCompleteSignup(name: string, contact: string) {
    if (!signupInfo) return;
    await postSignup({
      kakaoId: signupInfo.kakaoId,
      provider: signupInfo.provider,
      name,
      contact,
    });
    // TODO: 가입 완료 후 이동 경로 결정 (홈 등)
  }

  return (
    <>
      <OnboardShopRegister onComplete={handleCompleteSignup} />
    </>
  );
}
