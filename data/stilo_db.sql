-- MySQL dump 10.13  Distrib 8.0.44, for Win64 (x86_64)
--
-- Host: localhost    Database: stilo_db
-- ------------------------------------------------------
-- Server version	8.0.44

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!50503 SET NAMES utf8 */;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;

--
-- Table structure for table `categories`
--

DROP TABLE IF EXISTS `categories`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `categories` (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `name` varchar(100) NOT NULL,
  `description` text,
  `image_url` varchar(500) DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=7 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `categories`
--

LOCK TABLES `categories` WRITE;
/*!40000 ALTER TABLE `categories` DISABLE KEYS */;
INSERT INTO `categories` VALUES (1,'Archival Paper','Premium paper for long-lasting writing','https://images.unsplash.com/photo-1586075010633-2442dc3d6307?auto=format&fit=crop&q=80&w=800'),(2,'Fine Writing','Exceptional fountain pens and ink','https://images.unsplash.com/photo-1583485088034-697b5bc54ccd?auto=format&fit=crop&q=80&w=800'),(3,'Studio Tools','Essentials for the modern studio','https://images.unsplash.com/photo-1516962215378-7fa2e137ae93?auto=format&fit=crop&q=80&w=800');
/*!40000 ALTER TABLE `categories` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `order_items`
--

DROP TABLE IF EXISTS `order_items`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `order_items` (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `order_id` bigint DEFAULT NULL,
  `product_id` bigint DEFAULT NULL,
  `quantity` int NOT NULL,
  `unit_price` decimal(10,2) NOT NULL,
  PRIMARY KEY (`id`),
  KEY `order_items_ibfk_1` (`order_id`),
  KEY `order_items_ibfk_2` (`product_id`),
  CONSTRAINT `order_items_ibfk_1` FOREIGN KEY (`order_id`) REFERENCES `orders` (`id`) ON DELETE CASCADE,
  CONSTRAINT `order_items_ibfk_2` FOREIGN KEY (`product_id`) REFERENCES `products` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=16 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `order_items`
--

LOCK TABLES `order_items` WRITE;
/*!40000 ALTER TABLE `order_items` DISABLE KEYS */;
INSERT INTO `order_items` VALUES (7,6,NULL,1,28.00),(8,7,NULL,1,28.00),(9,8,NULL,3,28.00),(10,9,NULL,4,28.00),(11,10,NULL,6,28.00),(12,11,NULL,4,120.00),(13,12,NULL,2,120.00),(14,13,NULL,9,120.00),(15,14,53,2,32.00);
/*!40000 ALTER TABLE `order_items` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `orders`
--

DROP TABLE IF EXISTS `orders`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `orders` (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `user_id` bigint DEFAULT NULL,
  `status` varchar(255) NOT NULL,
  `total_amount` decimal(10,2) NOT NULL,
  `shipping_address` text NOT NULL,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `payment_expiry` varchar(50) DEFAULT NULL,
  `payment_method` varchar(100) DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `orders_ibfk_1` (`user_id`),
  CONSTRAINT `orders_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=15 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `orders`
--

LOCK TABLES `orders` WRITE;
/*!40000 ALTER TABLE `orders` DISABLE KEYS */;
INSERT INTO `orders` VALUES (6,5,'shipped',28.00,' , , , ','2026-05-26 07:30:14',NULL,NULL),(7,7,'delivered',28.00,'Lợi Duy, 123 Le Trong Tan, HCM, 11211','2026-05-28 05:03:04','08/27','Card ending in 2005'),(8,7,'delivered',84.00,'Loi Duy, 120 Le Trong Tan, HCM, 11211','2026-05-28 05:15:20','05/28','Card ending in 2005'),(9,7,'shipped',112.00,'Loi Duy, 120 Le Trong Tan, HCM, 11221','2026-05-28 05:21:30','05/28','Card ending in 2005'),(10,5,'shipped',168.00,'Loi Duy, 120 Le Trong Tan, HCM, 11221','2026-05-28 05:23:21','05/28','Card ending in 2005'),(11,5,'shipped',480.00,'Duy Loi Dang, 120 Le Trong Tan, HCM, 11221','2026-05-28 05:45:19','05/28','Card ending in 2005'),(12,8,'delivered',240.00,'Lợi Duy, 120 Le Trong Tan, HCM, 11221','2026-05-28 05:56:47','05/28','Card ending in 2004'),(13,5,'delivered',1080.00,'Lợi Duy, 120 Le Trong Tan, HCM, 12112','2026-05-28 06:12:53','05/28','Card ending in 5555'),(14,5,'pending',64.00,'Duy Loi Dang, 140 Le Trong Tan, HCM, 700000','2026-07-10 19:30:17','MoMo','Ví MoMo (QR Code Payment)');
/*!40000 ALTER TABLE `orders` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `password_reset_tokens`
--

DROP TABLE IF EXISTS `password_reset_tokens`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `password_reset_tokens` (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `expiry_date` datetime(6) NOT NULL,
  `token` varchar(255) NOT NULL,
  `user_id` bigint NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `UK71lqwbwtklmljk3qlsugr1mig` (`token`),
  UNIQUE KEY `UKla2ts67g4oh2sreayswhox1i6` (`user_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `password_reset_tokens`
--

LOCK TABLES `password_reset_tokens` WRITE;
/*!40000 ALTER TABLE `password_reset_tokens` DISABLE KEYS */;
/*!40000 ALTER TABLE `password_reset_tokens` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `products`
--

DROP TABLE IF EXISTS `products`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `products` (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `category_id` bigint DEFAULT NULL,
  `name` varchar(255) NOT NULL,
  `description` text,
  `price` decimal(10,2) NOT NULL,
  `stock_quantity` int DEFAULT '0',
  `rating` decimal(2,1) DEFAULT '0.0',
  `image_url` varchar(500) DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `products_ibfk_1` (`category_id`),
  CONSTRAINT `products_ibfk_1` FOREIGN KEY (`category_id`) REFERENCES `categories` (`id`) ON DELETE SET NULL
) ENGINE=InnoDB AUTO_INCREMENT=76 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `products`
--

LOCK TABLES `products` WRITE;
/*!40000 ALTER TABLE `products` DISABLE KEYS */;
INSERT INTO `products` VALUES (1,1,'The Vellum Series Notebook','Sổ tay giấy vellum 120gsm cao cấp, bìa vải linen dệt tay của Nhật Bản. Không thấm mực nhòe.',28.00,50,4.9,'https://images.unsplash.com/photo-1544816155-12df9643f363?auto=format&fit=crop&q=80&w=800','2026-07-11 01:59:10'),(2,1,'Linen Sketchbook Classic','Sổ vẽ phác thảo bìa thô linen tự nhiên, ruột giấy mỹ thuật dày 200gsm chuyên dụng cho màu nước.',34.00,30,4.9,'https://images.unsplash.com/photo-1531346878377-a5be20888e57?auto=format&fit=crop&q=80&w=800','2026-07-11 01:59:10'),(3,1,'Linen Sketchbook','Textured linen cover with heavyweight paper.',34.00,30,4.9,'https://images.unsplash.com/photo-1531346878377-a5be20888e57?auto=format&fit=crop&q=80&w=800','2026-07-11 02:04:46'),(4,1,'Handmade Deckle Edge Paper Set','Bộ 50 tờ giấy thủ công viền xơ tự nhiên, sản xuất từ sợi bông hữu cơ mềm mại.',18.00,50,4.7,'https://images.unsplash.com/photo-1586075010633-2442dc3d6307?auto=format&fit=crop&q=80&w=800','2026-07-11 01:59:10'),(5,1,'Leather Traveler Journal','Sổ tay lữ hành bìa da thật nguyên tấm, có thể thay ruột giấy dễ dàng khi viết hết.',65.00,25,5.0,'https://images.unsplash.com/photo-1517842645767-c639042777db?auto=format&fit=crop&q=80&w=800','2026-07-11 01:59:10'),(6,1,'Stilo Blank Grid Pad','Xấp giấy ghi chú kẻ lưới Grid tháo rời, giấy 100gsm mượt mà thích hợp cho phác thảo kiến trúc.',12.00,80,4.6,'https://images.unsplash.com/photo-1586075010633-2442dc3d6307?auto=format&fit=crop&q=80&w=800','2026-07-11 01:59:10'),(7,1,'Premium Letter Writing Set','Bộ giấy viết thư bao gồm 20 tờ giấy gân bông cao cấp và 10 phong bì lót lụa sang trọng.',22.00,40,4.8,'https://images.unsplash.com/photo-1506784983877-45594efa4cbe?auto=format&fit=crop&q=80&w=800','2026-07-11 01:59:10'),(8,1,'Minimalist Kraft Notebook','Sổ tay bìa giấy Kraft thân thiện môi trường, ruột giấy ngà chống mỏi mắt.',9.50,200,4.5,'https://images.unsplash.com/photo-1516962215378-7fa2e137ae93?auto=format&fit=crop&q=80&w=800','2026-07-11 01:59:10'),(9,1,'Daily Gratitude Journal','Sổ tay ghi chép lòng biết ơn hàng ngày, bìa dập chữ nổi kim loại mạ vàng lấp lánh.',26.00,45,4.9,'https://images.unsplash.com/photo-1456735190827-d1262f71b8a3?auto=format&fit=crop&q=80&w=800','2026-07-11 01:59:10'),(10,1,'Waterproof Pocket Notepad','Sổ tay bỏ túi chống thấm nước tuyệt đối, lý tưởng cho những chuyến đi dã ngoại hoặc khảo sát.',15.00,60,4.7,'https://images.unsplash.com/photo-1531346878377-a5be20888e57?auto=format&fit=crop&q=80&w=800','2026-07-11 01:59:10'),(11,1,'Softcover Velvet Notebook','Sổ tay bìa nhung mịn màng quý phái, màu đỏ Burgundy thời thượng, ruột giấy kẻ ngang.',29.00,35,4.8,'https://images.unsplash.com/photo-1512820790803-83ca734da794?auto=format&fit=crop&q=80&w=800','2026-07-11 01:59:10'),(12,1,'Archival Ledger Book','Sổ cái kế toán kiểu cổ điển, bìa bọc da góc vải canvas dày dặn, giấy kẻ dòng chính xác.',45.00,15,4.9,'https://images.unsplash.com/photo-1456735190827-d1262f71b8a3?auto=format&fit=crop&q=80&w=800','2026-07-11 01:59:10'),(13,1,'Japanese Washi Paper Pack','Gói 30 tờ giấy Washi truyền thống Nhật Bản với họa tiết hoa anh đào vẽ tay.',19.00,55,4.8,'https://images.unsplash.com/photo-1586075010633-2442dc3d6307?auto=format&fit=crop&q=80&w=800','2026-07-11 01:59:10'),(14,1,'Classic Music Staff Notebook','Sổ chép nhạc chuyên dụng với các dòng kẻ khuông nhạc rõ nét, khoảng cách tiêu chuẩn.',16.50,40,4.6,'https://images.unsplash.com/photo-1506784983877-45594efa4cbe?auto=format&fit=crop&q=80&w=800','2026-07-11 01:59:10'),(15,1,'Weekly Planner Desk Pad','Tấm lịch tuần để bàn tháo rời từng tờ, giấy 120gsm dày dặn giúp sắp xếp lịch trình khoa học.',21.00,75,4.7,'https://images.unsplash.com/photo-1506784983877-45594efa4cbe?auto=format&fit=crop&q=80&w=800','2026-07-11 01:59:10'),(16,1,'Faux Leather Dotted Notebook','Sổ tay chấm dot-grid bìa da PU cao cấp mềm mại, có dây thun cài và túi phụ phía sau bìa.',18.50,110,4.5,'https://images.unsplash.com/photo-1512820790803-83ca734da794?auto=format&fit=crop&q=80&w=800','2026-07-11 01:59:10'),(17,1,'Calligraphy Practice Pad','Tập giấy luyện chữ calligraphy chuyên nghiệp, kẻ sẵn góc nghiêng 55 độ tiêu chuẩn.',14.00,95,4.8,'https://images.unsplash.com/photo-1513364776144-60967b0f800f?auto=format&fit=crop&q=80&w=800','2026-07-11 01:59:10'),(18,1,'Vintage Scrapbook Album','Album lưu bút dán ảnh kiểu cổ điển, ruột giấy kraft đen dày dặn kèm góc dán ảnh.',38.00,20,4.9,'https://images.unsplash.com/photo-1517842645767-c639042777db?auto=format&fit=crop&q=80&w=800','2026-07-11 01:59:10'),(19,1,'Luxury Gilt Edge Notebook','Sổ tay mạ viền vàng 24K sang trọng, bìa da dập vân da cá sấu vương giả.',55.00,18,5.0,'https://images.unsplash.com/photo-1544816155-12df9643f363?auto=format&fit=crop&q=80&w=800','2026-07-11 01:59:10'),(20,1,'Recycled Cotton Stationery Set','Bộ văn phòng phẩm sinh thái từ bông tái chế, hoàn toàn không chất tẩy trắng độc hại.',25.00,50,4.6,'https://images.unsplash.com/photo-1586075010633-2442dc3d6307?auto=format&fit=crop&q=80&w=800','2026-07-11 01:59:10'),(21,1,'Atelier Spiral Sketchbook','Sổ phác thảo gáy lò xo kép chắc chắn, giấy màu kem ấm áp chống lóa mắt.',17.00,85,4.7,'https://images.unsplash.com/photo-1531346878377-a5be20888e57?auto=format&fit=crop&q=80&w=800','2026-07-11 01:59:10'),(22,1,'Stilo Blank Greeting Cards','Hộp 15 thiệp chúc mừng trơn kèm phong bì, chất liệu giấy gân sần cao cấp của Mỹ.',20.00,65,4.8,'https://images.unsplash.com/photo-1586075010633-2442dc3d6307?auto=format&fit=crop&q=80&w=800','2026-07-11 01:59:10'),(23,1,'Pocket Black Paper Notebook','Sổ tay ruột giấy đen tuyền huyền bí, thích hợp cho bút gel metallic hoặc mực dạ quang.',11.00,90,4.4,'https://images.unsplash.com/photo-1512820790803-83ca734da794?auto=format&fit=crop&q=80&w=800','2026-07-11 01:59:10'),(24,1,'Luxury Wedding Guestbook','Sổ ký tên ngày cưới sang trọng, bìa lụa tơ tằm dập nhũ vàng hoa văn cổ điển.',48.00,12,4.9,'https://images.unsplash.com/photo-1456735190827-d1262f71b8a3?auto=format&fit=crop&q=80&w=800','2026-07-11 01:59:10'),(25,1,'Architect Grid Sketchpad','Bản phác thảo khổ A3 cho kiến trúc sư, lưới grid xanh mờ giúp định hình tỷ lệ bản vẽ.',32.00,30,4.8,'https://images.unsplash.com/photo-1506784983877-45594efa4cbe?auto=format&fit=crop&q=80&w=800','2026-07-11 01:59:10'),(26,2,'Brass Fountain Pen','Bút máy đồng thau đúc nguyên khối, ngòi mạ vàng 18K chế tác tinh xảo bởi các nghệ nhân.',120.00,15,4.8,'https://images.unsplash.com/photo-1511467687858-23d96c32e4ae?auto=format&fit=crop&q=80&w=800','2026-07-11 01:59:10'),(27,2,'Classic Obsidian Fountain Pen','Bút máy vỏ đá thủy tinh đen Obsidian bóng bẩy, cơ chế bơm mực piston hiện đại.',145.00,10,4.9,'https://images.unsplash.com/photo-1583485088034-697b5bc54ccd?auto=format&fit=crop&q=80&w=800','2026-07-11 01:59:10'),(28,2,'Sapphire Blue Calligraphy Pen','Bút viết Calligraphy cao cấp màu xanh lam ngọc, ngòi dẹt hỗ trợ viết chữ Gothic thanh đậm.',35.00,40,4.7,'https://images.unsplash.com/photo-1513364776144-60967b0f800f?auto=format&fit=crop&q=80&w=800','2026-07-11 01:59:10'),(29,2,'Emerald Green Inkwell','Bình mực thủy tinh sang trọng màu xanh ngọc lục bảo, chống phai màu và kháng nước.',25.00,30,4.8,'https://images.unsplash.com/photo-1516962215378-7fa2e137ae93?auto=format&fit=crop&q=80&w=800','2026-07-11 01:59:10'),(30,2,'Handcrafted Glass Dip Pen','Bút chấm mực bằng thủy tinh Murano thổi thủ công rực rỡ, ngòi rãnh giữ mực cực tốt.',42.00,20,4.9,'https://images.unsplash.com/photo-1583485088034-697b5bc54ccd?auto=format&fit=crop&q=80&w=800','2026-07-11 01:59:10'),(31,2,'Rose Gold Fineliner Set','Bộ 4 bút kim vẽ nét mảnh màu vàng hồng thời trang, chống thấm nước, ngòi kim loại siêu bền.',18.00,75,4.6,'https://images.unsplash.com/photo-1513364776144-60967b0f800f?auto=format&fit=crop&q=80&w=800','2026-07-11 01:59:10'),(32,2,'Charcoal Matte Rollerball Pen','Bút dạ bi vỏ nhôm anode đen nhám sang trọng, mực gel lỏng viết siêu trơn tru.',55.00,50,4.7,'https://images.unsplash.com/photo-1511467687858-23d96c32e4ae?auto=format&fit=crop&q=80&w=800','2026-07-11 01:59:10'),(33,2,'Scented Autumn Ink Collection','Hộp 3 lọ mực thơm hương mùa thu đặc trưng: Gỗ thông, Quế ấm và Lá khô phong rụng.',38.00,25,4.8,'https://images.unsplash.com/photo-1516962215378-7fa2e137ae93?auto=format&fit=crop&q=80&w=800','2026-07-11 01:59:10'),(34,2,'Professional Drafting Pencil','Bút chì bấm cơ học chuyên dụng cho vẽ kỹ thuật, vỏ thép cứng cáp, đầu ngòi thu gọn.',28.00,60,4.8,'https://images.unsplash.com/photo-1513364776144-60967b0f800f?auto=format&fit=crop&q=80&w=800','2026-07-11 01:59:10'),(35,2,'Luxury Quill Writing Set','Bộ bút lông ngỗng cổ điển phong cách hoàng gia Pháp, kèm 1 lọ mực đen và đế cắm đồng.',68.00,15,4.9,'https://images.unsplash.com/photo-1583485088034-697b5bc54ccd?auto=format&fit=crop&q=80&w=800','2026-07-11 01:59:10'),(36,2,'Carbon Fiber Executive Pen','Bút doanh nhân vỏ sợi carbon siêu nhẹ siêu bền, điểm nhấn mạ chrome bạc sáng loáng.',95.00,22,4.9,'https://images.unsplash.com/photo-1511467687858-23d96c32e4ae?auto=format&fit=crop&q=80&w=800','2026-07-11 01:59:10'),(37,2,'Pastel Gel Pen Set (12 Colors)','Bộ 12 bút nước màu pastel dịu dàng, viết êm ái trên cả giấy trắng lẫn giấy tối màu.',16.00,120,4.5,'https://images.unsplash.com/photo-1513364776144-60967b0f800f?auto=format&fit=crop&q=80&w=800','2026-07-11 01:59:10'),(38,2,'Walnut Wood Fountain Pen','Bút máy vỏ gỗ óc chó tự nhiên mộc mạc ấm áp, vân gỗ độc bản cho từng chiếc bút bán ra.',85.00,18,4.8,'https://images.unsplash.com/photo-1583485088034-697b5bc54ccd?auto=format&fit=crop&q=80&w=800','2026-07-11 01:59:10'),(39,2,'Premium Metallic Brush Pens','Bộ 6 bút cọ thư pháp nhũ ánh kim, mực phủ dày tạo hiệu ứng lấp lánh sang trọng.',24.00,80,4.7,'https://images.unsplash.com/photo-1513364776144-60967b0f800f?auto=format&fit=crop&q=80&w=800','2026-07-11 01:59:10'),(40,2,'Ebonite Vintage Fountain Pen','Bút máy cao su lưu hóa Ebonite mang phong cách thập niên 1920, ngòi flex dẻo đàn hồi.',110.00,8,5.0,'https://images.unsplash.com/photo-1511467687858-23d96c32e4ae?auto=format&fit=crop&q=80&w=800','2026-07-11 01:59:10'),(41,2,'Copper Ballpoint Pen','Bút bi xoay vỏ đồng đỏ nguyên chất, tự oxi hóa lên màu đồng rỉ cổ kính theo thời gian sử dụng.',45.00,40,4.6,'https://images.unsplash.com/photo-1511467687858-23d96c32e4ae?auto=format&fit=crop&q=80&w=800','2026-07-11 01:59:10'),(42,2,'Permanent Archival Document Ink','Lọ mực chống giả mạo chuyên dùng ký văn bản quan trọng, kháng hóa chất tẩy rửa cực cao.',29.50,35,4.9,'https://images.unsplash.com/photo-1516962215378-7fa2e137ae93?auto=format&fit=crop&q=80&w=800','2026-07-11 01:59:10'),(43,2,'Bespoke Urushi Lacquer Pen','Bút máy sơn mài Urushi truyền thống Nhật Bản, hoàn thiện hoàn toàn thủ công hơn 6 tháng.',450.00,3,5.0,'https://images.unsplash.com/photo-1583485088034-697b5bc54ccd?auto=format&fit=crop&q=80&w=800','2026-07-11 01:59:10'),(44,2,'Classic Mechanical Lead Set','Bộ ruột ngòi chì graphite 2.0mm chất lượng cao cấp, đầy đủ độ cứng từ 2B đến 6B.',12.00,150,4.4,'https://images.unsplash.com/photo-1513364776144-60967b0f800f?auto=format&fit=crop&q=80&w=800','2026-07-11 01:59:10'),(45,2,'Pocket Brass Liliput Pen','Bút máy tí hon bằng đồng thau, dài chỉ 9.7cm khi đóng nắp, siêu gọn gàng để mang theo.',78.00,20,4.7,'https://images.unsplash.com/photo-1511467687858-23d96c32e4ae?auto=format&fit=crop&q=80&w=800','2026-07-11 01:59:10'),(46,2,'Indigo Blue Fountain Pen Ink','Mực bút máy sắc xanh chàm Indigo tự nhiên chiết xuất từ thực vật, êm dịu bảo vệ ngòi bút.',22.00,45,4.7,'https://images.unsplash.com/photo-1516962215378-7fa2e137ae93?auto=format&fit=crop&q=80&w=800','2026-07-11 01:59:10'),(47,2,'Luxury Leather Dual Pen Sleeve','Bao da bò đựng vừa 2 bút máy sang trọng, lót nhung mềm mại tránh trầy xước vỏ bút.',36.00,35,4.8,'https://images.unsplash.com/photo-1583485088034-697b5bc54ccd?auto=format&fit=crop&q=80&w=800','2026-07-11 01:59:10'),(48,2,'Ceramic Body Rollerball','Bút dạ vỏ gốm sứ trắng hoa văn xanh lam Cobalt thanh tao, mang nét đẹp gốm sứ truyền thống.',130.00,7,4.9,'https://images.unsplash.com/photo-1511467687858-23d96c32e4ae?auto=format&fit=crop&q=80&w=800','2026-07-11 01:59:10'),(49,2,'Fine Liner Technical Drawing Set','Bộ 6 bút kim vẽ kỹ thuật nhiều cỡ nét từ 0.05mm đến 0.8mm chuyên cho kiến trúc họa sĩ.',25.00,90,4.6,'https://images.unsplash.com/photo-1513364776144-60967b0f800f?auto=format&fit=crop&q=80&w=800','2026-07-11 01:59:10'),(50,2,'Shimmering Gold Dust Ink','Lọ mực bút máy chứa bột nhũ vàng 24K siêu mịn, lấp lánh tuyệt đẹp khi viết dưới ánh sáng.',32.00,40,4.9,'https://images.unsplash.com/photo-1516962215378-7fa2e137ae93?auto=format&fit=crop&q=80&w=800','2026-07-11 01:59:10'),(51,3,'Handmade Brass Envelopes Clip','Kẹp giấy thư bằng đồng thau chạm khắc hoa văn cổ điển, lực kẹp mạnh mẽ vững chắc.',18.00,50,4.7,'https://images.unsplash.com/photo-1586075010633-2442dc3d6307?auto=format&fit=crop&q=80&w=800','2026-07-11 01:59:10'),(52,3,'Studio Felt Desk Mat','Tấm thảm trải bàn làm việc bằng len dạ Merino tự nhiên dày 4mm ấm áp chống trượt.',56.00,50,4.9,'https://images.unsplash.com/photo-1518455027359-f3f816b1a22a?auto=format&fit=crop&q=80&w=800','2026-07-11 01:59:10'),(53,3,'Brass Architect Ruler 30cm','Thước kẻ tam giác kiến trúc sư bằng đồng thau nặng tay, dập thước đo sắc nét không mòn.',32.00,4,4.8,'https://images.unsplash.com/photo-1506784983877-45594efa4cbe?auto=format&fit=crop&q=80&w=800','2026-07-11 01:59:10'),(54,3,'Vintage Brass Scissors','Kéo cắt giấy thủ công bằng đồng thau mộc mạc, lưỡi thép đúc sắc bén bền bỉ.',26.00,30,4.7,'https://images.unsplash.com/photo-1516962215378-7fa2e137ae93?auto=format&fit=crop&q=80&w=800','2026-07-11 01:59:10'),(55,3,'Solid Oak Pencil Holder','Hộp cắm bút bằng gỗ sồi nguyên khối vân gỗ tự nhiên sang trọng cho bàn làm việc.',38.00,35,4.6,'https://images.unsplash.com/photo-1516962215378-7fa2e137ae93?auto=format&fit=crop&q=80&w=800','2026-07-11 01:59:10'),(56,3,'Wax Seal Stamp Kit - Forest','Bộ con dấu sáp và nến chảy hoa văn khu rừng, bao gồm 1 con dấu đồng và 3 thỏi sáp màu.',45.00,25,4.9,'https://images.unsplash.com/photo-1516962215378-7fa2e137ae93?auto=format&fit=crop&q=80&w=800','2026-07-11 01:59:10'),(57,3,'Desk Organizer Tray Set','Bộ khay gỗ óc chó đa năng sắp xếp tài liệu, kẹp ghim và bút ngăn nắp khoa học.',85.00,15,4.8,'https://images.unsplash.com/photo-1518455027359-f3f816b1a22a?auto=format&fit=crop&q=80&w=800','2026-07-11 01:59:10'),(58,3,'Glass Hourglass 30 Minutes','Đồng hồ cát thủy tinh tinh xảo canh giờ 30 phút, cát mịn màu trắng giúp tập trung làm việc.',29.00,45,4.7,'https://images.unsplash.com/photo-1516962215378-7fa2e137ae93?auto=format&fit=crop&q=80&w=800','2026-07-11 01:59:10'),(59,3,'Antique Brass Paperweight','Cục chặn giấy bằng đồng thau đúc hình la bàn cổ tinh xảo, nặng 300g đầm tay.',34.00,28,4.8,'https://images.unsplash.com/photo-1586075010633-2442dc3d6307?auto=format&fit=crop&q=80&w=800','2026-07-11 01:59:10'),(60,3,'Studio Desktop Tape Dispenser','Dụng cụ cắt băng keo để bàn bằng gang đúc nặng chắc chắn, phong cách công nghiệp cổ xưa.',48.00,20,4.6,'https://images.unsplash.com/photo-1516962215378-7fa2e137ae93?auto=format&fit=crop&q=80&w=800','2026-07-11 01:59:10'),(61,3,'Leather Blotter Pad Large','Tấm lót viết da bò thuộc thảo mộc khổ lớn, nâng đỡ ngòi bút viết êm ái tối đa.',95.00,12,4.9,'https://images.unsplash.com/photo-1518455027359-f3f816b1a22a?auto=format&fit=crop&q=80&w=800','2026-07-11 01:59:10'),(62,3,'Pocket Brass Pencil Sharpener','Gọt bút chì bỏ túi bằng đồng thau đúc, có thể thay thế lưỡi dao thép siêu tiện lợi.',16.00,100,4.5,'https://images.unsplash.com/photo-1516962215378-7fa2e137ae93?auto=format&fit=crop&q=80&w=800','2026-07-11 01:59:10'),(63,3,'Rotary Desk Calendar Wood','Lịch vạn niên xoay bằng gỗ và đồng thau, sử dụng trọn đời vô cùng thân thiện môi trường.',27.00,60,4.8,'https://images.unsplash.com/photo-1506784983877-45594efa4cbe?auto=format&fit=crop&q=80&w=800','2026-07-11 01:59:10'),(64,3,'Studio Canvas Tool Roll','Túi cuộn đựng bút vẽ vải canvas sáp chống thấm mộc mạc, có 10 khe giắt bút đa năng.',32.00,45,4.7,'https://images.unsplash.com/photo-1531346878377-a5be20888e57?auto=format&fit=crop&q=80&w=800','2026-07-11 01:59:10'),(65,3,'Porcelain Ink Mixing Palette','Đĩa pha mực sứ trắng hình bông hoa 7 cánh, chống bám màu dễ lau chùi sau khi vẽ.',18.50,70,4.6,'https://images.unsplash.com/photo-1513364776144-60967b0f800f?auto=format&fit=crop&q=80&w=800','2026-07-11 01:59:10'),(66,3,'Vintage Stamp Carousel Holder','Kệ treo con dấu xoay tròn bằng sắt uốn nghệ thuật cổ điển, lưu trữ tối đa 8 con dấu.',42.00,15,4.7,'https://images.unsplash.com/photo-1516962215378-7fa2e137ae93?auto=format&fit=crop&q=80&w=800','2026-07-11 01:59:10'),(67,3,'Copper Leaf Bookmark Set','Bộ 4 kẹp sách hình lá cây bằng đồng đỏ mỏng nhẹ tinh xảo, phụ kiện sang trọng cho người yêu sách.',14.00,200,4.8,'https://images.unsplash.com/photo-1586075010633-2442dc3d6307?auto=format&fit=crop&q=80&w=800','2026-07-11 01:59:10'),(68,3,'Walnut Letter Opener','Dao rọc thư bằng gỗ óc chó phối hợp lưỡi đồng thau mài mượt mà, rọc thư nhanh chóng.',24.00,40,4.5,'https://images.unsplash.com/photo-1516962215378-7fa2e137ae93?auto=format&fit=crop&q=80&w=800','2026-07-11 01:59:10'),(69,3,'Studio Desk Gooseneck Lamp','Đèn bàn làm việc dáng cổ điển gập điều chỉnh hướng, kim loại sơn tĩnh điện xanh rêu quý phái.',115.00,8,4.9,'https://images.unsplash.com/photo-1518455027359-f3f816b1a22a?auto=format&fit=crop&q=80&w=800','2026-07-11 01:59:10'),(70,3,'Brass Push Pins Box (50pcs)','Hộp 50 ghim bảng bằng đồng thau đầu tròn sang trọng, đựng trong hộp thiếc retro.',9.50,150,4.4,'https://images.unsplash.com/photo-1586075010633-2442dc3d6307?auto=format&fit=crop&q=80&w=800','2026-07-11 01:59:10'),(71,3,'Calligraphy Oblique Pen Holder','Cán bút liên kết nghiêng Oblique chất liệu nhựa Acrylic giả cẩm thạch cực kỳ sang trọng.',36.00,30,4.8,'https://images.unsplash.com/photo-1513364776144-60967b0f800f?auto=format&fit=crop&q=80&w=800','2026-07-11 01:59:10'),(72,3,'Solid Brass Protractor','Thước đo độ bán nguyệt bằng đồng thau dày dặn, vạch khắc sâu vĩnh viễn không phai.',21.00,55,4.6,'https://images.unsplash.com/photo-1506784983877-45594efa4cbe?auto=format&fit=crop&q=80&w=800','2026-07-11 01:59:10'),(73,3,'Minimalist Wooden Desk Easel','Giá đỡ vẽ tranh phác thảo bằng gỗ thông tự nhiên để bàn, điều chỉnh được nhiều độ nghiêng.',39.00,25,4.7,'https://images.unsplash.com/photo-1513364776144-60967b0f800f?auto=format&fit=crop&q=80&w=800','2026-07-11 01:59:10'),(74,3,'Wax Melting Copper Spoon','Thìa múc sáp bằng đồng thau kèm tay cầm gỗ cách nhiệt chuyên dụng cho con dấu sáp.',12.50,120,4.7,'https://images.unsplash.com/photo-1516962215378-7fa2e137ae93?auto=format&fit=crop&q=80&w=800','2026-07-11 01:59:10'),(75,3,'Studio Magnifying Glass','Kính lúp phóng đại tay cầm bọc da thật phong cách thám tử, thấu kính thủy tinh quang học sắc nét.',45.00,18,4.8,'https://images.unsplash.com/photo-1516962215378-7fa2e137ae93?auto=format&fit=crop&q=80&w=800','2026-07-11 01:59:10');
/*!40000 ALTER TABLE `products` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `users`
--

DROP TABLE IF EXISTS `users`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `users` (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `full_name` varchar(255) NOT NULL,
  `email` varchar(255) NOT NULL,
  `password_hash` varchar(255) NOT NULL,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  `role` varchar(255) NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `email` (`email`)
) ENGINE=InnoDB AUTO_INCREMENT=10 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `users`
--

LOCK TABLES `users` WRITE;
/*!40000 ALTER TABLE `users` DISABLE KEYS */;
INSERT INTO `users` VALUES (1,'Restored User 1','restored1@studio.com','dummy','2026-05-28 11:47:20','2026-05-28 11:47:20','user'),(2,'Restored User 2','restored2@studio.com','dummy','2026-05-28 11:47:20','2026-05-28 11:47:20','user'),(3,'Restored User 3','restored3@studio.com','dummy','2026-05-28 11:47:20','2026-05-28 11:47:20','user'),(4,'Restored User 4','restored4@studio.com','dummy','2026-05-28 11:47:20','2026-05-28 11:47:20','user'),(5,'aaa','aaa@gmail.com','$2a$10$GS7WUz3aXv7J9YIZa3zSYO3dGmERNI8LWrnxKg7Xn8OuDOzJ0M4gi','2026-05-26 07:21:49','2026-05-26 07:21:49','user'),(6,'admin@studio.com','admin@studio.com','$2a$10$bnt5F7ZYTLXcNF.J3/bWY.KadP/wlZErVYwGP5KHhqyZIpfJUrJRK','2026-05-26 07:33:24','2026-05-26 07:34:27','admin'),(7,'BCX','BCX@gmail.com','$2a$10$8zqQX8dAECExKw.Svhg.e.OtHfQv8ZVZQAJCCP4r5wma4a9gK72qa','2026-05-28 05:01:37','2026-05-28 05:01:37','user'),(8,'bbb','bbb@gmail.com','$2a$10$a.cUTvJeuxI7qELweGjgRuulVlxdfvrFqxRDUFNKcUCMavdDawP2i','2026-05-28 05:55:54','2026-05-28 05:55:54','user'),(9,'cxv','cxv@gmail.com','$2a$10$RamBN8kzBxe5r7kANleYiOeyadGYtYfyTCp63cKh6CGhtTTK38Oc6','2026-05-28 06:08:44','2026-05-28 06:08:44','user');
/*!40000 ALTER TABLE `users` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `wishlist_items`
--

DROP TABLE IF EXISTS `wishlist_items`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `wishlist_items` (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `created_at` datetime(6) DEFAULT NULL,
  `product_id` bigint DEFAULT NULL,
  `user_id` bigint DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `UKtp53unkks741xiqi6m620i7mx` (`user_id`,`product_id`),
  KEY `FKqxj7lncd242b59fb78rqegyxj` (`product_id`),
  CONSTRAINT `FKmmj2k1i459yu449k3h1vx5abp` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`),
  CONSTRAINT `FKqxj7lncd242b59fb78rqegyxj` FOREIGN KEY (`product_id`) REFERENCES `products` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=4 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `wishlist_items`
--

LOCK TABLES `wishlist_items` WRITE;
/*!40000 ALTER TABLE `wishlist_items` DISABLE KEYS */;
/*!40000 ALTER TABLE `wishlist_items` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Dumping events for database 'stilo_db'
--

--
-- Dumping routines for database 'stilo_db'
--
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2026-07-11 10:48:42
