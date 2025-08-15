import React, { useState, useEffect, useRef } from "react";
import { useNavigate, useParams } from "react-router-dom";
// 🔽 lucide-react imports cleaned up
import { ChevronLeft, X, Plus } from "lucide-react";
import "../../styles/color-system.css";
import "../../styles/type-system.css";
import api from "@/apis/axiosInstance";
import ManagerNavbar from "../../layout/ManagerNavbar"; // Adjust the path if necessary

interface ShopImage {
  id: number;
  imageUrl: string;
}

const OwnerStoreIntroPage = () => {
  const navigate = useNavigate();
  const { shopId } = useParams();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [introText, setIntroText] = useState("");
  const [existingImages, setExistingImages] = useState<ShopImage[]>([]);
  const [newImages, setNewImages] = useState<File[]>([]);
  const [deleteImageIds, setDeleteImageIds] = useState<number[]>([]);

  const MAX_LENGTH_INTRO = 50;
  const MAX_IMAGES = 5;

  useEffect(() => {
    const fetchShopIntro = async () => {
      if (!shopId) return;
      try {
        const response = await api.get(`/shops/manage/${shopId}`);

        if (response.data && response.data.data) {
          const { introduction, shopImages } = response.data.data;
          setIntroText(introduction || "");
          setExistingImages(shopImages || []);
        }
      } catch (error) {
        console.error("매장 소개 정보 로딩 실패:", error);
      }
    };
    fetchShopIntro();
  }, [shopId]);

  const handleSave = async () => {
    if (!shopId) return;

    const requestDto = {
      introduction: introText,
      deleteImageIds,
    };

    const formData = new FormData();
    formData.append("requestDto", JSON.stringify(requestDto));

    newImages.forEach(file => {
      formData.append("newImages", file);
    });

    try {
      await api.patch(`/shops/manage/${shopId}`, formData);
      alert("매장 소개가 성공적으로 저장되었습니다.");
      navigate(-1);
    } catch (error) {
      console.error("매장 소개 저장 실패:", error);
      alert("저장에 실패했습니다. 다시 시도해주세요.");
    }
  };

  const handleImageUploadClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (files) {
      const totalImages = existingImages.length + newImages.length;
      const availableSlots = MAX_IMAGES - totalImages;
      const filesToUpload = Array.from(files).slice(0, availableSlots);
      setNewImages(prev => [...prev, ...filesToUpload]);
    }
  };

  const removeExistingImage = (id: number) => {
    setExistingImages(prev => prev.filter(img => img.id !== id));
    setDeleteImageIds(prev => [...prev, id]);
  };

  const removeNewImage = (index: number) => {
    setNewImages(prev => prev.filter((_, i) => i !== index));
  };

  const displayedImages = [
    ...existingImages.map(img => ({ ...img, isNew: false })),
    ...newImages.map((file, index) => ({
      id: index,
      imageUrl: URL.createObjectURL(file),
      isNew: true,
    })),
  ];

  return (
    <div
      className="mx-auto min-h-screen max-w-sm"
      style={{
        backgroundColor: "var(--color-black)",
        color: "var(--color-white)",
        fontFamily: "Pretendard, sans-serif",
        // 🔽 Added padding to prevent content from overlapping with the fixed navbar
        paddingBottom: "87px",
      }}
    >
      {/* Status Bar */}
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          padding: "12px 20px",
          fontSize: "16px",
          fontWeight: "600",
        }}
      >
        <span>9:41</span>
        <div style={{ display: "flex", alignItems: "center", gap: "4px" }}>
          <div style={{ display: "flex", gap: "2px" }}>
            <div
              style={{
                width: "4px",
                height: "4px",
                backgroundColor: "white",
                borderRadius: "50%",
              }}
            ></div>
            <div
              style={{
                width: "4px",
                height: "4px",
                backgroundColor: "white",
                borderRadius: "50%",
              }}
            ></div>
            <div
              style={{
                width: "4px",
                height: "4px",
                backgroundColor: "white",
                borderRadius: "50%",
              }}
            ></div>
            <div
              style={{
                width: "4px",
                height: "4px",
                backgroundColor: "white",
                borderRadius: "50%",
              }}
            ></div>
          </div>
          <svg width="24" height="12" viewBox="0 0 24 12" fill="none">
            <rect
              x="1"
              y="3"
              width="18"
              height="6"
              rx="2"
              stroke="white"
              strokeWidth="1"
            />
            <rect x="20" y="4" width="2" height="4" rx="1" fill="white" />
          </svg>
        </div>
      </div>

      {/* Header */}
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          padding: "0 20px 24px",
          marginTop: "8px",
        }}
      >
        <button
          onClick={() => navigate(-1)}
          style={{
            background: "none",
            border: "none",
            padding: 0,
            cursor: "pointer",
          }}
        >
          <ChevronLeft size={24} color="var(--color-white)" />
        </button>
        <h1
          className="title1"
          style={{ color: "var(--color-white)", margin: 0 }}
        >
          매장 소개
        </h1>
        <button
          className="label1"
          style={{
            color: "var(--color-light-purple)",
            fontWeight: "var(--font-weight-semibold)",
            background: "none",
            border: "none",
            cursor: "pointer",
          }}
          onClick={handleSave}
        >
          저장
        </button>
      </div>

      {/* Content Area */}
      <div style={{ padding: "0 20px 32px" }}>
        {/* 한 줄 소개 입력 필드 */}
        <div style={{ marginBottom: "24px" }}>
          <label
            htmlFor="introText"
            className="label1"
            style={{
              color: "var(--color-white)",
              marginBottom: "8px",
              display: "block",
            }}
          >
            한 줄 소개
          </label>
          <div style={{ position: "relative" }}>
            <textarea
              id="introText"
              placeholder="한 줄 소개를 입력해주세요"
              value={introText}
              onChange={e => setIntroText(e.target.value)}
              maxLength={MAX_LENGTH_INTRO}
              className="body2"
              style={{
                width: "100%",
                minHeight: "80px",
                backgroundColor: "var(--color-grey-850)",
                border: "1px solid var(--color-grey-750)",
                borderRadius: "8px",
                padding: "16px",
                color: "var(--color-white)",
                fontSize: "14px",
                fontFamily: "Pretendard, sans-serif",
                outline: "none",
                resize: "none",
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
              {introText.length}/{MAX_LENGTH_INTRO}
            </span>
          </div>
        </div>
        {/* 대표 사진 업로드 섹션 */}
        <div style={{ marginBottom: "32px" }}>
          <label
            className="label1"
            style={{
              color: "var(--color-white)",
              marginBottom: "8px",
              display: "block",
            }}
          >
            대표 사진
          </label>
          <p
            className="caption2"
            style={{ color: "var(--color-grey-450)", marginBottom: "16px" }}
          >
            고객이 매장 페이지 진입 시 적용된 사진으로 보이는 이미지예요. <br />
            (권장 규격 16:9, 5MB 이하)
          </p>
          <div style={{ display: "flex", gap: "8px", flexWrap: "wrap" }}>
            {displayedImages.map((image, index) => (
              <div
                key={image.isNew ? `new-${index}` : `existing-${image.id}`}
                style={{
                  width: "80px",
                  height: "80px",
                  borderRadius: "8px",
                  position: "relative",
                  overflow: "hidden",
                }}
              >
                <img
                  src={image.imageUrl}
                  alt={`매장 이미지 ${index + 1}`}
                  style={{ width: "100%", height: "100%", objectFit: "cover" }}
                />
                <button
                  onClick={() =>
                    image.isNew
                      ? removeNewImage(image.id)
                      // @ts-ignore
                      : removeExistingImage(image.id)
                  }
                  style={{
                    position: "absolute",
                    top: "4px",
                    right: "4px",
                    width: "20px",
                    height: "20px",
                    borderRadius: "50%",
                    backgroundColor: "rgba(0, 0, 0, 0.6)",
                    border: "none",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    cursor: "pointer",
                    zIndex: 10,
                  }}
                >
                  <X size={12} color="var(--color-white)" />
                </button>
              </div>
            ))}

            {/* 이미지 추가 버튼 */}
            {displayedImages.length < MAX_IMAGES && (
              <button
                onClick={handleImageUploadClick}
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
                }}
              >
                <Plus size={20} color="var(--color-grey-450)" />
                <span
                  className="caption2"
                  style={{ color: "var(--color-grey-450)" }}
                >
                  사진 {displayedImages.length}/{MAX_IMAGES}
                </span>
              </button>
            )}
          </div>
          <input
            type="file"
            ref={fileInputRef}
            onChange={handleFileChange}
            multiple
            accept="image/*"
            style={{ display: "none" }}
          />
        </div>
      </div>

      {/* 🔽 Reusable Bottom Navigation Bar */}
      <ManagerNavbar />
    </div>
  );
};

export default OwnerStoreIntroPage;