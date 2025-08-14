import api from "../axiosInstance";

export type TreatmentCategory = "hand" | "foot" | "etc" | string;

export interface TreatmentOptionItemUpsertReq {
  id?: number | null;
  name: string;
  extraPrice: number;
  extraMinutes: number;
  description?: string;
}

export interface TreatmentOptionGroupUpsertReq {
  id?: number | null;
  name: string;
  items: TreatmentOptionItemUpsertReq[];
}

export interface TreatmentUpsertReq {
  id?: number | null;
  category: TreatmentCategory;
  name: string;
  price: number;
  durationMinutes: number;
  description?: string;
  optionGroups: TreatmentOptionGroupUpsertReq[];
}

export interface TreatmentOptionItemRes {
  id: number;
  name: string;
  extraPrice: number;
  extraMinutes: number;
  description: string;
}

export interface TreatmentOptionGroupRes {
  id: number;
  name: string;
  items: TreatmentOptionItemRes[];
}

export interface TreatmentRes {
  id: number;
  category: TreatmentCategory;
  name: string;
  price: number;
  durationMinutes: number;
  description: string;
  optionGroups: TreatmentOptionGroupRes[];
}

export async function putShopTreatments(
  shopId: number,
  treatments: TreatmentUpsertReq[],
): Promise<TreatmentRes[]> {
  const { data } = await api.put<TreatmentRes[] | { data: TreatmentRes[] }>(
    `/shops/manage/${shopId}/treatments`,
    treatments,
  );
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const payload = (data as any)?.data ?? data;
  return payload as TreatmentRes[];
}
