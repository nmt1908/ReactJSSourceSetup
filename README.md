# ⚛️ LEO Senior Standard Reactor (v1.0.0)

> **Architected by Nguyễn Minh Tâm (AKA LEO)**  
> *Born 19/08/2003 - Senior Frontend Mindset*

## 📜 TRIẾT LÝ DỰ ÁN (VISION)
Đây không đơn thuần là một source code khởi tạo. **LEO Senior Reactor** là một bản tuyên ngôn về sự chuyên nghiệp, sạch sẽ và hiệu năng trong lập trình React. Mỗi module, mỗi dòng code đều được tối ưu để đạt tiêu chuẩn "Pháp thuật Senior": **Không code rác, không re-render thừa, không logic lồng nhằng.**

## 🛠️ THE SENIOR STACK
Hệ thống được vận hành bởi bộ công cụ mạnh mẽ nhất hiện nay:
- **Core Engine**: React 19 + Vite 7 (Tốc độ tối thượng)
- **State Architecture**: 
  - `Zustand`: Quản lý Client State gọn nhẹ, linh hoạt.
  - `TanStack Query (v5)`: Quản lý Server State chuyên nghiệp, cache đỉnh cao.
- **Styling & UI**: 
  - `Tailwind CSS`: Utility-first CSS.
  - `Shadcn UI`: Hệ thống component Radix-based tinh tế.
  - `Framer Motion`: Animation mượt mà, chuẩn UI/UX.
- **Data Integrity**: 
  - `React Hook Form`: Xử lý form hiệu quả.
  - `Zod`: Schema validation chặt chẽ từ Runtime.
- **Communication**: 
  - `Axios`: Client HTTP với interceptors xử lý Token/Error global.
  - `Socket.io`: Sẵn sàng cho realtime connection.

## 🏗️ FILE ARCHITECTURE (THE FEATURE PATTERN)
Dự án tuân thủ cấu trúc **Feature-based**, giúp mở rộng hệ thống không giới hạn mà vẫn dễ bảo trì:
```text
src/
 ├── api/          # Centralized API logic (Axios, QueryClient)
 ├── components/   # Shared UI & Layout components
 ├── config/       # All configurations (i18n, env, themes)
 ├── features/     # Feature-specific logic (Hooks, components, API)
 ├── hooks/        # Global custom hooks
 ├── locales/      # i18n language files (EN/VI)
 ├── store/        # Zustand global stores
 └── pages/        # Route-level components
```

## 🪄 AI GOVERNANCE (THẦN CHÚ AI)
Dự án tích hợp bộ hướng dẫn đặc biệt tại folder `.agent/`:
- `system_prompt.md`: "Đại thần chú" để bắt AI tuân thủ chuẩn LEO.
- `tutorial.md`: Hướng dẫn code chi tiết cho từng thư viện.
- `advice_to_juniors.md`: Tâm thư và lời dặn dành cho đàn em.

## 🚀 GETTING STARTED
1. `npm install`
2. `npm run dev`
3. Mở `.agent/system_prompt.md` để "niệm thần chú" cho trợ lý ảo của bạn.

---
*© 2026 LEO Senior Reactor. Duyệt bởi Nguyễn Minh Tâm.*
