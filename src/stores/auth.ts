import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";

type Nullable<T> = T | null;

export interface AuthState {
  accessToken: Nullable<string>;
  refreshToken: Nullable<string>;
  kakaoId: Nullable<string>;
  provider: Nullable<string>;
  isAuthenticated: boolean;
  setTokens: (tokens: {
    accessToken?: string | null;
    refreshToken?: string | null;
  }) => void;
  setUserInfo: (info: {
    kakaoId?: string | null;
    provider?: string | null;
  }) => void;
  hydrateFromStorage: () => void;
  clear: () => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      accessToken: null,
      refreshToken: null,
      kakaoId: null,
      provider: null,
      get isAuthenticated() {
        return Boolean(get().accessToken);
      },
      setTokens: ({ accessToken, refreshToken }) => {
        set(state => ({
          accessToken: accessToken ?? state.accessToken,
          refreshToken: refreshToken ?? state.refreshToken,
        }));
        try {
          if (accessToken !== undefined && accessToken !== null) {
            localStorage.setItem("accessToken", accessToken);
          }
          if (refreshToken !== undefined && refreshToken !== null) {
            localStorage.setItem("refreshToken", refreshToken);
          }
        } catch {}
      },
      setUserInfo: ({ kakaoId, provider }) => {
        set(state => ({
          kakaoId: kakaoId ?? state.kakaoId,
          provider: provider ?? state.provider,
        }));
        try {
          if (provider !== undefined && provider !== null) {
            localStorage.setItem("loginProvider", provider);
          }
        } catch {}
      },
      hydrateFromStorage: () => {
        try {
          const accessToken = localStorage.getItem("accessToken");
          const refreshToken = localStorage.getItem("refreshToken");
          const provider = localStorage.getItem("loginProvider");
          set(state => ({
            accessToken: accessToken ?? state.accessToken,
            refreshToken: refreshToken ?? state.refreshToken,
            provider: provider ?? state.provider,
          }));
        } catch {}
      },
      clear: () => {
        set({
          accessToken: null,
          refreshToken: null,
          kakaoId: null,
          provider: null,
        });
        try {
          localStorage.removeItem("accessToken");
          localStorage.removeItem("refreshToken");
        } catch {}
      },
    }),
    {
      name: "auth",
      storage: createJSONStorage(() => localStorage),
      partialize: state => ({
        accessToken: state.accessToken,
        refreshToken: state.refreshToken,
        kakaoId: state.kakaoId,
        provider: state.provider,
      }),
    },
  ),
);
