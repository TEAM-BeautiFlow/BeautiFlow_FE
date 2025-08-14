import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.tsx";

// sockjs-client가 global을 기대하는 경우를 위해 안전 매핑
// 브라우저 환경에서만 실행됨
// @ts-ignore
if (typeof window !== "undefined" && !(window as any).global) {
  // @ts-ignore
  (window as any).global = window;
}

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <App />
  </StrictMode>,
);
