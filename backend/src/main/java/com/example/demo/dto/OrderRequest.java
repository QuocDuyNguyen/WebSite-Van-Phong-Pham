package com.example.demo.dto;

import com.fasterxml.jackson.annotation.JsonProperty;
import lombok.Data;
import java.math.BigDecimal;
import java.util.List;

@Data
public class OrderRequest {
    @JsonProperty("shipping_address")
    private String shippingAddress;

    @JsonProperty("payment_method")
    private String paymentMethod;

    @JsonProperty("payment_expiry")
    private String paymentExpiry;

    @JsonProperty("total_amount")
    private BigDecimal totalAmount;

    private List<OrderItemRequest> items;

    @Data
    public static class OrderItemRequest {
        @JsonProperty("product_id")
        private Long productId;

        private Integer quantity;

        @JsonProperty("unit_price")
        private BigDecimal unitPrice;
    }
}
