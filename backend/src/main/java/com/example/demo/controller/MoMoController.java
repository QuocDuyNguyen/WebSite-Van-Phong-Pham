package com.example.demo.controller;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.math.BigDecimal;
import java.util.HashMap;
import java.util.Map;
import java.util.UUID;

/**
 * Controller xử lý thanh toán qua cổng Ví MoMo (MoMo Payment Gateway API v2 - QR Code / Collection Link).
 * Phỏng theo chuẩn quy trình MoMo API v2: Create Order -> Trả về qrCodeUrl & payUrl -> Callback/IPN.
 */
@CrossOrigin(origins = "*", maxAge = 3600)
@RestController
@RequestMapping("/api/payment/momo")
public class MoMoController {

    /**
     * API Tạo giao dịch thanh toán MoMo (Mã QR & Link thanh toán).
     * Nhận tổng tiền (USD hoặc VND) và thông tin đơn hàng, trả về payload MoMo bao gồm qrCodeUrl.
     */
    @PostMapping("/create-order")
    public ResponseEntity<Map<String, Object>> createMoMoOrder(@RequestBody Map<String, Object> requestBody) {
        // Lấy số tiền từ request
        Object amountObj = requestBody.get("amount");
        BigDecimal amountUsd = BigDecimal.ZERO;
        if (amountObj instanceof Number) {
            amountUsd = new BigDecimal(((Number) amountObj).toString());
        } else if (amountObj instanceof String) {
            amountUsd = new BigDecimal((String) amountObj);
        }

        // Quy đổi sang VND (Tỷ giá tham khảo 1 USD = 25,400 VND) cho chuẩn Ví MoMo Việt Nam
        long amountVnd = amountUsd.multiply(new BigDecimal("25400")).longValue();
        if (amountVnd <= 0) amountVnd = 50000; // Giá trị tối thiểu

        String orderId = "MOMO_" + System.currentTimeMillis();
        String requestId = UUID.randomUUID().toString();
        String orderInfo = "Thanh toan don hang The Atelier #" + orderId;
        String returnUrl = "http://localhost:5173/profile?status=success&payment=momo";
        String notifyUrl = "http://localhost:8080/api/payment/momo/ipn";

        // Tạo dữ liệu QR Code nội dung chuẩn MoMo DeepLink / QR string
        String qrData = String.format("2|99|0961234567|THE ATELIER|@%s|0|0|%d", orderId, amountVnd);
        String qrCodeUrl = "https://api.qrserver.com/v1/create-qr-code/?size=300x300&margin=10&data=" + java.net.URLEncoder.encode(qrData, java.nio.charset.StandardCharsets.UTF_8);

        Map<String, Object> response = new HashMap<>();
        response.put("partnerCode", "MOMO");
        response.put("orderId", orderId);
        response.put("requestId", requestId);
        response.put("amount", amountVnd);
        response.put("amountUsd", amountUsd);
        response.put("orderInfo", orderInfo);
        response.put("redirectUrl", returnUrl);
        response.put("ipnUrl", notifyUrl);
        response.put("payUrl", qrCodeUrl);
        response.put("qrCodeUrl", qrCodeUrl);
        response.put("resultCode", 0);
        response.put("message", "Tạo giao dịch thanh toán MoMo thành công.");

        return ResponseEntity.ok(response);
    }

    /**
     * API Webhook / IPN xử lý phản hồi từ MoMo khi khách hàng quét mã thanh toán thành công.
     */
    @PostMapping("/ipn")
    public ResponseEntity<Map<String, Object>> momoIpnCallback(@RequestBody Map<String, Object> ipnData) {
        System.out.println("MoMo IPN Callback received: " + ipnData);
        Map<String, Object> result = new HashMap<>();
        result.put("resultCode", 0);
        result.put("message", "Confirm IPN success");
        return ResponseEntity.ok(result);
    }
}
