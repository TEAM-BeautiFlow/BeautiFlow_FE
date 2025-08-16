import React, { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import {
  ChevronLeft,
  Plus,
  Minus,
  ChevronDown,
  X,
} from "lucide-react";
import api from "@/apis/axiosInstance";
import ManagerNavbar from "@/layout/ManagerNavbar";
import "../../styles/color-system.css";
import "../../styles/type-system.css";

// --- 타입 정의 ---
interface TreatmentOption {
  id: number | null;
  name: string;
  duration: number;
  price: number;
}

const OwnerCreateTreatmentPage = () => {
  const navigate = useNavigate();
  const { shopId } = useParams();

  // --- 상태 관리 ---
  const [treatmentName, setTreatmentName] = useState("");
  const [category, setCategory] = useState("HAND");
  const [price, setPrice] = useState("");
  const [duration, setDuration] = useState(0);
  const [description, setDescription] = useState("");
  
  const [newImages, setNewImages] = useState<File[]>([]);
  const [options, setOptions] = useState<TreatmentOption[]>([]);
  const [nextOptionId, setNextOptionId] = useState(1);
  const [isLoading, setIsLoading] = useState(false);

  const MAX_LENGTH_NAME = 50;
  const MAX_LENGTH_DESCRIPTION = 500;

  const handleSave = async () => {
    if (!shopId) {
      alert("매장 정보가 없어 저장할 수 없습니다.");
      return;
    }

    if (!treatmentName.trim()) {
      alert("시술명을 입력해주세요.");
      return;
    }

    if (!price.trim()) {
      alert("가격을 입력해주세요.");
      return;
    }

    const requestDto = {
      name: treatmentName,
      category,
      price: parseInt(price, 10) || 0,
      durationMinutes: duration,
      description,
      options: options.map(({ id, ...rest }) => rest),
    };

    const formData = new FormData();
    formData.append("requestDto", JSON.stringify(requestDto));
    newImages.forEach(file => {
      formData.append("newImages", file);
    });

    try {
      setIsLoading(true);
      await api.post(`/shops/manage/${shopId}/treatments`, formData);
      alert("시술이 성공적으로 등록되었습니다.");
      navigate(-1);
    } catch (err) {
      console.error("시술 등록 실패:", err);
      alert("등록에 실패했습니다. 다시 시도해주세요.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleDurationChange = (type: "increase" | "decrease") => {
    setDuration(prev => {
      if (type === "increase") return prev + 10;
      if (type === "decrease" && prev >= 10) return prev - 10;
      return prev;
    });
  };

  const handleOptionChange = (id: number | null, field: keyof Omit<TreatmentOption, 'id'>, value: any) => {
    setOptions(prev =>
      prev.map(opt => (opt.id === id ? { ...opt, [field]: value } : opt)),
    );
  };
  
  const handleOptionDurationChange = (id: number | null, type: "increase" | "decrease") => {
    setOptions(prev =>
      prev.map(opt => {
        if (opt.id === id) {
          const currentDuration = opt.duration;
          if (type === "increase") return { ...opt, duration: currentDuration + 10 };
          if (type === "decrease" && currentDuration >= 10) return { ...opt, duration: currentDuration - 10 };
        }
        return opt;
      }),
    );
  };

  const addOption = () => {
    setOptions(prev => [
      ...prev,
      { id: -nextOptionId, name: "", duration: 0, price: 0 },
    ]);
    setNextOptionId(prev => prev + 1);
  };

  const removeOption = (id: number | null) => {
    setOptions(prev => prev.filter(opt => opt.id !== id));
  };

  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (files) {
      const filesToUpload = Array.from(files);
      setNewImages(prev => [...prev, ...filesToUpload]);
    }
  };

  const removeNewImage = (index: number) => {
    setNewImages(prev => prev.filter((_, i) => i !== index));
  };

  const displayedImages = newImages.map((file, index) => ({
    id: index,
    imageUrl: URL.createObjectURL(file),
    isNew: true,
  }));

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
          className="p-0 bg-transparent border-none cursor-pointer"
          disabled={isLoading}
        >
          <ChevronLeft size={24} color="var(--color-white)" />
        </button>
        <h1 className="title1" style={{ color: "var(--color-white)", margin: 0 }}>
          시술 등록하기
        </h1>
        <button
          className="label1"
          style={{
            color: isLoading ? "var(--color-grey-450)" : "var(--color-light-purple)",
            fontWeight: "var(--font-weight-semibold)",
            background: "none",
            border: "none",
            cursor: isLoading ? "not-allowed" : "pointer",
          }}
          onClick={handleSave}
          disabled={isLoading}
        >
          {isLoading ? "저장 중..." : "저장"}
        </button>
      </div>

      {/* Content Area */}
      <div style={{ padding: "0 20px 110px" }}>
        {/* 시술명 */}
        <div style={{ marginBottom: "24px" }}>
          <label htmlFor="treatmentName" className="label1 block mb-2 text-white">
            시술명 <span style={{ color: "var(--color-status-red)" }}>*</span>
          </label>
          <div className="relative">
            <input
              id="treatmentName"
              type="text"
              placeholder="시술명을 입력해주세요"
              value={treatmentName}
              onChange={e => setTreatmentName(e.target.value)}
              maxLength={MAX_LENGTH_NAME}
              disabled={isLoading}
              className="w-full bg-[color:var(--color-grey-850)] border border-[color:var(--color-grey-750)] rounded-lg p-4 text-white text-sm font-['Pretendard'] outline-none"
              style={{ opacity: isLoading ? 0.7 : 1 }}
            />
            <span className="caption2 absolute bottom-3 right-4 text-[color:var(--color-grey-450)]">
              {treatmentName.length}/{MAX_LENGTH_NAME}
            </span>
          </div>
        </div>

        {/* 카테고리 */}
        <div style={{ marginBottom: "24px" }}>
          <label htmlFor="category" className="label1 block mb-2 text-white">
            카테고리 <span style={{ color: "var(--color-status-red)" }}>*</span>
          </label>
          <div className="relative">
            <select
              id="category"
              value={category}
              onChange={e => setCategory(e.target.value)}
              disabled={isLoading}
              className="w-full bg-[color:var(--color-grey-850)] border border-[color:var(--color-grey-750)] rounded-lg p-4 text-white text-sm font-['Pretendard'] outline-none appearance-none pr-10"
              style={{ opacity: isLoading ? 0.7 : 1 }}
            >
              <option value="HAND" style={{ backgroundColor: "var(--color-grey-850)" }}>손</option>
              <option value="FEET" style={{ backgroundColor: "var(--color-grey-850)" }}>발</option>
              <option value="ETC" style={{ backgroundColor: "var(--color-grey-850)" }}>기타</option>
            </select>
            <ChevronDown size={20} className="absolute right-4 top-1/2 -translate-y-1/2 text-[color:var(--color-grey-450)] pointer-events-none" />
          </div>
        </div>

        {/* 가격 */}
        <div style={{ marginBottom: "24px" }}>
          <label htmlFor="price" className="label1 block mb-2 text-white">
            가격 <span style={{ color: "var(--color-status-red)" }}>*</span>
          </label>
          <div className="relative">
            <input
              id="price"
              type="text"
              placeholder="가격을 입력해주세요."
              value={price}
              onChange={e => setPrice(e.target.value.replace(/[^0-9]/g, ""))}
              disabled={isLoading}
              className="w-full bg-[color:var(--color-grey-850)] border border-[color:var(--color-grey-750)] rounded-lg p-4 text-white text-sm font-['Pretendard'] outline-none"
              style={{ opacity: isLoading ? 0.7 : 1 }}
            />
             <span className="body2 absolute right-4 top-1/2 -translate-y-1/2 text-[color:var(--color-grey-450)]">원</span>
          </div>
        </div>

        {/* 소요시간 */}
        <div style={{ marginBottom: "24px" }}>
          <label className="label1 block mb-2 text-white">소요시간</label>
          <p className="caption2 mb-2 text-[color:var(--color-grey-450)]">10분 단위로 조작 가능해요</p>
          <div className="flex items-center gap-2">
            <input
              type="text"
              readOnly
              value={`${duration}분`}
              className="flex-grow bg-[color:var(--color-grey-850)] border border-[color:var(--color-grey-750)] rounded-lg p-4 text-white text-sm text-center outline-none"
              style={{ opacity: isLoading ? 0.7 : 1 }}
            />
            <div className="flex gap-1">
              <button 
                onClick={() => handleDurationChange("decrease")} 
                disabled={isLoading}
                className="bg-[color:var(--color-dark-purple)] rounded-full w-10 h-10 flex items-center justify-center cursor-pointer p-0 border-none"
                style={{ opacity: isLoading ? 0.7 : 1, cursor: isLoading ? "not-allowed" : "pointer" }}
              >
                <Minus size={20} color="var(--color-light-purple)" />
              </button>
              <button 
                onClick={() => handleDurationChange("increase")} 
                disabled={isLoading}
                className="bg-[color:var(--color-dark-purple)] rounded-full w-10 h-10 flex items-center justify-center cursor-pointer p-0 border-none"
                style={{ opacity: isLoading ? 0.7 : 1, cursor: isLoading ? "not-allowed" : "pointer" }}
              >
                <Plus size={20} color="var(--color-light-purple)" />
              </button>
            </div>
          </div>
        </div>

        {/* 설명글 */}
        <div style={{ marginBottom: "24px" }}>
          <label htmlFor="description" className="label1 block mb-2 text-white">설명글</label>
          <div className="relative">
            <textarea
              id="description"
              placeholder="시술에 대한 설명을 입력해주세요."
              value={description}
              onChange={e => setDescription(e.target.value)}
              maxLength={MAX_LENGTH_DESCRIPTION}
              rows={5}
              disabled={isLoading}
              className="w-full bg-[color:var(--color-grey-850)] border border-[color:var(--color-grey-750)] rounded-lg p-4 text-white text-sm resize-none outline-none"
              style={{ opacity: isLoading ? 0.7 : 1 }}
            />
            <span className="caption2 absolute bottom-3 right-4 text-[color:var(--color-grey-450)]">
              {description.length}/{MAX_LENGTH_DESCRIPTION}
            </span>
          </div>
        </div>

        {/* 대표 이미지 */}
        <div style={{ marginBottom: "24px" }}>
          <label className="label1 block mb-2 text-white">대표 이미지</label>
          <p className="caption2 mb-4 text-[color:var(--color-grey-450)]">맨 처음 들어왔을 때 보여질 썸네일을 직접 지정해요</p>
          <div className="flex gap-2 flex-wrap">
            {displayedImages.map((image, index) => (
              <div key={`new-${index}`} className="relative w-20 h-20 rounded-lg overflow-hidden">
                <img src={image.imageUrl} alt={`시술 이미지 ${index + 1}`} className="w-full h-full object-cover" />
                <button
                  onClick={() => removeNewImage(index)}
                  disabled={isLoading}
                  className="absolute top-1 right-1 w-5 h-5 rounded-full bg-black/60 border-none flex items-center justify-center cursor-pointer z-10"
                  style={{ cursor: isLoading ? "not-allowed" : "pointer" }}
                >
                  <X size={12} color="white" />
                </button>
              </div>
            ))}
            <label 
              htmlFor="imageUpload" 
              className="w-20 h-20 rounded-lg bg-[color:var(--color-grey-850)] border border-[color:var(--color-grey-750)] flex flex-col items-center justify-center cursor-pointer gap-1"
              style={{ opacity: isLoading ? 0.7 : 1, cursor: isLoading ? "not-allowed" : "pointer" }}
            >
              <Plus size={20} className="text-[color:var(--color-grey-450)]" />
              <span className="caption2 text-[color:var(--color-grey-450)]">사진 {displayedImages.length}/5</span>
            </label>
            <input 
              type="file" 
              id="imageUpload" 
              multiple 
              accept="image/*" 
              onChange={handleImageUpload} 
              className="hidden" 
              disabled={isLoading}
            />
          </div>
        </div>

        {/* 옵션 추가 섹션 */}
        <div>
          <label className="label1 block mb-2 text-white">옵션 추가</label>
          <div className="space-y-4">
            {options.map(option => (
              <div key={option.id} className="bg-[color:var(--color-grey-1000)] rounded-lg p-4 relative" style={{ opacity: isLoading ? 0.7 : 1 }}>
                <button 
                  onClick={() => removeOption(option.id)} 
                  disabled={isLoading}
                  className="absolute top-3 right-3 w-6 h-6 rounded-full bg-[color:var(--color-grey-750)] border-none flex items-center justify-center cursor-pointer z-10"
                  style={{ cursor: isLoading ? "not-allowed" : "pointer" }}
                >
                  <X size={16} color="white" />
                </button>
                <div className="mb-4">
                  <label htmlFor={`optionName-${option.id}`} className="body1 block mb-2 text-white">옵션명</label>
                  <input
                    id={`optionName-${option.id}`}
                    type="text"
                    placeholder="옵션명을 입력해주세요"
                    value={option.name}
                    onChange={e => handleOptionChange(option.id, "name", e.target.value)}
                    disabled={isLoading}
                    className="w-full bg-[color:var(--color-grey-850)] border border-[color:var(--color-grey-750)] rounded-lg p-3 text-white text-sm outline-none"
                  />
                </div>
                <div className="mb-4">
                  <label className="body1 block mb-2 text-white">소요 시간</label>
                  <div className="flex items-center gap-2">
                    <input type="text" readOnly value={`${option.duration}분`} className="flex-grow bg-[color:var(--color-grey-850)] border border-[color:var(--color-grey-750)] rounded-lg p-3 text-white text-sm text-center outline-none" />
                    <div className="flex gap-1">
                      <button 
                        onClick={() => handleOptionDurationChange(option.id, "decrease")} 
                        disabled={isLoading}
                        className="bg-[color:var(--color-dark-purple)] rounded-full w-10 h-10 flex items-center justify-center cursor-pointer p-0 border-none"
                        style={{ cursor: isLoading ? "not-allowed" : "pointer" }}
                      >
                        <Minus size={20} color="var(--color-light-purple)" />
                      </button>
                      <button 
                        onClick={() => handleOptionDurationChange(option.id, "increase")} 
                        disabled={isLoading}
                        className="bg-[color:var(--color-dark-purple)] rounded-full w-10 h-10 flex items-center justify-center cursor-pointer p-0 border-none"
                        style={{ cursor: isLoading ? "not-allowed" : "pointer" }}
                      >
                        <Plus size={20} color="var(--color-light-purple)" />
                      </button>
                    </div>
                  </div>
                </div>
                <div>
                  <label htmlFor={`optionPrice-${option.id}`} className="body1 block mb-2 text-white">가격</label>
                   <div className="relative">
                      <input
                        id={`optionPrice-${option.id}`}
                        type="text"
                        placeholder="가격을 입력해주세요"
                        value={option.price === 0 ? "" : option.price}
                        onChange={e => handleOptionChange(option.id, "price", parseInt(e.target.value.replace(/[^0-9]/g, "")) || 0)}
                        disabled={isLoading}
                        className="w-full bg-[color:var(--color-grey-850)] border border-[color:var(--color-grey-750)] rounded-lg p-3 text-white text-sm outline-none"
                      />
                      <span className="body2 absolute right-4 top-1/2 -translate-y-1/2 text-[color:var(--color-grey-450)]">원</span>
                   </div>
                </div>
              </div>
            ))}
            <button 
              onClick={addOption} 
              disabled={isLoading}
              className="w-full bg-[color:var(--color-grey-850)] border border-[color:var(--color-grey-750)] rounded-lg p-3 text-white text-sm font-semibold cursor-pointer mt-6 flex items-center justify-center"
              style={{ opacity: isLoading ? 0.7 : 1, cursor: isLoading ? "not-allowed" : "pointer" }}
            >
              <Plus size={20} className="mr-2" />
              옵션 추가
            </button>
          </div>
        </div>
      </div>
      
      <ManagerNavbar />
    </div>
  );
};

export default OwnerCreateTreatmentPage;