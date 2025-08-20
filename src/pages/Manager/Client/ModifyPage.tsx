import { useEffect, useState } from "react";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import axios from "axios";

import ManagerNavbar from "../../../layout/ManagerNavbar";
import ClientHeader from "./components/ClientHeader";
import GroupSettingModal from "./components/GroupSettingModal";
import type { CustomerDetail } from "../../../types/customer";

type FormState = {
  groupCodes: string[];
  memo: string;
};

export default function ModifyPage() {
  const navigate = useNavigate();
  const { customerId } = useParams<{ customerId: string }>();
  const id = Number(customerId);
  const { state } = useLocation() as {
    state?: CustomerDetail & { allGroups?: string[] };
  };
  const [form, setForm] = useState<FormState>({
    groupCodes: state?.groupCodes ?? [],
    memo: state?.memo ?? "",
  });

  const [allGroups, setAllGroups] = useState<string[]>([
    "전체",
    ...(state?.allGroups ?? ["VIP", "BLACKLIST"]),
  ]);
  const MAX_VISIBLE_CHIPS = 2;

  const [isGroupModalOpen, setIsGroupModalOpen] = useState(false);
  const [saving, setSaving] = useState(false);
  useEffect(() => {
    if (!state && Number.isFinite(id)) {
      (async () => {
        try {
          const token = localStorage.getItem("accessToken");
          const res = await axios.get(
            `${import.meta.env.VITE_API_BASE_URL}/mangedCustomer/${id}`,
            { headers: { Authorization: `Bearer ${token}` } },
          );
          const c = res.data?.data;
          const tg = Array.isArray(c?.groupCodes)
            ? c.groupCodes
            : c?.groupCodes
              ? [c.groupCodes]
              : [];

          setForm({ groupCodes: tg, memo: c?.memo ?? "" });

          // ✅ 상세에서 받은 그룹을 전체 목록에 합치기
          setAllGroups(prev => Array.from(new Set([...prev, ...tg])));
        } catch (e) {
          console.error("고객 상세 불러오기 실패", e);
        }
      })();
    } else {
      // state로 들어온 경우에도 전체 그룹에 합치기
      if (state?.groupCodes?.length) {
        setAllGroups(prev =>
          Array.from(new Set([...prev, ...state.groupCodes!])),
        );
      }
    }
  }, [state, id]);

  if (!Number.isFinite(id)) {
    return <div className="p-5 text-red-400">잘못된 고객 ID입니다.</div>;
  }

  const handleSave = async () => {
    try {
      setSaving(true);
      const token = localStorage.getItem("accessToken");
      await axios.patch(
        `${import.meta.env.VITE_API_BASE_URL}/mangedCustomer/${id}`,
        {
          groupCodes: form.groupCodes, // 서버 스펙에 맞게 key 조정
          memo: form.memo,
        },
        { headers: { Authorization: `Bearer ${token}` } },
      );
      // 저장 후 상세로 복귀 (state로 최신 값도 같이 넘겨주면 즉시 반영됨)
      navigate(`/mangedCustomer/${id}`, {
        state: {
          ...(state ?? {}),
          groupCodes: form.groupCodes,
          memo: form.memo,
        },
      });
    } catch (e) {
      console.error("저장 실패", e);
      alert("저장에 실패했습니다.");
    } finally {
      setSaving(false);
    }
  };

  // 그룹 저장
  const handleConfirmGroups = async (groups: string[]) => {
    // UI 전용 값 제거
    const payload = groups.filter(g => g !== "전체");

    // 변경 없는 경우 네트워크 호출 생략
    const same =
      [...payload].sort().join("|") === [...form.groupCodes].sort().join("|");
    if (same) {
      setIsGroupModalOpen(false);
      return;
    }

    // 로컬 상태는 "부분 갱신"만 (memo 유지)
    setForm(prev => ({ ...prev, groupCodes: payload }));

    // 전체 그룹 리스트에도 병합(중복 제거)
    setAllGroups(prev => Array.from(new Set([...prev, ...payload])));

    setIsGroupModalOpen(false);
  };
  return (
    <div className="mx-auto flex h-screen w-[375px] flex-col bg-[var(--color-grey-1000)] py-2">
      {/* 상단 */}
      <ClientHeader
        title={`${state?.name ?? ""} 고객님`}
        rightContent={
          <span className="label2 text-[var(--color-purple)]">
            {saving ? "저장중…" : "수정"}
          </span>
        }
        onRightClick={() => !saving && handleSave()}
      />

      {/* 수정사항 */}
      <div>
        {/*그룹 설정*/}
        <div className="mb-9 px-5">
          <div className="label1 flex gap-[3px] py-2">
            <label className="label1 text-[var(--color-grey-150)]">
              그룹 설정
            </label>
          </div>
          <div
            onClick={() => setIsGroupModalOpen(true)}
            className="body2 flex h-[45px] w-full items-center justify-between rounded-[6px] border-[1px] border-[var(--color-grey-650)] bg-[var(--color-grey-950)] px-4 py-[12px] text-[var(--color-grey-550)]"
          >
            <div className="flex gap-2">
              {form.groupCodes.length === 0 ? (
                <span className="body2 items-center text-[var(--color-grey-550)]">
                  그룹을 선택해주세요
                </span>
              ) : (
                <>
                  {form.groupCodes.slice(0, MAX_VISIBLE_CHIPS).map(group => (
                    <div
                      key={group}
                      className="flex h-[30px] items-center justify-center gap-[6px] rounded-[20px] border border-[1.5px] border-[var(--color-purple)] bg-[var(--color-dark-purple)] py-1 pr-[10px] pl-3 text-[var(--color-grey-150)]"
                    >
                      <span>{group}</span>
                      <button
                        onClick={e => {
                          e.stopPropagation();
                          setForm(prev => ({
                            ...prev,
                            groupCodes: prev.groupCodes.filter(
                              g => g !== group,
                            ),
                          }));
                        }}
                      >
                        <svg
                          width="16"
                          height="16"
                          viewBox="0 0 16 16"
                          fill="none"
                          xmlns="http://www.w3.org/2000/svg"
                        >
                          <path
                            d="M11.3337 4.6665L4.66699 11.3332M4.66699 4.6665L11.3337 11.3332"
                            stroke="#DDDDDD"
                            strokeWidth="1.5" /* camelCase */
                            strokeLinecap="round"
                            strokeLinejoin="round"
                          />
                        </svg>
                      </button>
                    </div>
                  ))}

                  {/* +n 뱃지 */}
                  {form.groupCodes.length > MAX_VISIBLE_CHIPS && (
                    <button
                      className="flex h-[30px] items-center justify-center rounded-[20px] bg-[var(--color-grey-800)] text-[var(--color-grey-150)]"
                      onClick={() => setIsGroupModalOpen(true)}
                    >
                      + {form.groupCodes.length - MAX_VISIBLE_CHIPS}
                    </button>
                  )}
                </>
              )}
            </div>
            <button
              className="cursor-pointer"
              onClick={() => setIsGroupModalOpen(true)}
            >
              <svg
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M6 9L12 15L18 9"
                  stroke="#BDBEBD"
                  stroke-width="1.5"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                />
              </svg>
            </button>
          </div>
        </div>

        {/* 기타 메모 */}
        <div className="mb-9 px-5">
          <label className="label1 block py-3 text-[var(--color-grey-150)]">
            기타 메모
          </label>
          <input
            value={form.memo}
            onChange={e => setForm(prev => ({ ...prev, memo: e.target.value }))}
            maxLength={500}
            className="body2 flex w-full justify-between rounded-[6px] border-[1px] border-[var(--color-grey-650)] bg-[var(--color-grey-950)] px-4 py-[12px] text-[var(--color-grey-150)]"
            placeholder="특이사항을 기록해주세요."
          />
          <div className="caption2 mt-[3px] flex justify-end text-[var(--color-grey-550)]">
            {form.memo.length}/500
          </div>
        </div>
      </div>

      {/* 하단 */}
      <ManagerNavbar />

      {/* 그룹 설정 모달 */}
      <GroupSettingModal
        visible={isGroupModalOpen}
        onClose={() => setIsGroupModalOpen(false)}
        initialGroups={allGroups}
        initialSelectedGroups={form.groupCodes}
        onAddGroup={(name: string) =>
          setAllGroups(prev => (prev.includes(name) ? prev : [...prev, name]))
        }
        onConfirm={handleConfirmGroups}
      />
    </div>
  );
}
