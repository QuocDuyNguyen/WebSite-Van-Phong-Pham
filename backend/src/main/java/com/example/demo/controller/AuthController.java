package com.example.demo.controller;

import com.example.demo.dto.JwtResponse;
import com.example.demo.dto.LoginRequest;
import com.example.demo.dto.MessageResponse;
import com.example.demo.dto.SignupRequest;
import com.example.demo.entity.User;
import com.example.demo.repository.UserRepository;
import com.example.demo.security.JwtUtils;
import com.example.demo.security.UserDetailsImpl;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;

/**
 * Controller xử lý các chức năng xác thực (Authentication).
 * Bao gồm Đăng nhập, Đăng ký, Lấy thông tin cá nhân và Cập nhật hồ sơ.
 */
@CrossOrigin(origins = "*", maxAge = 3600)
@RestController
@RequestMapping("/api/auth")
public class AuthController {
    @Autowired
    AuthenticationManager authenticationManager;

    @Autowired
    UserRepository userRepository;

    @Autowired
    PasswordEncoder encoder;

    @Autowired
    JwtUtils jwtUtils;

    /**
     * Xử lý yêu cầu đăng nhập của người dùng.
     * Kiểm tra thông tin, tạo và trả về chuỗi JWT token cùng thông tin cơ bản.
     * @param loginRequest Dữ liệu đăng nhập (email, password)
     * @return JWT Token và thông tin User
     */
    @PostMapping("/login")
    public ResponseEntity<?> authenticateUser(@Valid @RequestBody LoginRequest loginRequest) {
        Authentication authentication = authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(loginRequest.getEmail(), loginRequest.getPassword()));

        SecurityContextHolder.getContext().setAuthentication(authentication);
        String jwt = jwtUtils.generateJwtToken(authentication);
        
        UserDetailsImpl userDetails = (UserDetailsImpl) authentication.getPrincipal();    
        User user = userRepository.findByEmail(userDetails.getUsername()).orElse(null);
        String fullName = user != null ? user.getFullName() : "";

        return ResponseEntity.ok(new JwtResponse(jwt, 
                                                 new JwtResponse.UserDto(userDetails.getId(), 
                                                                         userDetails.getUsername(), 
                                                                         fullName,
                                                                         user != null ? user.getRole() : "user")));
    }

    /**
     * Xử lý yêu cầu đăng ký tài khoản mới.
     * Kiểm tra email trùng lặp, mã hóa mật khẩu, lưu vào cơ sở dữ liệu và tự động đăng nhập.
     * @param signUpRequest Dữ liệu đăng ký (họ tên, email, password)
     * @return JWT Token và thông tin User vừa đăng ký
     */
    @PostMapping("/register")
    public ResponseEntity<?> registerUser(@Valid @RequestBody SignupRequest signUpRequest) {
        if (userRepository.existsByEmail(signUpRequest.getEmail())) {
            return ResponseEntity
                    .badRequest()
                    .body(new MessageResponse("Error: Email is already in use!"));
        }

        User user = new User();
        user.setFullName(signUpRequest.getFullName());
        user.setEmail(signUpRequest.getEmail());
        user.setPasswordHash(encoder.encode(signUpRequest.getPassword()));

        userRepository.save(user);

        Authentication authentication = authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(signUpRequest.getEmail(), signUpRequest.getPassword()));
        SecurityContextHolder.getContext().setAuthentication(authentication);
        String jwt = jwtUtils.generateJwtToken(authentication);

        return ResponseEntity.ok(new JwtResponse(jwt, 
                                                 new JwtResponse.UserDto(user.getId(), 
                                                                         user.getEmail(), 
                                                                         user.getFullName(),
                                                                         user.getRole())));
    }
    
    /**
     * API tiện ích để cấp quyền Admin cho một tài khoản (Dành cho mục đích thiết lập ban đầu).
     * @param email Email của tài khoản cần cấp quyền
     * @return Thông báo thành công hoặc lỗi
     */
    @GetMapping("/make-admin")
    public ResponseEntity<?> makeAdmin(@RequestParam String email) {
        User user = userRepository.findByEmail(email).orElse(null);
        if (user != null) {
            user.setRole("admin");
            userRepository.save(user);
            return ResponseEntity.ok(new MessageResponse("User " + email + " is now an admin!"));
        }
        return ResponseEntity.badRequest().body(new MessageResponse("User not found"));
    }
    
    /**
     * Lấy thông tin của người dùng hiện tại đang đăng nhập (dựa trên JWT Token).
     * @param authentication Thông tin xác thực từ Spring Security Context
     * @return Thông tin người dùng hoặc lỗi 401 nếu chưa đăng nhập
     */
    @GetMapping("/me")
    public ResponseEntity<?> getMe(Authentication authentication) {
        if (authentication == null) {
            return ResponseEntity.status(401).body(new MessageResponse("Unauthorized"));
        }
        UserDetailsImpl userDetails = (UserDetailsImpl) authentication.getPrincipal();
        User user = userRepository.findByEmail(userDetails.getUsername()).orElse(null);
        if (user == null) {
            return ResponseEntity.status(404).body(new MessageResponse("User not found"));
        }
        return ResponseEntity.ok(user);
    }

    @lombok.Data
    public static class ProfileUpdateRequest {
        private String fullName;
        private String password;
    }

    /**
     * Cập nhật thông tin hồ sơ của người dùng hiện tại (Tên, Mật khẩu).
     * @param request Dữ liệu cập nhật
     * @param authentication Thông tin xác thực để xác định user nào đang sửa
     * @return Thông báo thành công
     */
    @PutMapping("/profile")
    public ResponseEntity<?> updateProfile(@RequestBody ProfileUpdateRequest request, Authentication authentication) {
        UserDetailsImpl userDetails = (UserDetailsImpl) authentication.getPrincipal();
        User user = userRepository.findById(userDetails.getId()).orElse(null);
        if (user != null) {
            if (request.getFullName() != null && !request.getFullName().isEmpty()) {
                user.setFullName(request.getFullName());
            }
            if (request.getPassword() != null && !request.getPassword().isEmpty()) {
                user.setPasswordHash(encoder.encode(request.getPassword()));
            }
            userRepository.save(user);
            return ResponseEntity.ok(new MessageResponse("Profile updated successfully"));
        }
        return ResponseEntity.badRequest().body(new MessageResponse("User not found"));
    }
}
