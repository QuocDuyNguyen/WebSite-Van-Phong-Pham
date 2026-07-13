package com.example.demo.security;

import io.jsonwebtoken.*;
import io.jsonwebtoken.io.Decoders;
import io.jsonwebtoken.security.Keys;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.core.Authentication;
import org.springframework.stereotype.Component;

import java.security.Key;
import java.util.Date;

/**
 * Lớp tiện ích (Utility class) để xử lý JSON Web Token (JWT).
 * Cung cấp các phương thức tạo, giải mã và xác thực token cho người dùng.
 */
@Component
public class JwtUtils {

    @Value("${jwt.secret}")
    private String jwtSecret;

    @Value("${jwt.expiration}")
    private int jwtExpirationMs;

    /**
     * Tạo JWT token dựa trên thông tin xác thực của người dùng (Authentication).
     * @param authentication Thông tin xác thực từ Spring Security
     * @return Chuỗi JWT Token đã được ký
     */
    public String generateJwtToken(Authentication authentication) {
        UserDetailsImpl userPrincipal = (UserDetailsImpl) authentication.getPrincipal();

        return Jwts.builder()
                .subject(userPrincipal.getUsername())
                .issuedAt(new Date())
                .expiration(new Date((new Date()).getTime() + jwtExpirationMs))
                .signWith(key())
                .compact();
    }

    private Key key() {
        return Keys.hmacShaKeyFor(Decoders.BASE64.decode(jwtSecret));
    }

    /**
     * Trích xuất tên đăng nhập (email/username) từ chuỗi JWT token.
     * @param token Chuỗi JWT cần giải mã
     * @return Tên đăng nhập của người dùng
     */
    public String getUserNameFromJwtToken(String token) {
        return Jwts.parser().verifyWith((javax.crypto.SecretKey) key()).build()
                .parseSignedClaims(token).getPayload().getSubject();
    }

    /**
     * Kiểm tra tính hợp lệ của JWT token (chưa hết hạn, chữ ký đúng, v.v.).
     * @param authToken Chuỗi JWT token cần kiểm tra
     * @return true nếu hợp lệ, false nếu không hợp lệ
     */
    public boolean validateJwtToken(String authToken) {
        try {
            Jwts.parser().verifyWith((javax.crypto.SecretKey) key()).build().parseSignedClaims(authToken);
            return true;
        } catch (JwtException e) {
            System.err.println("Invalid JWT token: " + e.getMessage());
        }
        return false;
    }
}
