package com.priacc.traffic.controller;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/predictions")
public class PredictionController {
    
    @PostMapping
    public ResponseEntity<?> receivePredictions(@RequestBody List<Map<String, Object>> predictions) {
        try {
            // Store predictions or process them
            // For now, just acknowledge receipt
            return ResponseEntity.ok(Map.of(
                "message", "Predictions received successfully",
                "count", predictions.size()
            ));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(Map.of("error", e.getMessage()));
        }
    }
    
    @GetMapping
    public ResponseEntity<?> getPredictions(@RequestHeader(value = "X-Username", required = false) String username) {
        // Return recent predictions
        // For now, return empty list - can be extended to fetch from DB
        return ResponseEntity.ok(List.of());
    }
}



