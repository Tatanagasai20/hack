package com.priacc.traffic.controller;

import com.priacc.traffic.service.PredictionService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/predictions")
public class PredictionController {

    private final PredictionService predictionService;

    public PredictionController(PredictionService predictionService) {
        this.predictionService = predictionService;
    }

    @GetMapping
    public ResponseEntity<?> getPredictions(@RequestHeader(value = "X-Username", required = false) String username) {
        PredictionService.PredictionFetchResult result = predictionService.fetchLivePredictions();

        if (result.errorMessage() != null) {
            return ResponseEntity.status(HttpStatus.SERVICE_UNAVAILABLE).body(Map.of(
                    "error", result.errorMessage(),
                    "data", result.data()
            ));
        }

        return ResponseEntity.ok(result.data());
    }

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
}



