package com.example.demo.controller;

import com.example.demo.entity.Category;
import com.example.demo.repository.CategoryRepository;
import com.example.demo.repository.ProductRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.List;
import java.util.stream.Collectors;
import lombok.Data;
import lombok.AllArgsConstructor;

/**
 * Controller xử lý các yêu cầu liên quan đến Danh mục sản phẩm (Category).
 * Cung cấp API để lấy danh sách các danh mục và số lượng sản phẩm trong từng danh mục.
 */
@CrossOrigin(origins = "*", maxAge = 3600)
@RestController
@RequestMapping("/api/categories")
public class CategoryController {
    
    @Autowired
    CategoryRepository categoryRepository;

    @Autowired
    ProductRepository productRepository;

    @Data
    @AllArgsConstructor
    public static class CategoryDto {
        private Long id;
        private String name;
        private String description;
        private String imageUrl;
        private Long count;
    }

    /**
     * Lấy danh sách tất cả các danh mục sản phẩm.
     * Chuyển đổi từ Entity Category sang DTO CategoryDto và tính toán số lượng sản phẩm (count) thuộc về mỗi danh mục.
     * @return Danh sách các danh mục kèm số lượng sản phẩm tương ứng
     */
    @GetMapping
    public ResponseEntity<List<CategoryDto>> getAllCategories() {
        List<CategoryDto> dtos = categoryRepository.findAll().stream().map(c -> {
            Long count = productRepository.countByCategoryId(c.getId());
            return new CategoryDto(c.getId(), c.getName(), c.getDescription(), c.getImageUrl(), count);
        }).collect(Collectors.toList());
        return ResponseEntity.ok(dtos);
    }
}
