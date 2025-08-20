import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { ChevronLeft, Plus, Minus, ChevronDown, X } from "lucide-react";
import api from "@/apis/axiosInstance";
import ManagerNavbar from "@/layout/ManagerNavbar";
import "../../styles/color-system.css";
import "../../styles/type-system.css";

// --- 타입 정의 ---
interface TreatmentImage {
  id: number;
  imageUrl: string;
}

interface TreatmentOption {
  id: number | null;
  name: string;
  duration: number;
  price: number;
}

const OwnerEditTreatmentPage = () => {
  const navigate = useNavigate();
  const { shopId, treatmentId } = useParams();
  const isEditMode = Boolean(treatmentId);

  // --- 상태 관리 ---
  const [treatmentName, setTreatmentName] = useState("");
  const [category, setCategory] = useState("hand");
  const [price, setPrice] = useState("");
  const [duration, setDuration] = useState(0);
  const [description, setDescription] = useState("");

  const [existingImages, setExistingImages] = useState<TreatmentImage[]>([]);
  const [newImages, setNewImages] = useState<File[]>([]);
  const [deleteImageIds, setDeleteImageIds] = useState<number[]>([]);

  const [options, setOptions] = useState<TreatmentOption[]>([]);
  const [nextOptionId, setNextOptionId] = useState(1);

  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const MAX_LENGTH_NAME = 50;
  const MAX_LENGTH_DESCRIPTION = 500;

  useEffect(() => {
    const fetchTreatmentData = async () => {
      if (!shopId) {
        setError("잘못된 접근입니다.");
        setIsLoading(false);
        return;
      }
      // 생성 모드일 경우 서버 요청 없이 바로 로딩 종료
      if (!treatmentId) {
        setIsLoading(false);
        return;
      }
      try {
        const [detailRes, optionsRes] = await Promise.all([
          api.get(`/shops/${shopId}/treatments/${treatmentId}`),
          api.get(`/shops/${shopId}/treatments/${treatmentId}/options`),
        ]);

        const detailData = detailRes?.data?.data;
        if (detailData) {
          setTreatmentName(detailData.name || "");
          setCategory(detailData.category || "hand");
          setPrice(detailData.price ? String(detailData.price) : "");
          setDuration(detailData.durationMinutes || 0);
          setDescription(detailData.description || "");
          setExistingImages(detailData.images || []);
        }

        const optionGroups = optionsRes?.data?.data?.optionGroups || [];
        const flattenedItems = optionGroups.flatMap((g: any) =>
          Array.isArray(g.items) ? g.items : [],
        );
        const mappedOptions = flattenedItems.map((item: any) => ({
          id: typeof item.id === "number" ? item.id : null,
          name: item.name || "",
          duration:
            typeof item.extraMinutes === "number" ? item.extraMinutes : 0,
          price: typeof item.price === "number" ? item.price : 0,
        }));
        setOptions(mappedOptions);
      } catch (err) {
        console.error("시술 정보 로딩 실패:", err);
        setError("시술 정보를 불러오는 데 실패했습니다.");
      } finally {
        setIsLoading(false);
      }
    };

    fetchTreatmentData();
  }, [shopId, treatmentId]);

  const handleSave = async () => {
    if (!shopId) return;

    const treatmentIdNum = treatmentId
      ? parseInt(String(treatmentId), 10)
      : NaN;
    if (isEditMode && (Number.isNaN(treatmentIdNum) || treatmentIdNum <= 0)) {
      alert("유효하지 않은 시술 ID입니다.");
      return;
    }

    // 필수값 검증
    if (!treatmentName.trim()) {
      alert("시술명을 입력해주세요.");
      return;
    }
    if (duration <= 0) {
      alert("소요시간은 0보다 커야 합니다.");
      return;
    }

    // 옵션 그룹 매핑 (이름이 있는 옵션만)
    const validOptions = options.filter(
      opt => (opt.name || "").trim().length > 0,
    );
    const optionGroups =
      validOptions.length > 0
        ? [
            {
              id: null,
              name: "기본",
              items: validOptions.map(opt => ({
                id: typeof opt.id === "number" && opt.id > 0 ? opt.id : null,
                name: opt.name,
                extraPrice:
                  typeof opt.price === "number"
                    ? opt.price
                    : parseInt(String(opt.price || 0), 10) || 0,
                extraMinutes:
                  typeof opt.duration === "number"
                    ? opt.duration
                    : parseInt(String(opt.duration || 0), 10) || 0,
                description: "",
              })),
            },
          ]
        : [];

    try {
      setIsSaving(true);
      if (isEditMode) {
        // 텍스트/옵션 upsert
        const upsertDtos = [
          {
            id: treatmentIdNum,
            category,
            name: treatmentName,
            price: parseInt(price, 10) || 0,
            durationMinutes: duration,
            description,
            optionGroups,
          },
        ];
        console.log("[OwnerEdit] Upsert payload", upsertDtos);
        await api.put(`/shops/manage/${shopId}/treatments`, upsertDtos);

        // 삭제 예정 이미지 개별 삭제
        if (deleteImageIds.length > 0 && treatmentId) {
          await Promise.all(
            deleteImageIds.map(imageId =>
              api.delete(
                `/shops/manage/${shopId}/treatments/${treatmentId}/images/${imageId}`,
              ),
            ),
          );
        }

        // 신규 이미지 업로드
        if (newImages.length > 0 && treatmentId) {
          const imageForm = new FormData();
          newImages.forEach(file => imageForm.append("images", file));
          await api.post(
            `/shops/manage/${shopId}/treatments/${treatmentId}/images`,
            imageForm,
            {
              headers: { "Content-Type": "multipart/form-data" },
            },
          );
        }

        alert("시술 정보가 성공적으로 수정되었습니다.");
        navigate(-1);
      } else {
        // 생성 → 옵션 2단계 업데이트 → 이미지 업로드
        const createDtos = [
          {
            id: null,
            category,
            name: treatmentName,
            price: parseInt(price, 10) || 0,
            durationMinutes: duration,
            description,
            optionGroups: [],
          },
        ];
        const upsertRes = await api.put(
          `/shops/manage/${shopId}/treatments`,
          createDtos,
        );
        const newId = upsertRes?.data?.data?.[0]?.id;

        if (newId && optionGroups.length > 0) {
          const secondDtos = [
            {
              id: newId,
              category,
              name: treatmentName,
              price: parseInt(price, 10) || 0,
              durationMinutes: duration,
              description,
              optionGroups,
            },
          ];
          await api.put(`/shops/manage/${shopId}/treatments`, secondDtos);
        }

        if (newId && newImages.length > 0) {
          const imageForm = new FormData();
          newImages.forEach(file => imageForm.append("images", file));
          await api.post(
            `/shops/manage/${shopId}/treatments/${newId}/images`,
            imageForm,
            {
              headers: { "Content-Type": "multipart/form-data" },
            },
          );
        }

        alert("시술이 성공적으로 등록되었습니다.");
        navigate(-1);
      }
    } catch (err) {
      console.error("시술 정보 저장 실패:", err);
      alert("저장에 실패했습니다. 다시 시도해주세요.");
    } finally {
      setIsSaving(false);
    }
  };

  const handleDurationChange = (type: "increase" | "decrease") => {
    setDuration(prev => {
      if (type === "increase") return prev + 10;
      if (type === "decrease" && prev >= 10) return prev - 10;
      return prev;
    });
  };

  const handleOptionChange = (
    id: number | null,
    field: keyof Omit<TreatmentOption, "id">,
    value: any,
  ) => {
    setOptions(prev =>
      prev.map(opt => (opt.id === id ? { ...opt, [field]: value } : opt)),
    );
  };

  const handleOptionDurationChange = (
    id: number | null,
    type: "increase" | "decrease",
  ) => {
    setOptions(prev =>
      prev.map(opt => {
        if (opt.id === id) {
          const currentDuration = opt.duration;
          if (type === "increase")
            return { ...opt, duration: currentDuration + 10 };
          if (type === "decrease" && currentDuration >= 10)
            return { ...opt, duration: currentDuration - 10 };
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

  const removeExistingImage = (id: number) => {
    setExistingImages(prev => prev.filter(img => img.id !== id));
    setDeleteImageIds(prev => [...prev, id]);
  };

  const displayedImages = [
    ...existingImages.map(img => ({ ...img, isNew: false })),
    ...newImages.map((file, index) => ({
      id: index,
      imageUrl: URL.createObjectURL(file),
      isNew: true,
    })),
  ];

  if (isLoading) {
    return (
      <div className="mx-auto flex min-h-screen max-w-sm items-center justify-center bg-black text-white">
        로딩 중...
      </div>
    );
  }

  if (error) {
    return (
      <div className="mx-auto flex min-h-screen max-w-sm items-center justify-center bg-black text-white">
        {error}
      </div>
    );
  }

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
          className="cursor-pointer border-none bg-transparent p-0"
        >
          <ChevronLeft size={24} color="var(--color-white)" />
        </button>
        <h1
          className="title1"
          style={{ color: "var(--color-white)", margin: 0 }}
        >
          {isEditMode ? "시술 수정하기" : "시술 추가하기"}
        </h1>
        <button
          className="label1"
          style={{
            color: isSaving
              ? "var(--color-grey-450)"
              : "var(--color-light-purple)",
            fontWeight: "var(--font-weight-semibold)",
            background: "none",
            border: "none",
            cursor: isSaving ? "not-allowed" : "pointer",
          }}
          onClick={handleSave}
          disabled={isSaving}
        >
          {isSaving ? "저장 중..." : "저장"}
        </button>
      </div>

      {/* Content Area */}
      <div style={{ padding: "0 20px 110px" }}>
        {/* 시술명 */}
        <div style={{ marginBottom: "24px" }}>
          <label
            htmlFor="treatmentName"
            className="label1 mb-2 block text-white"
          >
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
              className="w-full rounded-lg border border-[color:var(--color-grey-750)] bg-[color:var(--color-grey-850)] p-4 font-['Pretendard'] text-sm text-white outline-none"
            />
            <span className="caption2 absolute right-4 bottom-3 text-[color:var(--color-grey-450)]">
              {treatmentName.length}/{MAX_LENGTH_NAME}
            </span>
          </div>
        </div>

        {/* 카테고리 */}
        <div style={{ marginBottom: "24px" }}>
          <label htmlFor="category" className="label1 mb-2 block text-white">
            카테고리 <span style={{ color: "var(--color-status-red)" }}>*</span>
          </label>
          <div className="relative">
            <select
              id="category"
              value={category}
              onChange={e => setCategory(e.target.value)}
              className="w-full appearance-none rounded-lg border border-[color:var(--color-grey-750)] bg-[color:var(--color-grey-850)] p-4 pr-10 font-['Pretendard'] text-sm text-white outline-none"
            >
              <option
                value="hand"
                style={{ backgroundColor: "var(--color-grey-850)" }}
              >
                손
              </option>
              <option
                value="feet"
                style={{ backgroundColor: "var(--color-grey-850)" }}
              >
                발
              </option>
              <option
                value="cf"
                style={{ backgroundColor: "var(--color-grey-850)" }}
              >
                기타
              </option>
            </select>
            <ChevronDown
              size={20}
              className="pointer-events-none absolute top-1/2 right-4 -translate-y-1/2 text-[color:var(--color-grey-450)]"
            />
          </div>
        </div>

        {/* 가격 */}
        <div style={{ marginBottom: "24px" }}>
          <label htmlFor="price" className="label1 mb-2 block text-white">
            가격 <span style={{ color: "var(--color-status-red)" }}>*</span>
          </label>
          <div className="relative">
            <input
              id="price"
              type="text"
              placeholder="가격을 입력해주세요."
              value={price}
              onChange={e => setPrice(e.target.value.replace(/[^0-9]/g, ""))}
              className="w-full rounded-lg border border-[color:var(--color-grey-750)] bg-[color:var(--color-grey-850)] p-4 font-['Pretendard'] text-sm text-white outline-none"
            />
            <span className="body2 absolute top-1/2 right-4 -translate-y-1/2 text-[color:var(--color-grey-450)]">
              원
            </span>
          </div>
        </div>

        {/* 소요시간 */}
        <div style={{ marginBottom: "24px" }}>
          <label className="label1 mb-2 block text-white">소요시간</label>
          <p className="caption2 mb-2 text-[color:var(--color-grey-450)]">
            10분 단위로 조작 가능해요
          </p>
          <div className="flex items-center gap-2">
            <input
              type="text"
              readOnly
              value={`${duration}분`}
              className="flex-grow rounded-lg border border-[color:var(--color-grey-750)] bg-[color:var(--color-grey-850)] p-4 text-center text-sm text-white outline-none"
            />
            <div className="flex gap-1">
              <button
                onClick={() => handleDurationChange("decrease")}
                className="flex h-10 w-10 cursor-pointer items-center justify-center rounded-full border-none bg-[color:var(--color-dark-purple)] p-0"
              >
                <Minus size={20} color="var(--color-light-purple)" />
              </button>
              <button
                onClick={() => handleDurationChange("increase")}
                className="flex h-10 w-10 cursor-pointer items-center justify-center rounded-full border-none bg-[color:var(--color-dark-purple)] p-0"
              >
                <Plus size={20} color="var(--color-light-purple)" />
              </button>
            </div>
          </div>
        </div>

        {/* 설명글 */}
        <div style={{ marginBottom: "24px" }}>
          <label htmlFor="description" className="label1 mb-2 block text-white">
            설명글
          </label>
          <div className="relative">
            <textarea
              id="description"
              placeholder="시술에 대한 설명을 입력해주세요."
              value={description}
              onChange={e => setDescription(e.target.value)}
              maxLength={MAX_LENGTH_DESCRIPTION}
              rows={5}
              className="w-full resize-none rounded-lg border border-[color:var(--color-grey-750)] bg-[color:var(--color-grey-850)] p-4 text-sm text-white outline-none"
            />
            <span className="caption2 absolute right-4 bottom-3 text-[color:var(--color-grey-450)]">
              {description.length}/{MAX_LENGTH_DESCRIPTION}
            </span>
          </div>
        </div>

        {/* 대표 이미지 */}
        <div style={{ marginBottom: "24px" }}>
          <label className="label1 mb-2 block text-white">대표 이미지</label>
          <p className="caption2 mb-4 text-[color:var(--color-grey-450)]">
            맨 처음 들어왔을 때 보여질 썸네일을 직접 지정해요
          </p>
          <div className="flex flex-wrap gap-2">
            {displayedImages.map((image, index) => (
              <div
                key={image.isNew ? `new-${index}` : `existing-${image.id}`}
                className="relative h-20 w-20 overflow-hidden rounded-lg"
              >
                <img
                  src={image.imageUrl}
                  alt={`시술 이미지 ${index + 1}`}
                  className="h-full w-full object-cover"
                />
                <button
                  onClick={() =>
                    image.isNew
                      ? removeNewImage(index)
                      : removeExistingImage(image.id as number)
                  }
                  className="absolute top-1 right-1 z-10 flex h-5 w-5 cursor-pointer items-center justify-center rounded-full border-none bg-black/60"
                >
                  <X size={12} color="white" />
                </button>
              </div>
            ))}
            <label
              htmlFor="imageUpload"
              className="flex h-20 w-20 cursor-pointer flex-col items-center justify-center gap-1 rounded-lg border border-[color:var(--color-grey-750)] bg-[color:var(--color-grey-850)]"
            >
              <Plus size={20} className="text-[color:var(--color-grey-450)]" />
              <span className="caption2 text-[color:var(--color-grey-450)]">
                사진 {displayedImages.length}/5
              </span>
            </label>
            <input
              type="file"
              id="imageUpload"
              multiple
              accept="image/*"
              onChange={handleImageUpload}
              className="hidden"
            />
          </div>
        </div>

        {/* 옵션 추가 섹션 */}
        <div>
          <label className="label1 mb-2 block text-white">옵션 추가</label>
          <div className="space-y-4">
            {options.map(option => (
              <div
                key={option.id}
                className="relative rounded-lg bg-[color:var(--color-grey-1000)] p-4"
              >
                <button
                  onClick={() => removeOption(option.id)}
                  className="absolute top-3 right-3 z-10 flex h-6 w-6 cursor-pointer items-center justify-center rounded-full border-none bg-[color:var(--color-grey-750)]"
                >
                  <X size={16} color="white" />
                </button>
                <div className="mb-4">
                  <label
                    htmlFor={`optionName-${option.id}`}
                    className="body1 mb-2 block text-white"
                  >
                    옵션명
                  </label>
                  <input
                    id={`optionName-${option.id}`}
                    type="text"
                    placeholder="옵션명을 입력해주세요"
                    value={option.name}
                    onChange={e =>
                      handleOptionChange(option.id, "name", e.target.value)
                    }
                    className="w-full rounded-lg border border-[color:var(--color-grey-750)] bg-[color:var(--color-grey-850)] p-3 text-sm text-white outline-none"
                  />
                </div>
                <div className="mb-4">
                  <label className="body1 mb-2 block text-white">
                    소요 시간
                  </label>
                  <div className="flex items-center gap-2">
                    <input
                      type="text"
                      readOnly
                      value={`${option.duration}분`}
                      className="flex-grow rounded-lg border border-[color:var(--color-grey-750)] bg-[color:var(--color-grey-850)] p-3 text-center text-sm text-white outline-none"
                    />
                    <div className="flex gap-1">
                      <button
                        onClick={() =>
                          handleOptionDurationChange(option.id, "decrease")
                        }
                        className="flex h-10 w-10 cursor-pointer items-center justify-center rounded-full border-none bg-[color:var(--color-dark-purple)] p-0"
                      >
                        <Minus size={20} color="var(--color-light-purple)" />
                      </button>
                      <button
                        onClick={() =>
                          handleOptionDurationChange(option.id, "increase")
                        }
                        className="flex h-10 w-10 cursor-pointer items-center justify-center rounded-full border-none bg-[color:var(--color-dark-purple)] p-0"
                      >
                        <Plus size={20} color="var(--color-light-purple)" />
                      </button>
                    </div>
                  </div>
                </div>
                <div>
                  <label
                    htmlFor={`optionPrice-${option.id}`}
                    className="body1 mb-2 block text-white"
                  >
                    가격
                  </label>
                  <div className="relative">
                    <input
                      id={`optionPrice-${option.id}`}
                      type="text"
                      placeholder="가격을 입력해주세요"
                      value={option.price === 0 ? "" : option.price}
                      onChange={e =>
                        handleOptionChange(
                          option.id,
                          "price",
                          parseInt(e.target.value.replace(/[^0-9]/g, "")) || 0,
                        )
                      }
                      className="w-full rounded-lg border border-[color:var(--color-grey-750)] bg-[color:var(--color-grey-850)] p-3 text-sm text-white outline-none"
                    />
                    <span className="body2 absolute top-1/2 right-4 -translate-y-1/2 text-[color:var(--color-grey-450)]">
                      원
                    </span>
                  </div>
                </div>
              </div>
            ))}
            <button
              onClick={addOption}
              className="mt-6 flex w-full cursor-pointer items-center justify-center rounded-lg border border-[color:var(--color-grey-750)] bg-[color:var(--color-grey-850)] p-3 text-sm font-semibold text-white"
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

export default OwnerEditTreatmentPage;
