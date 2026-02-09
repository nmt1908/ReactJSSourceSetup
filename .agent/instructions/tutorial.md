# ĐẠI HƯỚNG DẪN PHÁT TRIỂN (THE GREAT TUTORIAL v2.0)

Chào mừng bạn đến với đội ngũ của **anh LEO (Nguyễn Minh Tâm)**. Source code này không chỉ là công cụ, nó là một tiêu chuẩn. Dưới đây là hướng dẫn chi tiết nhất để bạn không bị "ngợp" và có thể code đúng chuẩn Senior ngay từ ngày đầu.

## 1. TRIẾT LÝ KIẾN TRÚC (ARCHITECTURAL PHILOSOPHY)

Dự án này sử dụng mô hình **Hybrid Feature-based**.
- **Folders theo Tính năng**: Mọi thứ của "Auth" nằm trong `src/features/auth`.
- **Logic Tách Biệt**: Component KHÔNG bao giờ chứa logic fetch data hay xử lý state phức tạp. Mọi thứ phải đẩy vào **Custom Hooks**.

---

## 2. CLIENT-SIDE STATE (ZUSTAND)
Dùng cho: Auth state, Theme, UI global (sidebar open/close).

**Pattern chuẩn**:
```javascript
// src/store/authStore.js
import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export const useAuthStore = create(
  persist(
    (set) => ({
      user: null,
      token: null,
      login: (userData, token) => set({ user: userData, token }),
      logout: () => set({ user: null, token: null }),
    }),
    { name: 'auth-storage' } // Tự động lưu vào LocalStorage
  )
);
```

---

## 3. SERVER-SIDE STATE (TANSTACK QUERY)
Dùng cho: Tất cả những gì lấy từ API.

**Pattern chuẩn**:
```javascript
// src/features/users/hooks/useUsers.js
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import axiosClient from '@/api/axiosClient';

// Hook để lấy danh sách
export const useUsers = () => {
  return useQuery({
    queryKey: ['users'],
    queryFn: () => axiosClient.get('/users').then(res => res.data),
    staleTime: 5 * 60 * 1000, 
  });
};

// Hook để thêm user (Mutation)
export const useAddUser = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (newUser) => axiosClient.post('/users', newUser),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['users'] }); // Refresh lại danh sách auto
    },
  });
};
```

---

## 4. FORM & VALIDATION (REACT HOOK FORM + ZOD)
Dùng cho: Mọi loại input, dù là search bar hay form đăng ký.

**Pattern chuẩn**:
```jsx
const loginSchema = z.object({
  email: z.string().email("Email không đúng định dạng"),
  password: z.string().min(6, "Mật khẩu ít nhất 6 ký tự"),
});

const LoginForm = () => {
  const { register, handleSubmit, formState: { errors } } = useForm({
    resolver: zodResolver(loginSchema),
  });

  const onSubmit = (data) => console.log(data);

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <input {...register("email")} />
      {errors.email && <span>{errors.email.message}</span>}
      <Button type="submit">Đăng nhập</Button>
    </form>
  );
};
```

---

## 5. REALTIME CHUYÊN NGHIỆP (SOCKET.IO)
Anh LEO yêu cầu phải quản lý connection chặt chẽ.

**Pattern chuẩn**:
```javascript
import { useEffect } from 'react';
import { io } from 'socket.io-client';
import { ENV } from '@/config/env';

export const useSocketListener = (event, callback) => {
  useEffect(() => {
    const socket = io(ENV.SOCKET_URL);
    
    socket.on(event, callback);

    return () => {
      socket.off(event);
      socket.disconnect(); // Quan trọng: Phải disconnect khi component unmount
    };
  }, [event, callback]);
};
```

---

## 6. STYLING & ANIMATION (SHADCN + TAILWIND + MOTION)
- **Shadcn**: Copy component cần thiết vào `components/ui` rồi sửa nếu cần.
- **`cn()` component**: Luôn dùng `@/lib/utils` để merge class.
- **Framer Motion**: Dùng để wrap các UI thay đổi trạng thái.

```jsx
import { motion, AnimatePresence } from "framer-motion";

<AnimatePresence>
  {isVisible && (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.9 }}
    >
      Nội dung mượt mà chuẩn Senior
    </motion.div>
  )}
</AnimatePresence>
```

---

## 7. LỜI DẶN CUỐI CÙNG
- Không viết code "hard-coded". Dùng i18n.
- Không dùng `console.log` ở môi trường Production (đã có ESLint nhắc).
- Trước khi code, hãy niệm **"Pháp thuật LEO"** trong file `system_prompt.md`.

---
*Duyệt bởi Nguyễn Minh Tâm (LEO)*
