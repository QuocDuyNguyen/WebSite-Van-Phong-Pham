# Stilo Stationery - Website Văn Phòng Phẩm Cao Cấp

Ứng dụng web thương mại điện tử được phát triển nhằm cung cấp các mặt hàng văn phòng phẩm cao cấp (giấy mỹ thuật, bút mực, dụng cụ studio, v.v.), hỗ trợ quản lý sản phẩm, đơn hàng và tài khoản người dùng trực tuyến.

---

## Tech Stack

### Frontend
- React.js 19
- Vite
- Tailwind CSS
- TypeScript

### Backend
- Java
- Spring Boot
- Spring Data JPA / Hibernate
- Maven

### Database
- MySQL 

### Version Control
- GitHub

---

## Features

### Authentication & Authorization
- Đăng nhập, đăng ký tài khoản.
- Phân quyền (Role-based Authorization): `admin`, `user`.

### E-Commerce & Product Management
- Hiển thị danh sách danh mục (Categories).
- Hiển thị danh sách sản phẩm (Products) theo danh mục.
- Chi tiết sản phẩm, đánh giá (Rating) và quản lý số lượng tồn kho (Stock).

### Order Management (Quản lý Đơn hàng)
- Quản lý giỏ hàng và thanh toán.
- Lưu trữ lịch sử đơn hàng (Pending, Paid, Shipped, Delivered, Cancelled).
- Chi tiết từng mặt hàng trong đơn hàng (Order Items).

### Responsive UI
- Tương thích đa nền tảng: Desktop, Tablet, Mobile.
- Giao diện hiện đại, tối giản, phù hợp phong cách văn phòng phẩm cao cấp.

---

## Architecture

```text
React + Tailwind CSS
          │
     RESTful API
          │
 Spring Boot (Java)
          │
  Spring Data JPA
          │
        MySQL
```

---

## Project Structure

```text
WebSite-Van-Phong-Pham/
│
├── frontend/             # Giao diện người dùng
│   ├── src/
│   │   ├── components/
│   │   ├── context/
│   │   ├── pages/
│   │   ├── services/
│   │   ├── utils/
│   │   ├── App.tsx
│   │   └── main.tsx
│   └── package.json
│
├── backend/              # Mã nguồn API
│   ├── src/
│   └── pom.xml
│
└── data/                 # Cấu trúc CSDL
    ├── schema.sql
    └── stilo_db.sql
```

---

## Getting Started

### Clone project

```bash
git clone https://github.com/your-username/WebSite-Van-Phong-Pham.git
```

---

### Database

1. Tạo một database mới tên là `stilo_db` trong MySQL của bạn.
2. Import file `data/stilo_db.sql` (hoặc `data/schema.sql` nếu muốn khởi tạo lại dữ liệu mẫu cơ bản).

---

### Backend

```bash
cd backend
```

Cấu hình `application.properties` (bạn hãy thay đổi cho phù hợp với máy của mình):

```properties
spring.datasource.url=jdbc:mysql://localhost:3306/stilo_db?createDatabaseIfNotExist=true&useSSL=false
spring.datasource.username=root
spring.datasource.password=your_password
```

Chạy Server:

```bash
./mvnw spring-boot:run
```

---

### Frontend

```bash
cd frontend

npm install

npm run dev
```

---

## Future Improvements

- Tích hợp thanh toán trực tuyến (VNPAY / Momo).
- Gửi email xác nhận đơn hàng tự động.
- Quản lý CMS cho Admin (Dashboard thống kê).
- Chức năng đánh giá và bình luận sản phẩm nâng cao.

---

## Author

**Nguyễn Quốc Duy**

- Sinh viên năm 3 Công nghệ Thông tin

GitHub:
https://github.com/QuocDuyNguyen

---

## License

This project is developed for educational purposes.
