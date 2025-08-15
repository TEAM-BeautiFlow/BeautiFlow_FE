import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { ChevronLeft } from "lucide-react";
// 🔽 1. 지적해주신 대로 import 경로와 변수명을 수정했습니다.
import api from "@/apis/axiosInstance"; // 실제 파일 경로에 맞게 수정해주세요.
import "../../styles/color-system.css";
import "../../styles/type-system.css";

// ❌ 2. 컴포넌트 내에 하드코딩된 API 관련 상수를 모두 제거합니다.
// const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;
// const ACCESS_TOKEN = "eyJhbGciOi...LEo";

const OwnerStoreInfoPage = () => {
  const navigate = useNavigate();
  const { shopId } = useParams();

  const [shopName, setShopName] = useState("");
  const [contact, setContact] = useState("");
  const [address, setAddress] = useState("");

  const MAX_LENGTH = 50;

  useEffect(() => {
    const fetchShopInfo = async () => {
      if (!shopId) return;
      try {
        // 🔽 3. 변수명을 'api'로 변경하여 요청합니다.
        const response = await api.get(`/shops/manage/${shopId}`);
        if (response.data && response.data.data) {
          const { shopName, contact, address } = response.data.data;
          setShopName(shopName || "");
          setContact(contact || "");
          setAddress(address || "");
        }
      } catch (error) {
        console.error("매장 정보 로딩 실패:", error);
      }
    };
    fetchShopInfo();
  }, [shopId]);

  const handleSave = async () => {
    if (!shopId) {
      alert("매장 ID가 없어 저장할 수 없습니다.");
      return;
    }

    const requestDto = {
      shopName,
      contact,
      address,
    };

    // FormData를 사용하는 로직은 백엔드 API의 요구사항일 수 있으므로 그대로 유지합니다.
    const formData = new FormData();
    formData.append(
      "requestDto",
      new Blob([JSON.stringify(requestDto)], { type: "application/json" }),
    );

    try {
      // 🔽 4. 변수명을 'api'로 변경하여 PATCH 요청을 보냅니다.
      await api.patch(`/shops/manage/${shopId}`, formData);
      
      alert("매장 정보가 성공적으로 저장되었습니다.");
      navigate(-1);
    } catch (error) {
      console.error("매장 정보 저장 실패:", error);
      alert("저장에 실패했습니다. 다시 시도해주세요.");
    }
  };

  return (
    <div
      className="mx-auto min-h-screen max-w-sm"
      style={{
        backgroundColor: "var(--color-black)",
        color: "var(--color-white)",
        fontFamily: "Pretendard, sans-serif",
      }}
    >
      {/* Header (이하 JSX 부분은 수정사항 없음) */}
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          padding: "20px 20px 24px",
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
          매장 정보
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
      <main style={{ padding: "0 20px 32px" }}>
        {/* 매장명 입력 필드 */}
        <div style={{ marginBottom: "24px" }}>
          <label
            htmlFor="shopName"
            className="label1"
            style={{
              color: "var(--color-white)",
              marginBottom: "8px",
              display: "block",
            }}
          >
            매장명 <span style={{ color: "var(--color-status-red)" }}>*</span>
          </label>
          <div style={{ position: "relative" }}>
            <input
              id="shopName"
              type="text"
              value={shopName}
              onChange={e => setShopName(e.target.value)}
              placeholder="매장명을 입력해주세요"
              maxLength={MAX_LENGTH}
              className="body2"
              style={{
                width: "100%",
                backgroundColor: "var(--color-grey-850)",
                border: "1px solid var(--color-grey-750)",
                borderRadius: "8px",
                padding: "16px",
                color: "var(--color-white)",
                fontFamily: "Pretendard, sans-serif",
                outline: "none",
              }}
            />
            <span
              className="caption2"
              style={{
                position: "absolute",
                bottom: "16px",
                right: "16px",
                color: "var(--color-grey-450)",
              }}
            >
              {shopName.length}/{MAX_LENGTH}
            </span>
          </div>
        </div>

        {/* 매장 연락처 입력 필드 */}
        <div style={{ marginBottom: "24px" }}>
          <label
            htmlFor="contact"
            className="label1"
            style={{
              color: "var(--color-white)",
              marginBottom: "8px",
              display: "block",
            }}
          >
            매장 연락처
          </label>
          <input
            id="contact"
            type="tel"
            value={contact}
            onChange={e => setContact(e.target.value.replace(/[^0-9]/g, ""))}
            placeholder="하이픈(-)을 제외하고 숫자만 입력해주세요."
            className="body2"
            style={{
              width: "100%",
              backgroundColor: "var(--color-grey-850)",
              border: "1px solid var(--color-grey-750)",
              borderRadius: "8px",
              padding: "16px",
              color: "var(--color-white)",
              fontFamily: "Pretendard, sans-serif",
              outline: "none",
            }}
          />
        </div>

        {/* 매장 위치 입력 필드 */}
        <div>
          <label
            htmlFor="address"
            className="label1"
            style={{
              color: "var(--color-white)",
              marginBottom: "8px",
              display: "block",
            }}
          >
            매장 위치
          </label>
          <div style={{ position: "relative" }}>
            <input
              id="address"
              type="text"
              value={address}
              onChange={e => setAddress(e.target.value)}
              placeholder="매장 위치를 입력해주세요"
              maxLength={MAX_LENGTH}
              className="body2"
              style={{
                width: "100%",
                backgroundColor: "var(--color-grey-850)",
                border: "1px solid var(--color-grey-750)",
                borderRadius: "8px",
                padding: "16px",
                color: "var(--color-white)",
                fontFamily: "Pretendard, sans-serif",
                outline: "none",
              }}
            />
            <span
              className="caption2"
              style={{
                position: "absolute",
                bottom: "16px",
                right: "16px",
                color: "var(--color-grey-450)",
              }}
            >
              {address.length}/{MAX_LENGTH}
            </span>
          </div>
        </div>
      </main>
    </div>
  );
};

export default OwnerStoreInfoPage;
