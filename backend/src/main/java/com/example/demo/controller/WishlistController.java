package com.example.demo.controller;

import com.example.demo.entity.Product;
import com.example.demo.entity.User;
import com.example.demo.entity.WishlistItem;
import com.example.demo.repository.ProductRepository;
import com.example.demo.repository.UserRepository;
import com.example.demo.repository.WishlistItemRepository;
import com.example.demo.security.UserDetailsImpl;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.stream.Collectors;

/**
 * Controller xử lý các yêu cầu liên quan đến Danh sách yêu thích (Wishlist).
 * Cho phép người dùng xem, thêm và xóa sản phẩm khỏi danh sách yêu thích cá nhân.
 */
@CrossOrigin(origins = "*", maxAge = 3600)
@RestController
@RequestMapping("/api/wishlists")
public class WishlistController {

    @Autowired
    private WishlistItemRepository wishlistRepository;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private ProductRepository productRepository;

    /**
     * Lấy toàn bộ sản phẩm trong danh sách yêu thích của người dùng hiện tại.
     * @param authentication Thông tin xác thực của người dùng
     * @return Danh sách các sản phẩm (Product) được yêu thích
     */
    @GetMapping
    public ResponseEntity<List<Product>> getUserWishlist(Authentication authentication) {
        UserDetailsImpl userDetails = (UserDetailsImpl) authentication.getPrincipal();
        List<WishlistItem> items = wishlistRepository.findByUserId(userDetails.getId());
        List<Product> products = items.stream().map(WishlistItem::getProduct).collect(Collectors.toList());
        return ResponseEntity.ok(products);
    }

    /**
     * Thêm một sản phẩm vào danh sách yêu thích.
     * Kiểm tra xem sản phẩm đã có trong danh sách chưa trước khi thêm.
     * @param productId ID của sản phẩm cần thêm
     * @param authentication Thông tin người dùng
     * @return Thông báo thành công hoặc lỗi nếu đã tồn tại
     */
    @PostMapping("/{productId}")
    public ResponseEntity<?> addToWishlist(@PathVariable Long productId, Authentication authentication) {
        UserDetailsImpl userDetails = (UserDetailsImpl) authentication.getPrincipal();
        if (wishlistRepository.findByUserIdAndProductId(userDetails.getId(), productId).isPresent()) {
            return ResponseEntity.badRequest().body("Already in wishlist");
        }

        User user = userRepository.findById(userDetails.getId()).orElse(null);
        Product product = productRepository.findById(productId).orElse(null);

        if (user != null && product != null) {
            WishlistItem item = new WishlistItem();
            item.setUser(user);
            item.setProduct(product);
            wishlistRepository.save(item);
            return ResponseEntity.ok().build();
        }
        return ResponseEntity.badRequest().body("User or Product not found");
    }

    /**
     * Xóa một sản phẩm khỏi danh sách yêu thích của người dùng.
     * @param productId ID của sản phẩm cần xóa
     * @param authentication Thông tin người dùng
     * @return Thông báo thành công
     */
    @DeleteMapping("/{productId}")
    public ResponseEntity<?> removeFromWishlist(@PathVariable Long productId, Authentication authentication) {
        UserDetailsImpl userDetails = (UserDetailsImpl) authentication.getPrincipal();
        wishlistRepository.deleteByUserIdAndProductId(userDetails.getId(), productId);
        return ResponseEntity.ok().build();
    }
}
