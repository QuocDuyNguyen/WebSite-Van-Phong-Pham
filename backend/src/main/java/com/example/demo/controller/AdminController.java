package com.example.demo.controller;

import com.example.demo.entity.Category;
import com.example.demo.entity.Order;
import com.example.demo.entity.Product;
import com.example.demo.repository.CategoryRepository;
import com.example.demo.repository.OrderItemRepository;
import com.example.demo.repository.OrderRepository;
import com.example.demo.repository.ProductRepository;
import com.example.demo.repository.WishlistItemRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.bind.annotation.*;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;
import lombok.Data;
import lombok.AllArgsConstructor;
import lombok.NoArgsConstructor;

/**
 * Controller quản lý các chức năng dành cho Quản trị viên (Admin).
 * Cung cấp các API để quản lý Đơn hàng (Order), Sản phẩm (Product) và Danh mục (Category).
 */
@CrossOrigin(origins = "*", maxAge = 3600)
@RestController
@RequestMapping("/api/admin")
public class AdminController {

    @Autowired
    private OrderRepository orderRepository;

    @Autowired
    private ProductRepository productRepository;

    @Autowired
    private CategoryRepository categoryRepository;

    @Autowired
    private WishlistItemRepository wishlistItemRepository;

    @Autowired
    private OrderItemRepository orderItemRepository;

    @Data
    @AllArgsConstructor
    @NoArgsConstructor
    public static class AdminOrderDto {
        private Long id;
        private String customerName;
        private String customerEmail;
        private BigDecimal totalAmount;
        private LocalDateTime createdAt;
        private String status;
    }

    /**
     * Lấy danh sách tất cả các đơn hàng trong hệ thống.
     * API này chuyển đổi entity Order sang DTO AdminOrderDto để trả về cho Client.
     * @return Danh sách đơn hàng
     */
    @GetMapping("/orders")
    public ResponseEntity<List<AdminOrderDto>> getAllOrders() {
        List<AdminOrderDto> orders = orderRepository.findAll().stream()
            .map(o -> new AdminOrderDto(
                o.getId(),
                o.getUser().getFullName(),
                o.getUser().getEmail(),
                o.getTotalAmount(),
                o.getCreatedAt(),
                o.getStatus()
            )).collect(Collectors.toList());
        return ResponseEntity.ok(orders);
    }

    @Data
    @NoArgsConstructor
    @AllArgsConstructor
    public static class OrderStatusRequest {
        private String status;
    }

    /**
     * Cập nhật trạng thái của một đơn hàng cụ thể.
     * @param id ID của đơn hàng cần cập nhật
     * @param request Dữ liệu chứa trạng thái mới (ví dụ: 'shipped', 'delivered')
     * @return Thông báo thành công hoặc lỗi 404 nếu không tìm thấy đơn hàng
     */
    @PutMapping("/orders/{id}/status")
    public ResponseEntity<?> updateOrderStatus(@PathVariable Long id, @RequestBody OrderStatusRequest request) {
        Order order = orderRepository.findById(id).orElse(null);
        if (order != null) {
            order.setStatus(request.getStatus());
            orderRepository.save(order);
            return ResponseEntity.ok().build();
        }
        return ResponseEntity.notFound().build();
    }

    @Data
    @NoArgsConstructor
    @AllArgsConstructor
    public static class ProductRequest {
        private String name;
        private BigDecimal price;
        private Long categoryId;
        private Integer stockQuantity;
        private String imageUrl;
    }

    /**
     * Thêm mới một sản phẩm vào hệ thống.
     * @param request Dữ liệu sản phẩm mới từ Client
     * @return Thông tin sản phẩm vừa được tạo
     */
    @PostMapping("/products")
    public ResponseEntity<?> createProduct(@RequestBody ProductRequest request) {
        Product product = new Product();
        product.setName(request.getName());
        product.setPrice(request.getPrice());
        product.setStockQuantity(request.getStockQuantity());
        product.setImageUrl(request.getImageUrl());
        Category category = categoryRepository.findById(request.getCategoryId()).orElse(null);
        product.setCategory(category);
        productRepository.save(product);
        return ResponseEntity.ok(product);
    }

    /**
     * Cập nhật thông tin của một sản phẩm.
     * @param id ID của sản phẩm cần cập nhật
     * @param request Dữ liệu sản phẩm mới
     * @return Sản phẩm sau khi cập nhật hoặc lỗi 404 nếu không tìm thấy
     */
    @PutMapping("/products/{id}")
    public ResponseEntity<?> updateProduct(@PathVariable Long id, @RequestBody ProductRequest request) {
        Product product = productRepository.findById(id).orElse(null);
        if (product != null) {
            product.setName(request.getName());
            product.setPrice(request.getPrice());
            product.setStockQuantity(request.getStockQuantity());
            product.setImageUrl(request.getImageUrl());
            Category category = categoryRepository.findById(request.getCategoryId()).orElse(null);
            product.setCategory(category);
            productRepository.save(product);
            return ResponseEntity.ok(product);
        }
        return ResponseEntity.notFound().build();
    }

    /**
     * Xóa một sản phẩm khỏi hệ thống dựa trên ID.
     * @param id ID của sản phẩm cần xóa
     * @return Thông báo thành công
     */
    @Transactional
    @DeleteMapping("/products/{id}")
    public ResponseEntity<?> deleteProduct(@PathVariable Long id) {
        if (!productRepository.existsById(id)) {
            return ResponseEntity.notFound().build();
        }
        wishlistItemRepository.deleteByProductId(id);
        orderItemRepository.unlinkProductFromOrders(id);
        productRepository.deleteById(id);
        return ResponseEntity.ok().build();
    }
}
