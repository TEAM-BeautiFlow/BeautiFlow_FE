import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import {
  Home,
  MessageSquare,
  Calendar,
  ChevronRight,
  ShieldAlert,
  Pencil,
  Image,
  DollarSign,
  Clock,
  Plus,
  X,
} from "lucide-react";
import api from "@/apis/axiosInstance"; // 🔽 api 인스턴스를 import 합니다.
import ManagerNavbar from "@/layout/ManagerNavbar"; // 🔽 ManagerNavbar를 import 합니다.
import "../../styles/color-system.css";
import "../../styles/type-system.css";
import Header from "@/layout/Header";

// --- 타입 정의 ---
interface ShopImage {
  id: number;
  imageUrl: string;
}

interface ShopData {
  shopName: string;
  contact?: string;
  address?: string;
  introduction?: string;
  mainImageUrl?: string;
  link?: string;
  accountInfo?: string;
  shopImages?: ShopImage[];
  depositAmount?: number;
  accountHolder?: string;
  verificationStatus?: "NONE" | "PENDING" | "VERIFIED"; // 인증 상태 추가
}

interface TreatmentImage {
  id: number;
  imageUrl: string;
}

type ServiceCategory = "HAND" | "FEET" | "ETC"; // API 명세에 맞게 대문자로 변경

interface Service {
  id: number;
  category: ServiceCategory;
  name: string;
  price: number;
  duration: number;
  description: string;
  imageUrl?: string;
  images?: TreatmentImage[];
}

interface Notice {
  id: number;
  title: string;
  content: string;
}

// --- 데이터 형식 변환 맵 ---
const cycleUiMap: Record<string, string> = {
  WEEKLY: "매주",
  BIWEEKLY: "격주",
  FIRST_WEEK: "매달 첫째 주",
  SECOND_WEEK: "매달 둘째 주",
  THIRD_WEEK: "매달 셋째 주",
  FOURTH_WEEK: "매달 넷째 주",
  FIFTH_WEEK: "매달 다섯째 주",
};

const dayUiMap: Record<string, string> = {
  MON: "월요일",
  TUE: "화요일",
  WED: "수요일",
  THU: "목요일",
  FRI: "금요일",
  SAT: "토요일",
  SUN: "일요일",
};

const OwnerVerificationPage = () => {
  const navigate = useNavigate();
  const { shopId } = useParams<{ shopId: string }>();

  const [shopData, setShopData] = useState<ShopData | null>(null);
  const [services, setServices] = useState<Service[]>([]);
  const [notices, setNotices] = useState<Notice[]>([]);

  const [isLoading, setIsLoading] = useState(true);
  const [isServiceLoading, setIsServiceLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [activeTab, setActiveTab] = useState<"basic" | "services" | "notices">(
    "basic",
  );
  const [activeServiceCategory, setActiveServiceCategory] =
    useState<ServiceCategory>("HAND");

  const [businessHours, setBusinessHours] = useState({
    openTime: "",
    closeTime: "",
    breakStart: "",
    breakEnd: "",
  });
  const [regularHoliday, setRegularHoliday] = useState({
    cycle: "",
    daysOfWeek: [] as string[],
  });

  // 공지사항 삭제 함수
  const handleDeleteNotice = async (noticeId: number, e: React.MouseEvent) => {
    e.stopPropagation(); // 클릭 이벤트 전파 방지

    if (!window.confirm("이 공지사항을 삭제하시겠습니까?")) {
      return;
    }

    try {
      await api.delete(`/shops/${shopId}/notices/${noticeId}`);
      // 성공적으로 삭제되면 목록에서 제거
      setNotices(prevNotices =>
        prevNotices.filter(notice => notice.id !== noticeId),
      );
      alert("공지사항이 성공적으로 삭제되었습니다.");
    } catch (error) {
      console.error("공지사항 삭제 실패:", error);
      alert("삭제에 실패했습니다. 다시 시도해주세요.");
    }
  };

  useEffect(() => {
    if (!shopId) {
      setError("매장 ID가 유효하지 않습니다.");
      setIsLoading(false);
      return;
    }

    const fetchInitialData = async () => {
      setIsLoading(true);
      try {
        const [
          shopManageResponse,
          noticesResponse,
          hoursResponse,
          holidaysResponse,
        ] = await Promise.allSettled([
          api.get(`/shops/manage/${shopId}`),
          api.get(`/shops/${shopId}/notices`),
          api.get(`/shops/manage/${shopId}/business-hours`),
          api.get(`/shops/manage/${shopId}/holidays`),
        ]);

        if (
          shopManageResponse.status === "fulfilled" &&
          shopManageResponse.value.data?.data
        ) {
          const rawData = shopManageResponse.value.data.data;
          const depositAmount = rawData.depositAmount;

          const mappedShopData: ShopData = {
            shopName: rawData.shopName,
            contact: rawData.contact,
            address: rawData.address,
            introduction: rawData.introduction,
            link: rawData.link,
            shopImages: rawData.shopImages,
            mainImageUrl: rawData.shopImages?.[0]?.imageUrl,
            depositAmount: depositAmount ? Number(depositAmount) : undefined,
            accountHolder: rawData.accountHolder,
            verificationStatus: rawData.verificationStatus,
          };
          setShopData(mappedShopData);
        } else if (shopManageResponse.status === "rejected") {
          console.error("매장 정보 로딩 실패:", shopManageResponse.reason);
          setShopData(null);
        }

        if (
          noticesResponse.status === "fulfilled" &&
          noticesResponse.value.data?.data
        ) {
          const mappedNotices = noticesResponse.value.data.data.map(
            (item: any) => ({
              id: item.noticeId,
              title: item.title,
              content: item.content,
            }),
          );
          setNotices(mappedNotices);
        } else if (noticesResponse.status === "rejected") {
          console.error("공지사항 로딩 실패:", noticesResponse.reason);
          setNotices([]);
        }

        if (
          hoursResponse.status === "fulfilled" &&
          hoursResponse.value.data?.data
        ) {
          const { openTime, closeTime, breakStart, breakEnd } =
            hoursResponse.value.data.data;
          setBusinessHours({
            openTime: openTime?.slice(0, 5) || "",
            closeTime: closeTime?.slice(0, 5) || "",
            breakStart: breakStart?.slice(0, 5) || "",
            breakEnd: breakEnd?.slice(0, 5) || "",
          });
        } else if (hoursResponse.status === "rejected") {
          console.error("영업 시간 로딩 중 에러 발생:", hoursResponse.reason);
        }

        if (
          holidaysResponse.status === "fulfilled" &&
          holidaysResponse.value.data?.data
        ) {
          const holidayData = holidaysResponse.value.data.data;
          if (Array.isArray(holidayData) && holidayData.length > 0) {
            const { cycle, daysOfWeek } = holidayData[0];
            setRegularHoliday({
              cycle: cycleUiMap[cycle] || "",
              daysOfWeek: daysOfWeek?.map((day: string) => dayUiMap[day]) || [],
            });
          }
        } else if (holidaysResponse.status === "rejected") {
          console.error(
            "휴일 정보 로딩 중 에러 발생:",
            holidaysResponse.reason,
          );
        }
      } catch (err) {
        console.error("초기 데이터 로딩 실패:", err);
        setError("매장 정보를 불러오는 데 실패했습니다.");
      } finally {
        setIsLoading(false);
      }
    };

    fetchInitialData();
  }, [shopId]);

  useEffect(() => {
    if (!shopId) return;
    const fetchServices = async () => {
      setIsServiceLoading(true);
      try {
        const toApiCategory = (cat: ServiceCategory) =>
          cat === "ETC" ? "cf" : cat.toLowerCase();
        const response = await api.get(`/shops/${shopId}/treatments`, {
          params: { category: toApiCategory(activeServiceCategory) },
        });
        if (response.data && response.data.data) {
          const mappedServices = response.data.data.map((item: any) => ({
            ...item,
            duration: item.durationMinutes,
            imageUrl: item.images?.[0]?.imageUrl,
          }));
          setServices(mappedServices);
        } else {
          setServices([]);
        }
      } catch (err) {
        console.error(`${activeServiceCategory} 카테고리 시술 로딩 실패:`, err);
        setServices([]);
      } finally {
        setIsServiceLoading(false);
      }
    };
    fetchServices();
  }, [shopId, activeServiceCategory]);

  if (isLoading) {
    return (
      <div className="mx-auto flex min-h-screen max-w-sm items-center justify-center bg-[#1A1A1A] text-[var(--color-grey-150)]">
        데이터를 불러오는 중...
      </div>
    );
  }

  if (error) {
    return (
      <div className="mx-auto flex min-h-screen max-w-sm items-center justify-center bg-[#1A1A1A] text-[var(--color-grey-150)]">
        {error}
      </div>
    );
  }

  if (!shopData) {
    return (
      <div className="mx-auto flex min-h-screen max-w-sm items-center justify-center bg-[#1A1A1A] text-[var(--color-grey-150)]">
        매장 정보를 표시할 수 없습니다.
      </div>
    );
  }

  const formatBusinessHours = () => {
    const { openTime, closeTime, breakStart, breakEnd } = businessHours;
    let hoursString =
      openTime && closeTime ? `${openTime} ~ ${closeTime}` : "정보 없음";
    if (breakStart && breakEnd)
      hoursString += ` (브레이크 ${breakStart} ~ ${breakEnd})`;
    return hoursString;
  };

  const formatRegularHoliday = () => {
    const { cycle, daysOfWeek } = regularHoliday;
    return cycle && daysOfWeek.length > 0
      ? `${cycle} ${daysOfWeek.join(", ")}`
      : "정기 휴무일 없음";
  };

  const navigateTo = (path: string) => () => navigate(path);

  return (
    <div className="relative mx-auto min-h-screen max-w-sm bg-[#1A1A1A] text-[var(--color-grey-150)]">
      {/* 🔽 pb-20 -> pb-28 로 수정하여 네비게이션 바 공간 확보 */}
      <div className="pb-28">
        <Header />

        <div className="flex items-center space-x-3 px-5 py-4">
          <div className="h-14 w-14 flex-shrink-0 rounded-full bg-[var(--color-grey-950)]">
            {shopData.mainImageUrl && (
              <img
                src={shopData.mainImageUrl}
                alt="매장 대표 이미지"
                className="h-full w-full rounded-full object-cover"
              />
            )}
          </div>
          <div className="flex-1">
            <h2 className="title1 text-[var(--color-grey-150)]">
              {shopData.shopName}
            </h2>
            <p className="caption2 truncate text-[var(--color-grey-450)]">
              {shopData.introduction || "매장 소개가 없습니다."}
            </p>
          </div>
        </div>

        {shopData.verificationStatus !== "VERIFIED" && (
          <div className="my-2 px-5">
            <button
              onClick={navigateTo(`/owner/business-registration/${shopId}`)}
              className="w-full cursor-pointer"
            >
              <div className="flex w-full items-center justify-between rounded-lg bg-[#4B2024] p-4 text-[#D2636A]">
                <div className="flex items-center gap-2">
                  <ShieldAlert size={20} />
                  <span className="body1">사업자등록증 인증 필요</span>
                </div>
                <ChevronRight size={20} />
              </div>
            </button>
          </div>
        )}

        <div className="mt-2 flex border-b border-[var(--color-grey-750)] px-5">
          {[
            { key: "basic", label: "기본" },
            { key: "services", label: "시술" },
            { key: "notices", label: "공지사항" },
          ].map(tab => (
            <button
              key={tab.key}
              onClick={() => setActiveTab(tab.key as any)}
              className={`h1 border-b-2 px-2 py-3 transition-colors ${
                activeTab === tab.key
                  ? "border-b-2 border-[var(--color-grey-150)] text-[var(--color-grey-150)]"
                  : "border-transparent text-[var(--color-grey-750)]"
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        <div className="flex-1 overflow-y-auto px-5 py-4">
          {activeTab === "basic" && (
            <div className="space-y-6">
              {/* 매장 정보, 소개, 매출 관리, 영업 시간 카드들 */}
              <div className="rounded-lg bg-[#1A1A1A] p-4">
                <div className="mb-4 flex items-center justify-between">
                  <h3 className="title2 text-[var(--color-grey-150)]">
                    매장 정보
                  </h3>
                  <button
                    className="body2 text-[var(--color-light-purple)]"
                    onClick={navigateTo(`/owner/store-info/${shopId}`)}
                  >
                    수정
                  </button>
                </div>
                <div className="space-y-3">
                  <div className="flex items-center gap-2">
                    <Home size={16} className="text-[var(--color-grey-150)]" />
                    <span className="body2">{shopData.shopName || "-"}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <MessageSquare
                      size={16}
                      className="text-[var(--color-grey-150)]"
                    />
                    <span className="body2">{shopData.contact || "-"}</span>
                  </div>
                  <div className="flex items-start gap-2">
                    <Clock
                      size={16}
                      className="mt-0.5 text-[var(--color-grey-150)]"
                    />
                    <span className="body2 leading-relaxed">
                      {shopData.address || "-"}
                    </span>
                  </div>
                </div>
              </div>
              <div className="rounded-lg bg-[#1A1A1A] p-4">
                <div className="mb-4 flex items-center justify-between">
                  <h3 className="title2 text-[var(--color-grey-150)]">
                    매장 소개
                  </h3>
                  <button
                    className="body2 text-[var(--color-light-purple)]"
                    onClick={navigateTo(`/owner/store-intro/${shopId}`)}
                  >
                    수정
                  </button>
                </div>
                <div className="space-y-3">
                  <div className="flex items-center gap-2">
                    <Pencil
                      size={16}
                      className="text-[var(--color-grey-150)]"
                    />
                    <span className="body2">
                      {shopData.introduction || "-"}
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Image size={16} className="text-[var(--color-grey-150)]" />
                    <span className="body2">
                      {shopData.mainImageUrl ? "대표 이미지 등록됨" : "-"}
                    </span>
                  </div>
                </div>
              </div>
              <div className="rounded-lg bg-[#1A1A1A] p-4">
                <div className="mb-4 flex items-center justify-between">
                  <h3 className="title2 text-[var(--color-grey-150)]">
                    매출 관리
                  </h3>
                  <button
                    className="body2 text-[var(--color-light-purple)]"
                    onClick={navigateTo(`/owner/sales/${shopId}`)}
                  >
                    수정
                  </button>
                </div>
                <div className="space-y-3">
                  <div className="flex items-center gap-2">
                    <DollarSign
                      size={16}
                      className="text-[var(--color-grey-150)]"
                    />
                    <span className="body2">
                      {shopData.depositAmount
                        ? `${shopData.depositAmount.toLocaleString()}원`
                        : "-"}
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Pencil
                      size={16}
                      className="text-[var(--color-grey-150)]"
                    />
                    <span className="body2">
                      {shopData.accountHolder || "-"}
                    </span>
                  </div>
                </div>
              </div>
              <div className="rounded-lg bg-[#1A1A1A] p-4">
                <div className="mb-4 flex items-center justify-between">
                  <h3 className="title2 text-[var(--color-grey-150)]">
                    영업 시간
                  </h3>
                  <button
                    className="body2 text-[var(--color-light-purple)]"
                    onClick={navigateTo(`/owner/hours/${shopId}`)}
                  >
                    수정
                  </button>
                </div>
                <div className="space-y-3">
                  <div className="flex items-start gap-2">
                    <Clock
                      size={16}
                      className="mt-0.5 text-[var(--color-grey-150)]"
                    />
                    <span className="body2 leading-relaxed">
                      {formatBusinessHours()}
                    </span>
                  </div>
                  <div className="flex items-start gap-2">
                    <Calendar
                      size={16}
                      className="mt-0.5 text-[var(--color-grey-150)]"
                    />
                    <span className="body2 leading-relaxed">
                      {formatRegularHoliday()}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === "services" && (
            <div>
              <div className="mb-6 flex gap-2">
                {[
                  { key: "HAND", label: "손" },
                  { key: "FEET", label: "발" },
                  { key: "ETC", label: "기타" },
                ].map(category => (
                  <button
                    key={category.key}
                    onClick={() =>
                      setActiveServiceCategory(category.key as ServiceCategory)
                    }
                    className={`body1 rounded-full border px-4 py-2 transition-colors ${
                      activeServiceCategory === category.key
                        ? "body1 border-[var(--color-light-purple)] bg-[var(--color-purple)] text-[var(--color-grey-150)]"
                        : "border-[var(--color-grey-750)] bg-transparent text-[var(--color-grey-150)]"
                    }`}
                  >
                    {category.label}
                  </button>
                ))}
              </div>
              {isServiceLoading ? (
                <div className="py-8 text-center">
                  시술 목록을 불러오는 중...
                </div>
              ) : (
                <div className="space-y-4">
                  {services.length === 0 ? (
                    <div className="py-8 text-center text-[var(--color-grey-650)]">
                      등록된 시술이 없습니다.
                    </div>
                  ) : (
                    services.map(service => (
                      <div
                        key={service.id}
                        className="flex cursor-pointer gap-4"
                        onClick={navigateTo(
                          `/owner/treatments/edit/${shopId}/${service.id}`,
                        )}
                      >
                        <div className="h-20 w-20 flex-shrink-0 rounded-md bg-[var(--color-grey-850)]">
                          {service.imageUrl && (
                            <img
                              src={service.imageUrl}
                              alt={service.name}
                              className="h-full w-full rounded-md object-cover"
                            />
                          )}
                        </div>
                        <div className="flex-1">
                          <div className="mb-1 flex items-start justify-between">
                            <h4 className="title1 text-[var(--color-grey-50)]">
                              {service.name}
                            </h4>
                            <span className="caption1 flex items-center gap-1 rounded-full bg-[var(--color-grey-950)] px-2 py-1 text-[var(--color-grey-150)]">
                              <Clock size={12} />
                              {service.duration}분
                            </span>
                          </div>
                          <p className="body1 mb-1 text-[var(--color-light-purple)]">
                            {service.price.toLocaleString()}원
                          </p>
                          <p className="caption2 line-clamp-2 leading-relaxed text-[var(--color-grey-150)]">
                            {service.description}
                          </p>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              )}
            </div>
          )}

          {activeTab === "notices" && (
            <div className="space-y-4">
              {notices.length === 0 ? (
                <div className="py-8 text-center text-[var(--color-grey-650)]">
                  등록된 공지사항이 없습니다.
                </div>
              ) : (
                notices.map(notice => (
                  <div
                    key={notice.id}
                    className="group relative cursor-pointer rounded-lg bg-[#262626] p-4"
                    onClick={navigateTo(
                      `/owner/announcements/edit/${shopId}/${notice.id}`,
                    )}
                  >
                    <div className="mb-2 flex items-center justify-between">
                      <h4 className="pr-8 font-medium text-white">
                        {notice.title}
                      </h4>
                      <div className="flex items-center gap-2">
                        <button
                          onClick={e => handleDeleteNotice(notice.id, e)}
                          className="flex h-8 w-8 items-center justify-center rounded-full bg-red-600 opacity-0 transition-colors group-hover:opacity-100 hover:bg-red-700"
                          title="공지사항 삭제"
                        >
                          <X size={16} className="text-white" />
                        </button>
                        <ChevronRight size={20} className="text-gray-400" />
                      </div>
                    </div>
                    <p className="body2 line-clamp-2 leading-relaxed text-[var(--color-grey-150)]">
                      {notice.content}
                    </p>
                  </div>
                ))
              )}
            </div>
          )}
        </div>
      </div>

      {/* 🔽 bottom-24 -> bottom-[100px]로 수정하여 네비게이션 바와의 간격 확보 */}
      {(activeTab === "services" || activeTab === "notices") && (
        <button
          onClick={
            activeTab === "services"
              ? navigateTo(`/owner/treatments/create/${shopId}`)
              : navigateTo(`/owner/announcements/create/${shopId}`)
          }
          className="absolute right-5 bottom-[100px] flex h-14 w-14 items-center justify-center rounded-full bg-[var(--color-purple)] shadow-lg transition-colors"
        >
          <Plus size={28} className="text-[var(--color-grey-150)]" />
        </button>
      )}

      <ManagerNavbar />
    </div>
  );
};

export default OwnerVerificationPage;
