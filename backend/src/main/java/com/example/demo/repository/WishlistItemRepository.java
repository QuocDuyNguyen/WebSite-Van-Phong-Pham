package com.example.demo.repository;

import com.example.demo.entity.WishlistItem;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Optional;

public interface WishlistItemRepository extends JpaRepository<WishlistItem, Long> {
    List<WishlistItem> findByUserId(Long userId);
    Optional<WishlistItem> findByUserIdAndProductId(Long userId, Long productId);
    
    @Transactional
    void deleteByUserIdAndProductId(Long userId, Long productId);

    @Transactional
    void deleteByProductId(Long productId);
}
