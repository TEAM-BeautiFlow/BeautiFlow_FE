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
      setNotices(prevNotices => prevNotices.filter(notice => notice.id !== noticeId));
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
          const depositAmount = rawData.depositAmount

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

        if (noticesResponse.status === "fulfilled" && noticesResponse.value.data?.data) {
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

        if (hoursResponse.status === "fulfilled" && hoursResponse.value.data?.data) {
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

        if (holidaysResponse.status === "fulfilled" && holidaysResponse.value.data?.data) {
          const holidayData = holidaysResponse.value.data.data;
          if (Array.isArray(holidayData) && holidayData.length > 0) {
            const { cycle, daysOfWeek } = holidayData[0];
            setRegularHoliday({
              cycle: cycleUiMap[cycle] || "",
              daysOfWeek: daysOfWeek?.map((day: string) => dayUiMap[day]) || [],
            });
          }
        } else if (holidaysResponse.status === "rejected") {
          console.error("휴일 정보 로딩 중 에러 발생:", holidaysResponse.reason);
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
        const response = await api.get(`/shops/${shopId}/treatments`, {
          params: { category: activeServiceCategory },
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
      <div className="mx-auto flex min-h-screen max-w-sm items-center justify-center bg-[#1A1A1A] text-white">
        데이터를 불러오는 중...
      </div>
    );
  }

  if (error) {
    return (
      <div className="mx-auto flex min-h-screen max-w-sm items-center justify-center bg-[#1A1A1A] text-white">
        {error}
      </div>
    );
  }

  if (!shopData) {
    return (
      <div className="mx-auto flex min-h-screen max-w-sm items-center justify-center bg-[#1A1A1A] text-white">
        매장 정보를 표시할 수 없습니다.
      </div>
    );
  }

  const formatBusinessHours = () => {
    const { openTime, closeTime, breakStart, breakEnd } = businessHours;
    let hoursString = (openTime && closeTime) ? `${openTime} ~ ${closeTime}` : "정보 없음";
    if (breakStart && breakEnd) hoursString += ` (브레이크 ${breakStart} ~ ${breakEnd})`;
    return hoursString;
  };

  const formatRegularHoliday = () => {
    const { cycle, daysOfWeek } = regularHoliday;
    return (cycle && daysOfWeek.length > 0) ? `${cycle} ${daysOfWeek.join(", ")}` : "정기 휴무일 없음";
  };
  
  const navigateTo = (path: string) => () => navigate(path);

  return (
    <div className="relative mx-auto min-h-screen max-w-sm font-sans text-white bg-[#1A1A1A]">
      {/* 🔽 pb-20 -> pb-28 로 수정하여 네비게이션 바 공간 확보 */}
      <div className="pb-28">
        <header className="flex items-center justify-between px-5 py-4">
          <span className="text-2xl font-bold text-[#8B5CF6]">BEAUTIFLOW</span>
        </header>

        <div className="flex items-center space-x-3 px-5 py-4">
          <div className="h-14 w-14 flex-shrink-0 rounded-full bg-gray-600">
            {shopData.mainImageUrl && (
              <img
                src={shopData.mainImageUrl}
                alt="매장 대표 이미지"
                className="h-full w-full rounded-full object-cover"
              />
            )}
          </div>
          <div className="flex-1">
            <h2 className="text-xl font-semibold text-white">{shopData.shopName}</h2>
            <p className="truncate text-sm text-gray-400">
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
              <div className="flex w-full items-center justify-between rounded-lg bg-red-900 p-4 text-red-300">
                <div className="flex items-center gap-2">
                  <ShieldAlert size={20} />
                  <span className="font-medium">사업자등록증 인증 필요</span>
                </div>
                <ChevronRight size={20} />
              </div>
            </button>
          </div>
        )}

        <div className="mt-2 flex border-b border-gray-800 px-5">
          {[
            { key: "basic", label: "기본" },
            { key: "services", label: "시술" },
            { key: "notices", label: "공지사항" },
          ].map(tab => (
            <button
              key={tab.key}
              onClick={() => setActiveTab(tab.key as any)}
              className={`border-b-2 px-2 py-3 font-medium transition-colors ${
                activeTab === tab.key
                  ? "border-b-2 font-semibold border-[#A78BFA] text-[#A78BFA]"
                  : "border-transparent text-[#9CA3AF]"
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
              <div className="rounded-lg p-4 bg-[#1A1A1A]">
                <div className="mb-4 flex items-center justify-between">
                  <h3 className="font-medium text-white">매장 정보</h3>
                  <button className="text-sm text-[#A78BFA]" onClick={navigateTo(`/owner/store-info/${shopId}`)}>수정</button>
                </div>
                <div className="space-y-3">
                  <div className="flex items-center gap-2"><Home size={16} className="text-gray-400" /><span className="text-sm">{shopData.shopName || "-"}</span></div>
                  <div className="flex items-center gap-2"><MessageSquare size={16} className="text-gray-400" /><span className="text-sm">{shopData.contact || "-"}</span></div>
                  <div className="flex items-start gap-2"><Clock size={16} className="mt-0.5 text-gray-400" /><span className="text-sm leading-relaxed">{shopData.address || "-"}</span></div>
                </div>
              </div>
              <div className="rounded-lg p-4 bg-[#1A1A1A]">
                <div className="mb-4 flex items-center justify-between">
                  <h3 className="font-medium text-white">매장 소개</h3>
                  <button className="text-sm text-[#A78BFA]" onClick={navigateTo(`/owner/store-intro/${shopId}`)}>수정</button>
                </div>
                <div className="space-y-3">
                  <div className="flex items-center gap-2"><Pencil size={16} className="text-gray-400" /><span className="text-sm">{shopData.introduction || "-"}</span></div>
                  <div className="flex items-center gap-2"><Image size={16} className="text-gray-400" /><span className="text-sm">{shopData.mainImageUrl ? "대표 이미지 등록됨" : "-"}</span></div>
                </div>
              </div>
              <div className="rounded-lg p-4 bg-[#1A1A1A]">
                <div className="mb-4 flex items-center justify-between">
                  <h3 className="font-medium text-white">매출 관리</h3>
                  <button className="text-sm text-[#A78BFA]" onClick={navigateTo(`/owner/sales/${shopId}`)}>수정</button>
                </div>
                <div className="space-y-3">
                  <div className="flex items-center gap-2"><DollarSign size={16} className="text-gray-400" /><span className="text-sm">{shopData.depositAmount ? `${shopData.depositAmount.toLocaleString()}원` : "-"}</span></div>
                  <div className="flex items-center gap-2"><Pencil size={16} className="text-gray-400" /><span className="text-sm">{shopData.accountHolder || "-"}</span></div>
                </div>
              </div>
              <div className="rounded-lg p-4 bg-[#1A1A1A]">
                <div className="mb-4 flex items-center justify-between">
                  <h3 className="font-medium text-white">영업 시간</h3>
                  <button className="text-sm text-[#A78BFA]" onClick={navigateTo(`/owner/hours/${shopId}`)}>수정</button>
                </div>
                <div className="space-y-3">
                  <div className="flex items-start gap-2"><Clock size={16} className="mt-0.5 text-gray-400" /><span className="text-sm leading-relaxed">{formatBusinessHours()}</span></div>
                  <div className="flex items-start gap-2"><Calendar size={16} className="mt-0.5 text-gray-400" /><span className="text-sm leading-relaxed">{formatRegularHoliday()}</span></div>
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
                    onClick={() => setActiveServiceCategory(category.key as ServiceCategory)}
                    className={`rounded-full border px-4 py-2 text-sm font-medium transition-colors ${
                      activeServiceCategory === category.key
                        ? "font-semibold text-white bg-[#6B21A8] border-[#A78BFA]"
                        : "text-gray-300 bg-transparent border-[#404040]"
                    }`}
                  >
                    {category.label}
                  </button>
                ))}
              </div>
              {isServiceLoading ? (
                <div className="py-8 text-center">시술 목록을 불러오는 중...</div>
              ) : (
                <div className="space-y-4">
                  {services.length === 0 ? (
                    <div className="py-8 text-center text-gray-400">등록된 시술이 없습니다.</div>
                  ) : (
                    services.map(service => (
                      <div key={service.id} className="flex gap-4 cursor-pointer" onClick={navigateTo(`/owner/treatments/edit/${shopId}/${service.id}`)}>
                        <div className="h-20 w-20 flex-shrink-0 rounded-md bg-gray-700">
                          {service.imageUrl && <img src={service.imageUrl} alt={service.name} className="h-full w-full rounded-md object-cover" />}
                        </div>
                        <div className="flex-1">
                          <div className="mb-1 flex items-start justify-between">
                            <h4 className="text-base font-medium text-white">{service.name}</h4>
                            <span className="flex items-center gap-1 rounded-full bg-gray-800 px-2 py-1 text-xs text-gray-400"><Clock size={12} />{service.duration}분</span>
                          </div>
                          <p className="mb-1 text-lg font-bold text-[#A78BFA]">{service.price.toLocaleString()}원</p>
                          <p className="line-clamp-2 text-sm leading-relaxed text-gray-400">{service.description}</p>
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
                <div className="py-8 text-center text-gray-400">등록된 공지사항이 없습니다.</div>
              ) : (
                notices.map(notice => (
                  <div key={notice.id} className="rounded-lg p-4 bg-[#262626] cursor-pointer relative group" onClick={navigateTo(`/owner/announcements/edit/${shopId}/${notice.id}`)}>
                    <div className="mb-2 flex items-center justify-between">
                      <h4 className="font-medium text-white pr-8">{notice.title}</h4>
                      <div className="flex items-center gap-2">
                        <button
                          onClick={(e) => handleDeleteNotice(notice.id, e)}
                          className="flex items-center justify-center w-8 h-8 rounded-full bg-red-600 hover:bg-red-700 transition-colors opacity-0 group-hover:opacity-100"
                          title="공지사항 삭제"
                        >
                          <X size={16} className="text-white" />
                        </button>
                        <ChevronRight size={20} className="text-gray-400" />
                      </div>
                    </div>
                    <p className="line-clamp-2 text-sm leading-relaxed text-gray-400">{notice.content}</p>
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
            activeTab === 'services' 
            ? navigateTo(`/owner/treatments/create/${shopId}`)
            : navigateTo(`/owner/announcements/create/${shopId}`)
          }
          className="absolute right-5 bottom-[100px] flex h-14 w-14 items-center justify-center rounded-full shadow-lg transition-colors bg-[#8B5CF6]"
        >
          <Plus size={28} className="text-white" />
        </button>
      )}

      <ManagerNavbar />
    </div>
  );
};

export default OwnerVerificationPage;