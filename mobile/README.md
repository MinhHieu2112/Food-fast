<<<<<<< HEAD
Sau khi tải source về :
1. npm i
2. tạo file env.local
3. tạo tài khoản mongoDB, cloudinary, google_client
4. paste vào file env.local
MONGO_URL=""
NEXTAUTH_URL="http://localhost:3000"
NEXTAUTH_SECRET="ẠDADOAOSDOA"
GOOGLE_CLIENT_ID=""
GOOGLE_CLIENT_SECRET=""
CLOUDINARY_NAME=""
CLOUDINARY_KEY=""
CLOUDINARY_SECRET=""
CLOUDINARY_URL=""
5. npm run dev

=======
# Food-fast Mobile

Ứng dụng React Native được build bằng Expo và nằm chung monorepo với web.  
Tài liệu này hướng dẫn cách chuẩn bị môi trường, chạy app và xử lý một số lỗi thường gặp.

## 1. Chuẩn bị môi trường

1. Cài dependencies chung cho monorepo ở thư mục gốc:
   ```bash
   npm install
   ```
2. (Khi cần) cài global Expo CLI để dễ thao tác:
   ```bash
   npm install -g expo-cli
   ```
3. Tạo file `apps/mobile/.env` hoặc `.env.local`:
   ```bash
   EXPO_PUBLIC_API_URL="http://<IP-máy-chạy-web>:3000"
   ```
   - Nếu chạy trên emulator cùng máy có thể dùng `http://localhost:3000`.
   - Mặc định app sẽ tự fallback sang `http://10.0.2.2:3000` khi chạy trên Android emulator, nhưng tốt nhất vẫn nên đặt biến môi trường để dùng đúng IP.
   - Nếu chạy trên thiết bị thật, dùng IP trong cùng mạng Wi-Fi (ví dụ `http://192.168.1.12:3000`).
4. Đảm bảo backend Next.js đang chạy (lệnh `npm run dev:web` ở thư mục gốc).

## 2. Chạy ứng dụng

Từ thư mục gốc của repo:
```bash
npm run dev:mobile
```
Script `scripts/dev-mobile.js` sẽ:
- Tự tìm cổng trống cho Metro bundler (mặc định 8081).
- Chạy `npx expo start --port <cổng>`.

Hoặc chạy thẳng trong `apps/mobile`:
```bash
npm run dev:mobile
```
Lệnh này cũng gọi lại script trên để tự tìm cổng trống.

Trong cửa sổ Metro:
- Bấm `a` để mở Android emulator.
- Bấm `i` để mở iOS simulator.
- Hoặc quét QR bằng app Expo Go.

Muốn chạy ở chế độ web: bấm `w` trong Metro.

## 3. Lỗi thường gặp & cách khắc phục

| Lỗi | Nguyên nhân | Cách xử lý |
| --- | --- | --- |
| `Không tìm thấy cổng trống` khi chạy `npm run dev:mobile` | Đã có phiên Expo khác hoặc Metro bị kẹt tiến trình | Tắt cửa sổ Expo cũ, hoặc tìm và kill process dùng cổng 8081 (`lsof -i :8081`). Sau đó chạy lại lệnh. |
| App báo `Không thể tải menu từ backend` | Mobile không truy cập được Next.js | Kiểm tra biến `EXPO_PUBLIC_API_URL`, backend phải chạy và cùng mạng với device. Dùng IP thực thay vì `localhost` khi chạy trên điện thoại. |
| Không load được ảnh Cloudinary | Thiếu cấu hình Cloudinary bên web hoặc URL trống | Đảm bảo form web nhập đúng, Cloudinary env đã thiết lập. |
| Expo không mở emulator | Emulator chưa cài hoặc chưa cấu hình | Mở emulator (Android Studio / Xcode) trước, hoặc dùng Expo Go trên điện thoại. |
| `Cannot resolve entry file` / `Unable to resolve "../../App"` | Expo tìm entry mặc định `expo/AppEntry` nhưng code nằm trong monorepo | Đã cấu hình sẵn `apps/mobile/index.js` và `main: "./index.js"` để register `App.tsx`. Nếu vẫn gặp, chắc chắn bạn chạy lệnh bên trong `apps/mobile` và không xoá file này. |

## 4. Kiểm tra nhanh

1. Start backend: `npm run dev:web`.
2. Tại một terminal khác: `npm run dev:mobile`.
3. Đợi Metro hiển thị QR, mở Expo Go và quét → màn hình sẽ show danh sách món ăn lấy từ API.

Nếu vẫn gặp lỗi, kiểm tra log trong Metro và console của app, đồng thời chắc chắn `.env` được Expo đọc (log `process.env.EXPO_PUBLIC_API_URL` trong `apps/mobile/api.ts` khi cần debug).
>>>>>>> b1370e03 (Initial commit)
