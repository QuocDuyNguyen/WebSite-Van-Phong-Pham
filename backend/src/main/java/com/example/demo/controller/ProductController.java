package com.example.demo.controller;

import com.example.demo.entity.Product;
import com.example.demo.repository.ProductRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;

/**
 * Controller xử lý các yêu cầu liên quan đến Sản phẩm (Product) hiển thị cho người dùng.
 * Bao gồm lấy toàn bộ danh sách sản phẩm và lấy chi tiết một sản phẩm.
 */
@CrossOrigin(origins = "*", maxAge = 3600)
@RestController
@RequestMapping("/api/products")
public class ProductController {
    @Autowired
    ProductRepository productRepository;

    /**
     * Lấy danh sách tất cả các sản phẩm đang có trong hệ thống.
     * @return Danh sách các đối tượng Product
     */
    @GetMapping
    public List<Product> getAllProducts(
            @RequestParam(required = false) String category,
            @RequestParam(required = false) String search) {
        return productRepository.filterProducts(category, search);
    }

    /**
     * Lấy thông tin chi tiết của một sản phẩm dựa trên ID.
     * @param id ID của sản phẩm cần tìm
     * @return Thông tin sản phẩm hoặc lỗi 404 Not Found nếu không tồn tại
     */
    @GetMapping("/{id}")
    public ResponseEntity<Product> getProductById(@PathVariable Long id) {
        Optional<Product> productData = productRepository.findById(id);
        if (productData.isPresent()) {
            return ResponseEntity.ok(productData.get());
        } else {
            return ResponseEntity.notFound().build();
        }
    }
}
