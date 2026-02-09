# Project Context & AI Guidance (LEO Standard)

File này giúp AI Model hiểu nhanh về dự án và các quyết định kiến trúc quan trọng.

## 1. Thông Tin Chủ Sở Hữu (Project Owner)
- **Tên**: Nguyễn Minh Tâm (AKA LEO)
- **Ngày sinh**: 19/08/2003
- **Tầm nhìn**: Xây dựng hệ thống web chuẩn senior, clean code và tối ưu performance.

## 1. Công Nghệ Chủ Chốt (Tech Stack)
- **Frontend**: React JS (Vite), Javascript (KHÔNG dùng TypeScript).
- **Backend Connection**: FastAPI (Python) - Kết nối qua REST API và Socket.io.
- **Styling**: Tailwind CSS + Shadcn UI.
- **Data Fetching**: TanStack Query (v5).
- **State**: Zustand.
- **Icons**: Lucide React.

## 2. Kiến Trúc Backend Integration
- **API Base URL**: Được quản lý qua biến môi trường `VITE_API_BASE_URL`.
- **Socket Connection**: Dùng `socket.io-client`. Phải bọc trong một `SocketProvider` ở root.
- **Authen**: JWT Bearer token lưu ở LocalStorage hoặc Cookie (tuỳ config).

## 3. Cấu Trúc Đặc Thù (Feature-based)
Dự án chia theo `features/`. Một AI khi thêm tính năng mới (vd: "Order Management") cần:
1. Tạo folder `src/features/orders`.
2. Tạo các sub-folders: `components`, `hooks`, `services` (gọi API).
3. Export các thành phần cần thiết ra ngoài.

## 4. Lập Trình Viên (AI Agent) lưu ý:
- Luôn kiểm tra file `.env.development` trước khi debug kết nối.
- Luôn sử dụng alias `@/` thay vì đường dẫn tương đối `../../`.
- Nếu thấy code cũ không tuân thủ `coding_standards.md`, hãy đề xuất refactor ngay.
- Ưu tiên hiệu năng: Khi dùng `useEffect`, hãy đảm bảo dependency array chuẩn xác.
