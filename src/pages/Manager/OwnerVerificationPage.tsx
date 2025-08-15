import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import {
  Home,
  User,
  MessageSquare,
  Calendar,
  MoreHorizontal,
  ChevronRight,
  ShieldAlert,
  Pencil,
  Image,
  DollarSign,
  Clock,
  Plus,
} from "lucide-react";

// --- API 클라이언트 설정 ---
const apiClient = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL, // API 기본 URL 설정
});

// 인터셉터: 모든 요청에 Authorization 헤더 추가
apiClient.interceptors.request.use(config => {
  const token =
    "eyJhbGciOiJIUzI1NiJ9.eyJwcm92aWRlciI6Imtha2FvLXN0YWZmIiwia2FrYW9JZCI6IjQzODc2OTc3OTYiLCJ1c2VySWQiOjYwLCJlbWFpbCI6Impvb245ODA5MjNAbmF2ZXIuY29tIiwiaWF0IjoxNzU1MTQ3NTEyLCJleHAiOjE3NTc3Mzk1MTJ9.usNX4xb-pfiBMM4TPYjlLhmwLeoa2lSFZO6O1KOvLEo";
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

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
}

interface TreatmentImage {
  id: number;
  imageUrl: string;
}

type ServiceCategory = "hand" | "feet" | "cf";

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

// --- 데이터 형식 변환을 위한 맵 (OwnerBusinessHoursPage에서 재사용) ---
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
  // --- 라우팅 훅 ---
  const navigate = useNavigate();
  const { shopId } = useParams<{ shopId: string }>();

  // --- 상태 관리 ---
  const [shopData, setShopData] = useState<ShopData | null>(null);
  const [services, setServices] = useState<Service[]>([]);
  const [notices, setNotices] = useState<Notice[]>([]);

  const [businessLicenseStatus] = useState<"미인증" | "확인중" | "인증완료">(
    "미인증",
  );

  const [isLoading, setIsLoading] = useState(true);
  const [isServiceLoading, setIsServiceLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [activeTab, setActiveTab] = useState<"basic" | "services" | "notices">(
    "basic",
  );
  const [activeServiceCategory, setActiveServiceCategory] =
    useState<ServiceCategory>("hand");

  // 새로운 영업 시간 및 휴일 관련 상태 추가
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

  // --- 데이터 페칭: 매장 정보, 공지사항, 영업 시간, 휴일 (페이지 로드 시 한 번) ---
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
          apiClient.get(`/shops/manage/${shopId}`),
          apiClient.get(`/shops/${shopId}/notices`),
          apiClient.get(`/shops/manage/${shopId}/business-hours`), // 영업 시간 API 호출
          apiClient.get(`/shops/manage/${shopId}/holidays`), // 휴일 API 호출
        ]);

        // --- 매장 정보 처리 ---
        if (
          shopManageResponse.status === "fulfilled" &&
          shopManageResponse.value.data?.data
        ) {
          const rawData = shopManageResponse.value.data.data;

          const depositAmount =
            rawData.depositAmount ||
            rawData.deposit_amount ||
            rawData.depositPrice ||
            rawData.deposit_price ||
            rawData.reservationDeposit ||
            rawData.reservation_deposit;

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
          };

          setShopData(mappedShopData);
        } else if (shopManageResponse.status === "rejected") {
          console.error("매장 정보 로딩 실패:", shopManageResponse.reason);
          setShopData(null);
        }

        // --- 공지사항 처리 ---
        // ✅ 디버깅을 위해 API 응답을 콘솔에 출력
        if (noticesResponse.status === "fulfilled") {
          console.log("공지사항 API 응답:", noticesResponse.value.data);
          if (noticesResponse.value.data && noticesResponse.value.data.data) {
            const mappedNotices = noticesResponse.value.data.data.map(
              (item: any) => ({
                id: item.noticeId,
                title: item.title,
                content: item.content,
              }),
            );
            setNotices(mappedNotices);
          } else {
            setNotices([]);
          }
        } else if (noticesResponse.status === "rejected") {
          console.error("공지사항 로딩 실패:", noticesResponse.reason);
          setNotices([]);
        }

        // --- 영업 시간 처리 ---
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
          setBusinessHours({
            openTime: "",
            closeTime: "",
            breakStart: "",
            breakEnd: "",
          });
        }

        // --- 정기 휴일 처리 ---
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
          } else {
            setRegularHoliday({ cycle: "", daysOfWeek: [] });
          }
        } else if (holidaysResponse.status === "rejected") {
          console.error(
            "휴일 정보 로딩 중 에러 발생:",
            holidaysResponse.reason,
          );
          setRegularHoliday({ cycle: "", daysOfWeek: [] });
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

  // --- 데이터 페칭: 시술 목록 (카테고리 변경 시) ---
  useEffect(() => {
    if (!shopId) return;

    const fetchServices = async () => {
      setIsServiceLoading(true);
      try {
        const response = await apiClient.get(`/shops/${shopId}/treatments`, {
          params: { category: activeServiceCategory },
        });
        // ✅ 디버깅을 위해 API 응답을 콘솔에 출력
        console.log("시술 목록 API 응답:", response.data);

        if (response.data && response.data.data) {
          const mappedServices = response.data.data.map((item: any) => ({
            ...item,
            duration: item.durationMinutes,
            // imageUrl은 item.images 배열의 첫 번째 요소에서 가져오거나, 없으면 undefined
            imageUrl:
              item.images && item.images.length > 0
                ? item.images[0].imageUrl
                : undefined,
          }));
          setServices(mappedServices);
        } else {
          setServices([]);
        }
      } catch (err) {
        console.error(`${activeServiceCategory} 카테고리 시술 로딩 실패:`, err);
        // ✅ 오류 발생 시 서비스 목록을 비웁니다.
        setServices([]);
      } finally {
        setIsServiceLoading(false);
      }
    };

    fetchServices();
  }, [shopId, activeServiceCategory]);

  // --- 로딩 및 에러 처리 ---
  if (isLoading) {
    return (
      <div
        className="mx-auto flex min-h-screen max-w-sm items-center justify-center"
        style={{ backgroundColor: "#1A1A1A", color: "white" }}
      >
        데이터를 불러오는 중...
      </div>
    );
  }

  if (error) {
    return (
      <div
        className="mx-auto flex min-h-screen max-w-sm items-center justify-center"
        style={{ backgroundColor: "#1A1A1A", color: "white" }}
      >
        {error}
      </div>
    );
  }

  if (!shopData) {
    return (
      <div
        className="mx-auto flex min-h-screen max-w-sm items-center justify-center"
        style={{ backgroundColor: "#1A1A1A", color: "white" }}
      >
        매장 정보를 표시할 수 없습니다.
      </div>
    );
  }

  // 영업 시간 표시 헬퍼 함수
  const formatBusinessHours = () => {
    const { openTime, closeTime, breakStart, breakEnd } = businessHours;
    let hoursString = "";

    if (openTime && closeTime) {
      hoursString += `${openTime} ~ ${closeTime}`;
    } else {
      hoursString += "정보 없음";
    }

    if (breakStart && breakEnd) {
      hoursString += ` (브레이크 ${breakStart} ~ ${breakEnd})`;
    }
    return hoursString;
  };

  // 정기 휴무일 표시 헬퍼 함수
  const formatRegularHoliday = () => {
    const { cycle, daysOfWeek } = regularHoliday;
    if (cycle && daysOfWeek.length > 0) {
      return `${cycle} ${daysOfWeek.join(", ")}`;
    }
    return "정기 휴무일 없음";
  };

  return (
    // 메인 컨테이너에 relative 포지션을 추가하여 자식 absolute 요소를 기준으로 삼도록 합니다.
    <div
      className="relative mx-auto min-h-screen max-w-sm font-sans text-white"
      style={{ backgroundColor: "#1A1A1A" }}
    >
      <div className="pb-20">
        <header className="flex items-center justify-between px-5 py-4">
          <span className="text-2xl font-bold" style={{ color: "#8B5CF6" }}>
            BEAUTIFLOW
          </span>
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
            <h2 className="text-xl font-semibold text-white">
              {shopData.shopName}
            </h2>
            <p className="truncate text-sm text-gray-400">
              {shopData.introduction || "매장 소개가 없습니다."}
            </p>
          </div>
        </div>

        {businessLicenseStatus === "미인증" && (
          <div className="my-2 px-5">
            <button
              onClick={() => navigate(`/owner-business-registration/${shopId}`)}
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
                  ? "border-b-2 font-semibold"
                  : "border-transparent"
              }`}
              style={{
                color: activeTab === tab.key ? "#A78BFA" : "#9CA3AF",
                borderBottomColor:
                  activeTab === tab.key ? "#A78BFA" : "transparent",
              }}
            >
              {tab.label}
            </button>
          ))}
        </div>

        <div className="flex-1 overflow-y-auto px-5 py-4">
          {activeTab === "basic" && (
            <div className="space-y-6">
              <div
                className="rounded-lg p-4"
                style={{ backgroundColor: "#1A1A1A" }}
              >
                <div className="mb-4 flex items-center justify-between">
                  <h3 className="font-medium text-white">매장 정보</h3>
                  <button
                    className="text-sm"
                    style={{ color: "#A78BFA" }}
                    onClick={() => navigate(`/owner/store-info/${shopId}`)}
                  >
                    수정
                  </button>
                </div>
                <div className="space-y-3">
                  <div className="flex items-center gap-2">
                    <Home size={16} className="text-gray-400" />
                    <span className="text-sm">{shopData.shopName || "-"}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <MessageSquare size={16} className="text-gray-400" />
                    <span className="text-sm">{shopData.contact || "-"}</span>
                  </div>
                  <div className="flex items-start gap-2">
                    <Clock size={16} className="mt-0.5 text-gray-400" />
                    <span className="text-sm leading-relaxed">
                      {shopData.address || "-"}
                    </span>
                  </div>
                </div>
              </div>

              <div
                className="rounded-lg p-4"
                style={{ backgroundColor: "#1A1A1A" }}
              >
                <div className="mb-4 flex items-center justify-between">
                  <h3 className="font-medium text-white">매장 소개</h3>
                  <button
                    className="text-sm"
                    style={{ color: "#A78BFA" }}
                    onClick={() => navigate(`/owner/store-intro/${shopId}`)}
                  >
                    수정
                  </button>
                </div>
                <div className="space-y-3">
                  <div className="flex items-center gap-2">
                    <Pencil size={16} className="text-gray-400" />
                    <span className="text-sm">
                      {shopData.introduction || "-"}
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Image size={16} className="text-gray-400" />
                    <span className="text-sm">
                      {shopData.mainImageUrl ? "대표 이미지 등록됨" : "-"}
                    </span>
                  </div>
                </div>
              </div>

              <div
                className="rounded-lg p-4"
                style={{ backgroundColor: "#1A1A1A" }}
              >
                <div className="mb-4 flex items-center justify-between">
                  <h3 className="font-medium text-white">매출 관리</h3>
                  <button
                    className="text-sm"
                    style={{ color: "#A78BFA" }}
                    onClick={() => navigate(`/owner/sales/${shopId}`)}
                  >
                    수정
                  </button>
                </div>
                <div className="space-y-3">
                  <div className="flex items-center gap-2">
                    <DollarSign size={16} className="text-gray-400" />
                    <span className="text-sm">
                      {(() => {
                        if (
                          shopData.depositAmount === undefined ||
                          shopData.depositAmount === null
                        ) {
                          return "예약금 미설정";
                        }
                        if (shopData.depositAmount === 0) {
                          return "0원 (무료)";
                        }
                        if (typeof shopData.depositAmount === "number") {
                          return `${shopData.depositAmount.toLocaleString()}원`;
                        }
                        const numAmount = Number(shopData.depositAmount);
                        if (!isNaN(numAmount)) {
                          return `${numAmount.toLocaleString()}원`;
                        }
                        return `${shopData.depositAmount}원`;
                      })()}
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Pencil size={16} className="text-gray-400" />
                    <span className="text-sm">
                      {shopData.accountHolder || "-"}
                    </span>
                  </div>
                </div>
              </div>

              <div
                className="rounded-lg p-4"
                style={{ backgroundColor: "#1A1A1A" }}
              >
                <div className="mb-4 flex items-center justify-between">
                  <h3 className="font-medium text-white">영업 시간</h3>
                  <button
                    className="text-sm"
                    style={{ color: "#A78BFA" }}
                    onClick={() => navigate(`/owner/hours/${shopId}`)}
                  >
                    수정
                  </button>
                </div>
                <div className="space-y-3">
                  <div className="flex items-start gap-2">
                    <Clock size={16} className="mt-0.5 text-gray-400" />
                    <span className="text-sm leading-relaxed">
                      {formatBusinessHours()}
                    </span>
                  </div>
                  <div className="flex items-start gap-2">
                    <Calendar size={16} className="mt-0.5 text-gray-400" />
                    <span className="text-sm leading-relaxed">
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
                  { key: "hand", label: "손" },
                  { key: "feet", label: "발" },
                  { key: "cf", label: "기타" },
                ].map(category => (
                  <button
                    key={category.key}
                    onClick={() =>
                      setActiveServiceCategory(category.key as ServiceCategory)
                    }
                    className={`rounded-full border px-4 py-2 text-sm font-medium transition-colors ${
                      activeServiceCategory === category.key
                        ? "font-semibold text-white"
                        : "text-gray-300"
                    }`}
                    style={
                      activeServiceCategory === category.key
                        ? { backgroundColor: "#6B21A8", borderColor: "#A78BFA" }
                        : {
                            backgroundColor: "transparent",
                            borderColor: "#404040",
                          }
                    }
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
                    <div className="py-8 text-center text-gray-400">
                      등록된 시술이 없습니다.
                    </div>
                  ) : (
                    services.map(service => (
                      <div key={service.id} className="flex gap-4">
                        <div className="h-20 w-20 flex-shrink-0 rounded-md bg-gray-700">
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
                            <h4 className="text-base font-medium text-white">
                              {service.name}
                            </h4>
                            <span className="flex items-center gap-1 rounded-full bg-gray-800 px-2 py-1 text-xs text-gray-400">
                              <Clock size={12} />
                              {service.duration}분
                            </span>
                          </div>
                          <p
                            className="mb-1 text-lg font-bold"
                            style={{ color: "#A78BFA" }}
                          >
                            {service.price.toLocaleString()}원
                          </p>
                          <p className="line-clamp-2 text-sm leading-relaxed text-gray-400">
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
                <div className="py-8 text-center text-gray-400">
                  등록된 공지사항이 없습니다.
                </div>
              ) : (
                notices.map(notice => (
                  <div
                    key={notice.id}
                    className="rounded-lg p-4"
                    style={{ backgroundColor: "#262626" }}
                  >
                    <div className="mb-2 flex items-center justify-between">
                      <h4 className="font-medium text-white">{notice.title}</h4>
                      <ChevronRight size={20} className="text-gray-400" />
                    </div>
                    <p className="line-clamp-2 text-sm leading-relaxed text-gray-400">
                      {notice.content}
                    </p>
                  </div>
                ))
              )}
            </div>
          )}
        </div>
      </div>

      {/* '+' 버튼 위치 수정: 'fixed' 대신 'absolute'를 사용하고 부모 컨테이너에 relative를 줍니다. */}
      {(activeTab === "services" || activeTab === "notices") && (
        <button
          className="absolute right-5 bottom-24 flex h-14 w-14 items-center justify-center rounded-full shadow-lg transition-colors"
          style={{ backgroundColor: "#8B5CF6" }}
        >
          <Plus size={28} className="text-white" />
        </button>
      )}

      <nav
        className="fixed right-0 bottom-0 left-0 mx-auto flex w-full max-w-sm items-center justify-around border-t border-gray-800 py-3"
        style={{ backgroundColor: "#1A1A1A" }}
      >
        <button className="flex flex-col items-center gap-1 text-gray-400">
          <Calendar size={24} />
          <span className="text-xs">예약</span>
        </button>
        <button className="flex flex-col items-center gap-1 text-gray-400">
          <User size={24} />
          <span className="text-xs">고객</span>
        </button>
        <button className="flex flex-col items-center gap-1 text-gray-400">
          <MessageSquare size={24} />
          <span className="text-xs">채팅</span>
        </button>
        <button
          className="flex flex-col items-center gap-1"
          style={{ color: "#A78BFA" }}
        >
          <Home size={24} />
          <span className="text-xs">매장</span>
        </button>
        <button className="flex flex-col items-center gap-1 text-gray-400">
          <MoreHorizontal size={24} />
          <span className="text-xs">더보기</span>
        </button>
      </nav>
    </div>
  );
};

export default OwnerVerificationPage;
