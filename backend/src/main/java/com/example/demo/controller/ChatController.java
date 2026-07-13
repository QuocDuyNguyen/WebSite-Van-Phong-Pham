package com.example.demo.controller;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpEntity;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.client.RestTemplate;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

/**
 * Controller xử lý tính năng Chatbot AI.
 * Gửi yêu cầu từ người dùng lên Google Gemini API và trả về câu trả lời.
 */
@RestController
@RequestMapping("/api/chat")
public class ChatController {

    @Value("${gemini.api.key}")
    private String geminiApiKey;

    @Value("${gemini.api.url}")
    private String geminiApiUrl;

    private final RestTemplate restTemplate = new RestTemplate();

    /**
     * Nhận tin nhắn của người dùng, ghép thêm ngữ cảnh (prompt) và gửi lên Gemini API.
     * @param request Dữ liệu chứa tin nhắn ("message")
     * @return Câu trả lời từ AI
     */
    @PostMapping
    public ResponseEntity<?> chat(@RequestBody Map<String, String> request) {
        String userMessage = request.get("message");
        
        try {
            String url = geminiApiUrl + geminiApiKey;

            HttpHeaders headers = new HttpHeaders();
            headers.setContentType(MediaType.APPLICATION_JSON);

            // Construct Gemini Request Body
            // { "contents": [{ "parts":[{"text": "prompt"}] }] }
            Map<String, Object> textPart = new HashMap<>();
            
            // Add system prompt context
            String fullPrompt = "You are a helpful, professional, and friendly AI assistant for an online stationery store called 'The Atelier'. " +
                                "Answer the customer's question concisely. Question: " + userMessage;

            textPart.put("text", fullPrompt);

            Map<String, Object> partMap = new HashMap<>();
            partMap.put("parts", List.of(textPart));

            Map<String, Object> requestBody = new HashMap<>();
            requestBody.put("contents", List.of(partMap));

            HttpEntity<Map<String, Object>> entity = new HttpEntity<>(requestBody, headers);

            ResponseEntity<Map> response = restTemplate.postForEntity(url, entity, Map.class);
            
            // Extract reply
            Map<String, Object> responseBody = response.getBody();
            if (responseBody != null && responseBody.containsKey("candidates")) {
                List<Map<String, Object>> candidates = (List<Map<String, Object>>) responseBody.get("candidates");
                if (!candidates.isEmpty()) {
                    Map<String, Object> content = (Map<String, Object>) candidates.get(0).get("content");
                    List<Map<String, Object>> parts = (List<Map<String, Object>>) content.get("parts");
                    if (!parts.isEmpty()) {
                        String reply = (String) parts.get(0).get("text");
                        return ResponseEntity.ok(Map.of("reply", reply));
                    }
                }
            }
            return ResponseEntity.ok(Map.of("reply", "I'm sorry, I couldn't generate a response."));
            
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.ok(Map.of("reply", "Oops, I encountered an error connecting to the AI brain."));
        }
    }
}
