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
