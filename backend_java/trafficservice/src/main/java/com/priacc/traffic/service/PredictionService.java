package com.priacc.traffic.service;

import java.util.ArrayList;
import java.util.Collections;
import java.util.List;
import java.util.Map;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.core.ParameterizedTypeReference;
import org.springframework.http.HttpMethod;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import org.springframework.util.StringUtils;
import org.springframework.web.client.RestTemplate;

@Service
public class PredictionService {

    private static final Logger LOGGER = LoggerFactory.getLogger(PredictionService.class);

    private final RestTemplate restTemplate;
    private final List<String> predictionBaseUrls;

    public PredictionService(
            RestTemplate restTemplate,
            @Value("${python.service.base-url:http://python_service:9000}") String primaryUrl,
            @Value("${python.service.fallback-url:http://localhost:9000}") String fallbackUrl) {

        this.restTemplate = restTemplate;
        this.predictionBaseUrls = buildUrlPriorityList(primaryUrl, fallbackUrl);
    }

    public PredictionFetchResult fetchLivePredictions() {
        ParameterizedTypeReference<List<Map<String, Object>>> typeRef =
                new ParameterizedTypeReference<>() {};

        for (String baseUrl : predictionBaseUrls) {
            String endpoint = normalizeBaseUrl(baseUrl) + "predictions";
            try {
                ResponseEntity<List<Map<String, Object>>> response =
                        restTemplate.exchange(endpoint, HttpMethod.GET, null, typeRef);

                if (response.getStatusCode().is2xxSuccessful() && response.getBody() != null) {
                    LOGGER.debug("Fetched {} predictions from {}", response.getBody().size(), endpoint);
                    return new PredictionFetchResult(response.getBody(), null);
                }
            } catch (Exception ex) {
                LOGGER.warn("Unable to reach Python prediction service at {}: {}", endpoint, ex.getMessage());
            }
        }

        return new PredictionFetchResult(Collections.emptyList(), "Python prediction service is not reachable");
    }

    private static List<String> buildUrlPriorityList(String primaryUrl, String fallbackUrl) {
        List<String> urls = new ArrayList<>();
        if (StringUtils.hasText(primaryUrl)) {
            urls.add(primaryUrl.trim());
        }
        if (StringUtils.hasText(fallbackUrl) && !fallbackUrl.equals(primaryUrl)) {
            urls.add(fallbackUrl.trim());
        }
        if (urls.isEmpty()) {
            urls.add("http://python_service:9000");
        }
        return urls;
    }

    private static String normalizeBaseUrl(String baseUrl) {
        if (baseUrl.endsWith("/")) {
            return baseUrl;
        }
        return baseUrl + "/";
    }

    public record PredictionFetchResult(List<Map<String, Object>> data, String errorMessage) {}
}


