# Tại sao cần `--legacy-peer-deps`?

## Vấn đề

**Node.js hiện tại:** v20.18.1 (đã là LTS)
**npm hiện tại:** 10.8.2

### Nguyên nhân:

1. **npm 7+ có strict peer dependency checking:**
   - Từ npm 7, npm tự động cài đặt peer dependencies
   - Nếu có conflict giữa peer dependencies → npm sẽ **báo lỗi và dừng**
   - npm 6 và trước chỉ **cảnh báo**, không dừng

2. **NestJS 6.x là version cũ:**
   - Các packages trong project dùng NestJS 6.11.6 (2019)
   - Peer dependencies của các packages này có thể conflict với nhau
   - Ví dụ: `@nestjs/common@6.11.6` có thể yêu cầu `rxjs@6.x` nhưng package khác yêu cầu `rxjs@7.x`

3. **`--legacy-peer-deps` làm gì:**
   - Bỏ qua strict checking của npm 7+
   - Quay lại hành vi của npm 6 (chỉ cảnh báo, không dừng)
   - Cho phép cài đặt tiếp tục dù có conflicts

## Giải pháp

### Option 1: Update Node.js lên LTS mới nhất (Khuyến nghị)

```bash
# Cài nvm (nếu chưa có)
curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.0/install.sh | bash

# Source nvm
source ~/.nvm/nvm.sh

# Cài Node.js LTS mới nhất
nvm install --lts
nvm use --lts

# Kiểm tra
node --version  # Should be v20.x or v22.x
npm --version
```

**Lưu ý:** Update Node.js **KHÔNG** giải quyết vấn đề peer dependencies vì đây là hành vi của npm 7+, không phải Node.js.

### Option 2: Update tất cả packages lên version mới (Tốt nhất nhưng tốn thời gian)

```bash
# Update NestJS lên version mới nhất (v10+)
npm install @nestjs/common@latest @nestjs/core@latest --save

# Update các packages khác
npm update
```

**Lưu ý:** Cần test kỹ vì có breaking changes giữa NestJS 6 và 10.

### Option 3: Sử dụng `--legacy-peer-deps` (Tạm thời)

```bash
npm install --legacy-peer-deps
```

**Khi nào dùng:**
- Khi không thể update packages ngay
- Khi đang maintain legacy code
- Khi đã test và biết rõ conflicts không ảnh hưởng

### Option 4: Sử dụng `.npmrc` file

Tạo file `.npmrc` trong project root:
```
legacy-peer-deps=true
```

Sau đó chỉ cần chạy `npm install` bình thường.

## Khuyến nghị

1. **Ngắn hạn:** Dùng `.npmrc` với `legacy-peer-deps=true` để không phải gõ flag mỗi lần
2. **Dài hạn:** Plan để update NestJS và các packages lên version mới
3. **Node.js:** Giữ ở LTS version (v20.x hoặc v22.x) - đã đúng rồi

## Kiểm tra conflicts

```bash
npm ls --depth=0
```

Sẽ hiển thị các peer dependency conflicts nếu có.

