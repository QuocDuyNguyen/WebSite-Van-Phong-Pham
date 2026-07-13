package com.example.demo.controller;

import com.example.demo.dto.OrderRequest;
import com.example.demo.entity.Order;
import com.example.demo.entity.OrderItem;
import com.example.demo.entity.Product;
import com.example.demo.entity.User;
import com.example.demo.repository.OrderRepository;
import com.example.demo.repository.ProductRepository;
import com.example.demo.repository.UserRepository;
import com.example.demo.security.UserDetailsImpl;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.math.BigDecimal;
import java.time.YearMonth;
import java.time.format.DateTimeFormatter;
import java.time.format.DateTimeParseException;
import java.util.List;
import java.util.Map;
import java.util.regex.Pattern;

/**
 * Controller xử lý các yêu cầu liên quan đến Đơn hàng (Order) của người dùng.
 * Bao gồm xem danh sách đơn hàng cá nhân và tạo đơn hàng mới (Checkout).
 */
@CrossOrigin(origins = "*", maxAge = 3600)
@RestController
@RequestMapping("/api/orders")
public class OrderController {
    private static final Pattern EXPIRY_PATTERN = Pattern.compile("^(0[1-9]|1[0-2])/\\d{2}$");
    private static final DateTimeFormatter EXPIRY_FORMATTER = DateTimeFormatter.ofPattern("MM/yy");

    @Autowired
    OrderRepository orderRepository;

    @Autowired
    UserRepository userRepository;

    @Autowired
    ProductRepository productRepository;

    /**
     * Lấy danh sách lịch sử đơn hàng của người dùng hiện tại đang đăng nhập.
     * @param authentication Thông tin xác thực để lấy ID người dùng
     * @return Danh sách các đơn hàng
     */
    @GetMapping
    public ResponseEntity<List<Order>> getUserOrders(Authentication authentication) {
        UserDetailsImpl userDetails = (UserDetailsImpl) authentication.getPrincipal();
        List<Order> orders = orderRepository.findByUserId(userDetails.getId());
        return ResponseEntity.ok(orders);
    }

    /**
     * Tạo một đơn hàng mới từ giỏ hàng (Checkout).
     * Kiểm tra tính hợp lệ của giỏ hàng, địa chỉ giao hàng và hạn sử dụng thẻ thanh toán.
     * @param orderRequest Dữ liệu đơn hàng bao gồm danh sách sản phẩm, địa chỉ, thanh toán
     * @param authentication Thông tin người dùng đang thực hiện đặt hàng
     * @return Đơn hàng vừa tạo thành công hoặc lỗi xác thực
     */
    @PostMapping
    public ResponseEntity<?> createOrder(@RequestBody OrderRequest orderRequest, Authentication authentication) {
        if (orderRequest.getItems() == null || orderRequest.getItems().isEmpty()) {
            return ResponseEntity.badRequest().body(Map.of("error", "Cart is empty"));
        }

        if (orderRequest.getShippingAddress() == null || orderRequest.getShippingAddress().isBlank()) {
            return ResponseEntity.badRequest().body(Map.of("error", "Shipping address is required"));
        }

        boolean isMoMo = orderRequest.getPaymentMethod() != null && orderRequest.getPaymentMethod().toLowerCase().contains("momo");
        if (!isMoMo && (orderRequest.getPaymentExpiry() == null || isCardExpired(orderRequest.getPaymentExpiry()))) {
            return ResponseEntity.badRequest().body(Map.of("error", "This card has expired. Please use a card with a future expiry date."));
        }

        UserDetailsImpl userDetails = (UserDetailsImpl) authentication.getPrincipal();
        User user = userRepository.findById(userDetails.getId()).orElse(null);

        if (user == null) {
            return ResponseEntity.badRequest().body(Map.of("error", "User not found"));
        }

        Order order = new Order();
        order.setUser(user);
        order.setShippingAddress(orderRequest.getShippingAddress());
        order.setPaymentMethod(orderRequest.getPaymentMethod());
        order.setPaymentExpiry(orderRequest.getPaymentExpiry());
        order.setStatus("pending");

        BigDecimal totalAmount = BigDecimal.ZERO;

        for (OrderRequest.OrderItemRequest itemReq : orderRequest.getItems()) {
            if (itemReq.getProductId() == null || itemReq.getQuantity() == null || itemReq.getQuantity() <= 0) {
                return ResponseEntity.badRequest().body(Map.of("error", "Invalid order item"));
            }

            Product product = productRepository.findById(itemReq.getProductId()).orElse(null);
            if (product == null) {
                return ResponseEntity.badRequest().body(Map.of("error", "Product not found: " + itemReq.getProductId()));
            }

            if (product.getStockQuantity() < itemReq.getQuantity()) {
                return ResponseEntity.badRequest().body(Map.of("error", "Not enough stock for product: " + product.getName()));
            }
            
            // Trừ tồn kho và lưu lại
            product.setStockQuantity(product.getStockQuantity() - itemReq.getQuantity());
            productRepository.save(product);

            OrderItem item = new OrderItem();
            item.setOrder(order);
            item.setProduct(product);
            item.setQuantity(itemReq.getQuantity());
            item.setUnitPrice(product.getPrice());
            order.getItems().add(item);

            totalAmount = totalAmount.add(product.getPrice().multiply(new BigDecimal(itemReq.getQuantity())));
        }

        order.setTotalAmount(totalAmount);
        orderRepository.save(order);

        return ResponseEntity.ok(order);
    }

    /**
     * Kiểm tra xem thẻ thanh toán (định dạng MM/yy) đã hết hạn hay chưa.
     * @param expiryDate Chuỗi hạn sử dụng thẻ
     * @return true nếu thẻ đã hết hạn hoặc sai định dạng, false nếu còn hạn
     */
    private boolean isCardExpired(String expiryDate) {
        String normalizedExpiryDate = expiryDate.trim();
        if (!EXPIRY_PATTERN.matcher(normalizedExpiryDate).matches()) {
            return true;
        }

        try {
            YearMonth expiryMonth = YearMonth.parse(normalizedExpiryDate, EXPIRY_FORMATTER);
            YearMonth currentMonth = YearMonth.now();
            return expiryMonth.isBefore(currentMonth);
        } catch (DateTimeParseException ex) {
            return true;
        }
    }
}
