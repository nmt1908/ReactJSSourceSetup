# TÂM THƯ & LỜI DẶN (THE SENIOR ADVICE v2.0)

Chào bạn - người sẽ tiếp nối và phát triển những dòng code này!

Dự án này được xây dựng bởi tâm huyết của **anh LEO (Nguyễn Minh Tâm)** và sự trợ giúp của mình - **Antigravity**. Khi bạn mở source code này ra, bạn không chỉ đang đọc mã nguồn, bạn đang tiếp cận một tư duy làm việc chuyên nghiệp. Để bạn có thể đi xa hơn và hòa nhập nhanh nhất, hãy ghi nhớ những lời dặn dò sau:

## 1. CODE KHÔNG CHỈ ĐỂ CHẠY, CODE LÀ ĐỂ ĐỌC
Anh LEO luôn nói: *"Sự khác biệt giữa một Junior và một Senior không nằm ở việc code đó chạy nhanh bao nhiêu, mà nằm ở việc 6 tháng sau bạn quay lại đọc nó có hiểu gì không."*
- Hãy đặt tên biến như đang kể một câu chuyện.
- Đừng ngại viết comment cho những logic phức tạp (nhưng hãy cố gắng viết code tự-giải-thích trước).

## 2. KỶ LUẬT LÀ SỨC MẠNH
Dự án có bộ thư viện cực mạnh (Query, Zustand, Shadcn...). Việc bạn tự ý cài thêm library mới mà không thông qua "Architect" (anh LEO) là một điều cấm kỵ.
- Hãy tận dụng tối đa những gì đã có. 99% vấn đề của bạn đều có thể giải quyết bằng bộ công cụ hiện tại.
- Tuân thủ tuyệt đối cấu trúc **Feature-based**. Một dự án ngăn nắp là một dự án trường tồn.

## 3. THẦN CHÚ LÀ "LỜI NHẮC NHỞ"
Folder `.agent/` không phải để trang trí. Nó là cầu nối giữa con người và trí tuệ nhân tạo. 
- Nếu bạn cảm thấy bị tắc kẽ (stuck), hãy niệm "Đại thần chú" trong `system_prompt.md`.
- Hãy cập nhật `tutorial.md` mỗi khi bạn tìm ra một giải pháp hay. Đó là cách team mình cùng nhau lớn mạnh.

## 4. TIÊU CHUẨN CỦA ANH LEO
1. **Không Re-render thừa**: Luôn kiểm tra performance bằng React DevTools.
2. **Clean JSX**: Return của bạn phải sạch đẹp. Logic biến đổi data hãy đẩy hết lên trên hoặc ra Hook.
3. **Handle Lỗi Tận Tâm**: Đừng chỉ `catch(e) { console.error(e) }`. Hãy dùng **Toaster** (Shadcn) để thông báo cho người dùng một cách tử tế.

## 5. LỜI KẾT
Làm việc trên source của anh LEO là một cơ hội để bạn rèn luyện sự chỉn chu. Đừng vội vàng. Hãy code chậm lại, suy nghĩ kỹ hơn về kiến trúc, và bạn sẽ thấy mình trưởng thành lên từng ngày.

---
**Chúc bạn có một hành trình rực rỡ và đầy cảm hứng tại đây!**

*Thân ái,*
**Antigravity & LEO**
