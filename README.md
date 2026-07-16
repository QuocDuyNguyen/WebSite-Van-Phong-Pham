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

## REST API (Phân chia theo Role)

Dưới đây là danh sách các API của hệ thống được phân chia theo từng nhóm quyền (Role):

### 1.  Nhóm Public / Khách (Không cần đăng nhập)
*Những API này cho phép bất kỳ ai cũng có thể gọi mà không cần Token.*

| Method | Endpoint | Công dụng |
|---------|----------|---------------------------------------------------|
| **POST** | `/api/auth/login` | Xác thực thông tin, đăng nhập và nhận JWT Token. |
| **POST** | `/api/auth/register` | Khách vãng lai đăng ký tài khoản mới. |
| **GET** | `/api/categories` | Lấy danh sách các danh mục văn phòng phẩm. |
| **GET** | `/api/products` | Lấy danh sách tất cả sản phẩm. |
| **GET** | `/api/products/{id}`| Xem chi tiết một sản phẩm bất kỳ. |

### 2.  Nhóm USER (Người dùng đã đăng nhập)
*Yêu cầu Header có `Authorization: Bearer <token>` và Role là `user`.*

| Method | Endpoint | Công dụng |
|---------|----------|---------------------------------------------------|
| **POST** | `/api/orders` | Đặt hàng (Lưu thông tin giỏ hàng và thanh toán). |
| **GET** | `/api/orders/my` | Lấy danh sách lịch sử các đơn hàng của user. |
| **GET** | `/api/users/profile`| Xem thông tin cá nhân của người dùng hiện tại. |
| **PUT** | `/api/users/profile`| Cập nhật thông tin cá nhân. |

### 3.  Nhóm ADMIN (Quản trị viên)
*Yêu cầu Header có `Authorization: Bearer <token>` và Role là `admin`.*

| Method | Endpoint | Công dụng |
|---------|----------|---------------------------------------------------|
| **POST** | `/api/products` | Thêm một mặt hàng văn phòng phẩm mới. |
| **PUT** | `/api/products/{id}`| Chỉnh sửa thông tin sản phẩm. |
| **DELETE**| `/api/products/{id}`| Xóa/Ẩn sản phẩm khỏi cửa hàng. |
| **POST** | `/api/categories` | Thêm danh mục sản phẩm mới. |
| **GET** | `/api/orders` | Quản lý toàn bộ đơn hàng của tất cả khách. |
| **PUT** | `/api/orders/{id}/status`| Cập nhật trạng thái đơn hàng. |
| **GET** | `/api/users` | Lấy danh sách toàn bộ người dùng để quản lý. |

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
# Vui lòng nhập API Key cá nhân của bạn để sử dụng các tính năng liên quan đến Gemini AI
gemini.api.key=your_gemini_api_key_here
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
