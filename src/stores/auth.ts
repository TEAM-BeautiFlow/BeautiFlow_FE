import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";

type Nullable<T> = T | null;

export interface AuthState {
  accessToken: Nullable<string>;
  refreshToken: Nullable<string>;
  kakaoId: Nullable<string>;
  provider: Nullable<string>;
  shopId: Nullable<number[]>;
  isAuthenticated: boolean;
  setTokens: (tokens: {
    accessToken?: string | null;
    refreshToken?: string | null;
  }) => void;
  setUserInfo: (info: {
    kakaoId?: string | null;
    provider?: string | null;
    shopId?: number[] | null;
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
      shopId: null,
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
      setUserInfo: ({ kakaoId, provider, shopId }) => {
        set(state => ({
          kakaoId: kakaoId ?? state.kakaoId,
          provider: provider ?? state.provider,
          shopId: shopId ?? state.shopId,
        }));
        try {
          if (provider !== undefined && provider !== null) {
            localStorage.setItem("loginProvider", provider);
          }
          if (shopId !== undefined && shopId !== null) {
            localStorage.setItem("shopId", JSON.stringify(shopId));
          }
        } catch {}
      },
      hydrateFromStorage: () => {
        try {
          const accessToken = localStorage.getItem("accessToken");
          const refreshToken = localStorage.getItem("refreshToken");
          const provider = localStorage.getItem("loginProvider");
          const shopIdStr = localStorage.getItem("shopId");
          const shopId = shopIdStr ? JSON.parse(shopIdStr) : null;
          set(state => ({
            accessToken: accessToken ?? state.accessToken,
            refreshToken: refreshToken ?? state.refreshToken,
            provider: provider ?? state.provider,
            shopId: shopId ?? state.shopId,
          }));
        } catch {}
      },
      clear: () => {
        set({
          accessToken: null,
          refreshToken: null,
          kakaoId: null,
          provider: null,
          shopId: null,
        });
        try {
          localStorage.removeItem("accessToken");
          localStorage.removeItem("refreshToken");
          localStorage.removeItem("shopId");
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
        shopId: state.shopId,
      }),
    },
  ),
);
