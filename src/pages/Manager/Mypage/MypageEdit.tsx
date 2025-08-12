import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import {
  updateUserInfo,
  type UpdateUserInfoRequest,
} from "@/apis/mypage/mypage";
import ChevronLeft from "../../../assets/icon_left-chevron.svg";

export default function MypageEdit() {
  const navigate = useNavigate();
  const location = useLocation();
  const prefill =
    (location.state as {
      name?: string;
      email?: string;
      contact?: string;
    } | null) ?? null;
  const queryClient = useQueryClient();

  const [name, setName] = useState<string>("");
  const [email, setEmail] = useState<string>("");
  const [phone, setPhone] = useState<string>("");

  useEffect(() => {
    if (prefill) {
      setName(prefill.name ?? "");
      setEmail(prefill.email ?? "");
      setPhone((prefill.contact ?? "").replace(/\D/g, ""));
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const isPhoneValid = /^\d{10,11}$/.test(phone);

  const { mutate: saveUserInfo, isPending } = useMutation({
    mutationFn: (payload: UpdateUserInfoRequest) => updateUserInfo(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["userInfo"], exact: true });
      alert("저장되었습니다.");
      navigate(-1);
    },
    onError: () => {
      alert("저장에 실패했습니다. 잠시 후 다시 시도해주세요.");
    },
  });

  const handleSave = () => {
    if (!name.trim()) {
      alert("이름을 입력해주세요.");
      return;
    }
    if (!email.trim()) {
      alert("이메일을 입력해주세요.");
      return;
    }
    if (!isPhoneValid) {
      alert("연락처는 하이픈 포함 10~11자리 숫자로 입력해주세요.");
      return;
    }
    saveUserInfo({ name: name.trim(), email: email.trim(), contact: phone });
  };

  const sendPhoneVerification = () => {
    if (!isPhoneValid) return;
    // TODO: 인증번호 발송 API 연동
    alert("인증번호를 발송했습니다.");
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
          <h1 className="label1 font-semibold">정보 수정하기</h1>
          <button
            type="button"
            onClick={handleSave}
            disabled={isPending}
            className={`text-sm font-semibold ${
              isPending ? "text-violet-400/60" : "text-violet-400"
            }`}
          >
            {isPending ? "저장 중..." : "저장"}
          </button>
        </header>

        <main className="space-y-8">
          {/* 이름 */}
          <section>
            <h2 className="label1 font-semibold">
              이름 <span className="text-violet-400">*</span>
            </h2>
            <div className="relative mt-3">
              <input
                type="text"
                value={name}
                onChange={e => setName(e.target.value)}
                placeholder="이름을 입력해주세요"
                className="h-12 w-full rounded-md border border-[#232323] bg-[var(--color-grey-900)] px-3 text-sm outline-none placeholder:text-[#7A7A7A] focus:ring-2 focus:ring-violet-500"
              />
            </div>
          </section>

          {/* 이메일 */}
          <section>
            <h2 className="label1 font-semibold">
              이메일 <span className="text-violet-400">*</span>
            </h2>
            <div className="relative mt-3">
              <input
                type="email"
                value={email}
                onChange={e => setEmail(e.target.value)}
                placeholder="이메일을 입력해주세요"
                className="h-12 w-full rounded-md border border-[#232323] bg-[var(--color-grey-900)] px-3 text-sm outline-none placeholder:text-[#7A7A7A] focus:ring-2 focus:ring-violet-500"
              />
            </div>
          </section>

          {/* 연락처 */}
          <section>
            <h2 className="label1 font-semibold">
              연락처 <span className="text-violet-400">*</span>
            </h2>
            <p className="caption1 mt-1 text-[#A1A1A1]">
              하이픈(-)을 제외하고 입력해주세요.
            </p>
            <div className="mt-3 flex items-center gap-3">
              <input
                type="tel"
                inputMode="numeric"
                value={phone}
                onChange={e => setPhone(e.target.value.replace(/\D/g, ""))}
                placeholder="01012345678"
                className="h-12 flex-1 rounded-md border border-[#232323] bg-[var(--color-grey-900)] px-3 text-sm outline-none placeholder:text-[#7A7A7A] focus:ring-2 focus:ring-violet-500"
              />
              <button
                type="button"
                onClick={sendPhoneVerification}
                disabled={!isPhoneValid}
                className={`h-12 rounded-md border px-4 text-sm ${
                  isPhoneValid
                    ? "border-[#232323] text-[var(--color-white)] hover:bg-[var(--color-grey-900)]"
                    : "cursor-not-allowed border-[#232323] text-[#7A7A7A] opacity-60"
                }`}
              >
                번호 인증
              </button>
            </div>
          </section>
        </main>
      </div>
    </div>
  );
}
