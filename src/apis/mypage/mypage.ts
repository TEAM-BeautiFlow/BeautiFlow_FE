import api from "../axiosInstance";

export interface UserInfoResponse {
  success: boolean;
  code: string;
  message: string;
  data: UserInfo;
}

export interface UserInfo {
  id: number;
  kakaoId: string;
  name: string;
  contact: string;
  email: string;
  shopId: number[];
  shopMembers?: ShopMember[];
}

export interface ShopMember {
  shopId: number;
  userId: number;
  memberId: number;
  intro?: string;
  imageUrl?: string;
  originalFileName?: string;
  storedFilePath?: string;
}

export async function getUserInfo(): Promise<UserInfo> {
  const { data } = await api.get<UserInfoResponse | UserInfo>("/users/info");
  // 백엔드 응답이 { data: {...} } 형태거나 바로 payload일 수 있어 두 경우 모두 처리
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const payload = (data as any)?.data ?? data;
  return payload as UserInfo;
}

export interface UpdateUserInfoRequest {
  name: string;
  email: string;
  contact: string;
}

export async function updateUserInfo(
  update: UpdateUserInfoRequest,
): Promise<UserInfo> {
  const { data } = await api.patch<UserInfoResponse | UserInfo>(
    "/users/info",
    update,
  );
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const payload = (data as any)?.data ?? data;
  return payload as UserInfo;
}

export async function logout() {
  await api.post("/users/logout");
}

// ----- User Style (Preference) -----
export interface UserStyleImage {
  id: number;
  imageUrl: string;
  originalFileName: string;
  storedFilePath: string;
}

// ----- Designer(Shop Member) Info -----
export interface ShopMemberInfoRes {
  shopId: number;
  userId: number;
  memberId: number;
  intro: string;
  imageUrl: string | null;
  originalFileName: string | null;
  storedFilePath: string | null;
}

export async function getShopMemberInfo(
  shopId: number,
): Promise<ShopMemberInfoRes> {
  const { data } = await api.get<
    ShopMemberInfoRes | { data: ShopMemberInfoRes }
  >(`/shopmembers/${shopId}`);
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const payload = (data as any)?.data ?? data;
  return payload as ShopMemberInfoRes;
}

export interface PatchShopMemberInfoReq {
  intro: string;
  patchImage: boolean; // 이미지 교체/삭제 시 true, 유지 시 false
}

export async function patchShopMemberInfo(
  shopId: number,
  request: PatchShopMemberInfoReq,
  imageFile?: File,
): Promise<ShopMemberInfoRes> {
  const formData = new FormData();
  const requestPart = new Blob([JSON.stringify(request)], {
    type: "application/json",
  });
  formData.append("request", requestPart);
  if (imageFile) {
    formData.append("image", imageFile);
  }
  const { data } = await api.patch<
    ShopMemberInfoRes | { data: ShopMemberInfoRes }
  >(`/shopmembers/${shopId}`, formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const payload = (data as any)?.data ?? data;
  return payload as ShopMemberInfoRes;
}

export interface UserStyleResponse {
  styleId: number;
  userId: number;
  description: string;
  images: UserStyleImage[];
}

export async function createUserStyle(
  description: string,
  files: File[],
): Promise<UserStyleResponse> {
  const formData = new FormData();
  const requestPart = new Blob([JSON.stringify({ description })], {
    type: "application/json",
  });
  formData.append("request", requestPart);
  files.forEach(file => formData.append("images", file));

  const { data } = await api.post<
    UserStyleResponse | { data: UserStyleResponse }
  >("/users/style", formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const payload = (data as any)?.data ?? data;
  return payload as UserStyleResponse;
}

export async function getUserStyle(): Promise<UserStyleResponse | null> {
  try {
    const { data } = await api.get<
      UserStyleResponse | { data: UserStyleResponse }
    >("/users/style");
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const payload = (data as any)?.data ?? data;
    return payload as UserStyleResponse;
  } catch (error: unknown) {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const status = (error as any)?.response?.status;
    if (status === 404) return null; // 최초 진입(미등록)
    throw error;
  }
}

export async function deleteUser() {
  return (
    await api.delete<{
      success: boolean;
      code: string;
      message: string;
      data: string;
    }>("/users/delete")
  ).data;
}
