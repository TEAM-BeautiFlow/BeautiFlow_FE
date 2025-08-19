import { useState, type ChangeEvent } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { ChevronLeft, X, Plus, ChevronRight } from "lucide-react";
import api from "@/apis/axiosInstance";
import "../../styles/color-system.css";
import "../../styles/type-system.css";

import useBookingStore from "../../stores/bookingStore";

// API 요청 본문(request)의 타입
interface ReservationStepData {
  requestNotesStyleData?: {
    requestNotes: string;
  } | null;
}

const AppointmentBookingPage = () => {
  const { shopId } = useParams<{ shopId: string }>();
  const navigate = useNavigate();

  // Zustand 스토어에서 예약에 필요한 정보
  const { treatmentName, treatmentPrice, treatmentImageUrl } = useBookingStore();

  const [description, setDescription] = useState("");
  const [imageFiles, setImageFiles] = useState<File[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<"idle" | "processing">(
    "idle",
  );

  const handleImageChange = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const files = Array.from(e.target.files);
      if (imageFiles.length + files.length > 5) {
        alert("이미지는 최대 5개까지 첨부할 수 있습니다.");
        return;
      }
      setImageFiles(prev => [...prev, ...files]);
    }
  };

  const removeImage = (indexToRemove: number) => {
    setImageFiles(prev => prev.filter((_, index) => index !== indexToRemove));
  };

  /**
   * POST 함수 (JSON + 이미지)
   */
  const postStep = async (stepData: ReservationStepData, images: File[] = []) => {
    if (!shopId) {
      alert("샵 정보가 없습니다. 다시 시도해주세요.");
      return;
    }

    setIsSubmitting(true);
    setSubmitStatus("processing");

    const formData = new FormData();
    formData.append("request", JSON.stringify(stepData));

    images.forEach(file => {
      formData.append("referenceImages", file);
    });

    try {
      const response = await api.post(
        `/reservations/${shopId}/process`,
        formData,
      );

      if (response.data.success) {
        console.log("API 호출 성공:", response.data);
        return response.data;
      } else {
        throw new Error(
          response.data.message || "서버에서 요청 처리에 실패했습니다.",
        );
      }
    } catch (err: any) {
      let errorMessage = "요청 처리 중 오류가 발생했습니다.";
      if (err.response) {
        errorMessage = err.response.data.message || errorMessage;
        console.error("API Error Data:", err.response.data);
      } else if (err instanceof Error) {
        errorMessage = err.message;
      }
      console.error("Reservation Step Error:", err);
      alert(errorMessage);
      throw err;
    } finally {
      setIsSubmitting(false);
      setSubmitStatus("idle");
    }
  };

  // ✅ 요청사항만 보내는 단계
  const handleSaveRequestNotesStep = async () => {
    const stepData: ReservationStepData = {
      requestNotesStyleData: {
        requestNotes: description,
      },
    };

    try {
      const result = await postStep(stepData, imageFiles);
      if (result) {
        navigate(`/user/store/treatment-booking/${shopId}`);
      }
    } catch (error) {
      console.error("요청사항 단계 처리 실패");
    }
  };

  const getButtonText = () => {
    if (submitStatus === "processing") return "처리 중...";
    return "다음으로";
  };

  return (
    <div
      className="mx-auto min-h-screen max-w-sm"
      style={{
        backgroundColor: "var(--color-black)",
        color: "var(--color-white)",
      }}
    >
      {/* 헤더 */}
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          padding: "20px",
        }}
      >
        <button
          onClick={() => navigate(-1)}
          className="p-0 bg-transparent border-none cursor-pointer"
        >
          <ChevronLeft size={24} />
        </button>
        <h1 className="title1">시술 예약하기</h1>
        <button
          onClick={() => navigate("/")}
          className="p-0 bg-transparent border-none cursor-pointer"
        >
          <X size={24} />
        </button>
      </div>

      {/* 시술 정보 섹션 */}
      <div style={{ padding: "0 20px 32px" }}>
        <h2 className="label1" style={{ marginBottom: "16px" }}>
          시술 정보
        </h2>
        <div style={{ display: "flex", alignItems: "center", gap: "16px" }}>
          <div
            style={{
              width: "101px",
              height: "101px",
              borderRadius: "8px",
              flexShrink: 0,
              backgroundImage: `url(${treatmentImageUrl})`,
              backgroundSize: "cover",
              backgroundPosition: "center",
              backgroundColor: "var(--color-grey-350)",
            }}
          ></div>
          <div
            style={{
              flex: 1,
              display: "flex",
              flexDirection: "column",
              gap: "4px",
            }}
          >
            <div className="label1 font-semibold">
              {treatmentName || "시술 정보 로딩 중..."}
            </div>
            <div className="label1 font-semibold">
              {treatmentPrice?.toLocaleString() || "..."}원
            </div>
          </div>
          <ChevronRight size={20} color="var(--color-grey-450)" />
        </div>
      </div>

      {/* 요청사항 섹션 */}
      <div style={{ padding: "0 20px 32px" }}>
        <h2 className="label1" style={{ marginBottom: "8px" }}>
          요청사항
        </h2>
        <p
          className="body2"
          style={{ color: "var(--color-grey-450)", marginBottom: "16px" }}
        >
          요청사항이나 레퍼런스를 공유해주세요. (optional)
        </p>

        {/* 이미지 첨부 */}
        <div
          style={{
            display: "flex",
            gap: "8px",
            marginBottom: "16px",
            overflowX: "auto",
            paddingBottom: "4px",
          }}
        >
          {imageFiles.map((file, index) => (
            <div
              key={index}
              style={{
                width: "80px",
                height: "80px",
                borderRadius: "8px",
                position: "relative",
                flexShrink: 0,
              }}
            >
              <img
                src={URL.createObjectURL(file)}
                alt={`preview ${index}`}
                style={{
                  width: "100%",
                  height: "100%",
                  objectFit: "cover",
                  borderRadius: "8px",
                }}
              />
              <button
                onClick={() => removeImage(index)}
                style={{
                  position: "absolute",
                  top: "4px",
                  right: "4px",
                  width: "20px",
                  height: "20px",
                  borderRadius: "50%",
                  backgroundColor: "rgba(0,0,0,0.6)",
                  border: "none",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  cursor: "pointer",
                }}
              >
                <X size={12} color="var(--color-white)" />
              </button>
            </div>
          ))}
          {imageFiles.length < 5 && (
            <label
              style={{
                width: "80px",
                height: "80px",
                backgroundColor: "var(--color-grey-850)",
                borderRadius: "8px",
                border: "1px solid var(--color-grey-750)",
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                justifyContent: "center",
                cursor: "pointer",
                gap: "4px",
                flexShrink: 0,
              }}
            >
              <Plus size={20} color="var(--color-grey-450)" />
              <span
                className="caption2"
                style={{ color: "var(--color-grey-450)" }}
              >
                사진 {imageFiles.length}/5
              </span>
              <input
                type="file"
                multiple
                accept="image/*"
                className="hidden"
                onChange={handleImageChange}
              />
            </label>
          )}
        </div>

        {/* 텍스트 입력 */}
        <div style={{ position: "relative" }}>
          <textarea
            value={description}
            onChange={e => setDescription(e.target.value)}
            placeholder="요청사항을 입력해주세요."
            maxLength={100}
            style={{
              width: "100%",
              height: "100px",
              backgroundColor: "var(--color-grey-850)",
              border: "1px solid var(--color-grey-750)",
              borderRadius: "8px",
              padding: "16px",
              color: "var(--color-white)",
              fontSize: "14px",
              fontFamily: "inherit",
              resize: "none",
              outline: "none",
            }}
          />
          <span
            className="caption2"
            style={{
              position: "absolute",
              bottom: "12px",
              right: "16px",
              color: "var(--color-grey-450)",
            }}
          >
            {description.length}/100
          </span>
        </div>
      </div>

      {/* 하단 버튼 */}
      <div style={{ padding: "0 20px 40px" }}>
        <button
          onClick={handleSaveRequestNotesStep}
          disabled={isSubmitting}
          style={{
            width: "100%",
            height: "56px",
            background:
              "linear-gradient(90deg, var(--color-purple) 0%, var(--color-light-purple) 100%)",
            border: "none",
            borderRadius: "8px",
            color: "var(--color-white)",
            fontSize: "16px",
            fontWeight: "600",
            cursor: "pointer",
            opacity: isSubmitting ? 0.5 : 1,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            gap: "8px",
          }}
        >
          {isSubmitting && (
            <div
              style={{
                width: "20px",
                height: "20px",
                border: "2px solid white",
                borderTopColor: "transparent",
                borderRadius: "50%",
                animation: "spin 1s linear infinite",
              }}
            ></div>
          )}
          {getButtonText()}
        </button>
      </div>
      <style>
        {`
          @keyframes spin {
              from { transform: rotate(0deg); }
              to { transform: rotate(360deg); }
          }
        `}
      </style>
    </div>
  );
};

export default AppointmentBookingPage;