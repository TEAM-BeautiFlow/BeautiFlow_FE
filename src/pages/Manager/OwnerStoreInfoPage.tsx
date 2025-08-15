import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { ChevronLeft } from "lucide-react";
import axios from "axios"; // ❗️ apiClient 대신 axios를 직접 임포트
import "../../styles/color-system.css";
import "../../styles/type-system.css";

// ✅ 알려주신 API 상수 정의
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;
const ACCESS_TOKEN =
  "eyJhbGciOiJIUzI1NiJ9.eyJwcm92aWRlciI6Imtha2FvLXN0YWZmIiwia2FrYW9JZCI6IjQzODc2OTc3OTYiLCJ1c2VySWQiOjYwLCJlbWFpbCI6Impvb245ODA5MjNAbmF2ZXIuY29tIiwiaWF0IjoxNzU1MTQ3NTEyLCJleHAiOjE3NTc3Mzk1MTJ9.usNX4xb-pfiBMM4TPYjlLhmwLeoa2lSFZO6O1KOvLEo";

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
        // ✅ axios를 직접 사용하여 데이터 GET 요청
        const response = await axios.get(
          `${API_BASE_URL}/shops/manage/${shopId}`,
          {
            headers: {
              Authorization: `Bearer ${ACCESS_TOKEN}`,
            },
          },
        );
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

    const formData = new FormData();
    formData.append(
      "requestDto",
      new Blob([JSON.stringify(requestDto)], { type: "application/json" }),
    );

    try {
      // ✅ axios를 직접 사용하여 데이터 PATCH 요청
      await axios.patch(`${API_BASE_URL}/shops/manage/${shopId}`, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
          Authorization: `Bearer ${ACCESS_TOKEN}`,
        },
      });
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
      {/* Header */}
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
