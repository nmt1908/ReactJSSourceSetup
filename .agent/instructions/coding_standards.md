# Senior Coding Standards & AI Instructions

Quy trình này bắt buộc các AI Model (Agent) và Developer phải tuân thủ để đảm bảo source code đạt chất lượng **Senior Level**.

## 1. Nguyên Tắc Cốt Lõi (Core Principles)
- **Mindset Senior**: Code không chỉ chạy được, mà phải đẹp, ngắn gọn và có cấu trúc.
- **KISS (Keep It Simple, Stupid)**: Ưu tiên giải pháp đơn giản nhất, tránh overkill.
- **DRY (Don't Repeat Yourself)**: Trách lặp code, tách logic ra hooks hoặc utils.
- **Single Responsibility**: Mỗi component/function chỉ làm một việc duy nhất.
- **Performance First**: Không tạo re-render thừa, dùng `useMemo`, `useCallback` đúng chỗ.
- **Early Return**: Luôn return sớm để giảm độ lồng nhau (nesting) của code.

## 2. Quy Tắc React (React Best Practices)
- **Functional Components**: Chỉ sử dụng Arrow Functions.
- **Component Size**: Nếu component vượt quá 150 dòng, hãy cân trọng tách nhỏ (sub-components).
- **Hooks Logic**: Tách logic xử lý (API, state phức tạp) ra custom hooks, giữ file `.jsx` chỉ chứa UI.
- **Derived State**: Không lưu dữ liệu có thể tính toán được vào `useState`. Hãy tính toán trực tiếp hoặc dùng `useMemo`.
- **Performance**:
    - Tránh tạo function mới bên trong render nếu không cần thiết.
    - Sử dụng `React.memo`, `useCallback`, `useMemo` đúng mục đích (không lạm dụng).

## 3. Styling & UI (Tailwind & Shadcn)
- **Tailwind Only**: Tuyệt đối không viết CSS module hoặc inline style trừ trường hợp đặc biệt (dynamic value từ API).
- **Clean Classes**: Sử dụng thư viện `cn()` (tailwind-merge + clsx) để xử lý class động.
- **Shadcn UI**: Không sửa trực tiếp file trong folder `ui/`. Hãy bọc (wrap) hoặc override qua props.

## 4. Quản Lý Trạng Thái (State Management)
- **Server State (TanStack Query)**: Bắt buộc dùng cho mọi API call. Sử dụng `staleTime` và `cacheTime` hợp lý.
- **Client State (Zustand)**: Chỉ dùng cho các thông tin global thật sự (Auth, Theme, Sidebar toggle).
- **No Prop Drilling**: Nếu prop đi quá 3 tầng, hãy cân nhắc dùng Context hoặc Zustand.

## 5. Tầng API & Kết Nối (Axios)
- **Centralized**: Mọi request phải đi qua `axiosClient.js`.
- **Interceptors**: Xử lý đính kèm Token và bắt lỗi 401/500 tập trung.
- **Error Handling**: Luôn dùng `try/catch` ở tầng service hoặc sử dụng `onError` của React Query.

## 6. Định Dạng & Quy Ước (Convention)
- **Naming**: 
    - Components/Files: `PascalCase` (vd: `UserProfile.jsx`).
    - Hooks: `camelCase` bắt đầu bằng `use` (vd: `useAuth.js`).
    - Utils/Variables: `camelCase`.
- **Folder structure**: Luôn tuân thủ cấu trúc **Feature-based**.

## 7. Cho AI Model (Instructions)
Khi thực hiện task, AI cần:
1. Đọc file `project_context.md` để hiểu kiến trúc.
2. Kiểm tra `jsconfig.json` để dùng đúng path alias `@/`.
3. Ưu tiên viết code ngắn gọn, không comment những thứ hiển nhiên.
4. Luôn kiểm tra hiệu suất (tránh re-render thừa).
