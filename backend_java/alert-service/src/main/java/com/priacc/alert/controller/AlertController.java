package com.priacc.alert.controller;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.net.URI;
import java.util.List;
import com.priacc.alert.model.Alert;
import com.priacc.alert.service.AlertService;

@RestController
@RequestMapping("/alerts")
public class AlertController {
    private final AlertService service;
    public AlertController(AlertService service) { this.service = service; }

    @PostMapping
    public ResponseEntity<Alert> create(@RequestBody Alert dto) {
        Alert created = service.create(dto);
        return ResponseEntity.created(URI.create("/api/alerts/" + created.getId())).body(created);
    }
    
    @GetMapping
    public String test(@RequestHeader(value = "X-Username", required = false) String username) {
        return "Hello " + username + ", alerts data retrieved!";
    }

    @GetMapping("/list")
    public ResponseEntity<List<Alert>> list() {
        return ResponseEntity.ok(service.list());
    }

    @GetMapping("/{id}")
    public ResponseEntity<Alert> get(@PathVariable Long id) {
        return service.get(id).map(ResponseEntity::ok).orElse(ResponseEntity.notFound().build());
    }

    @PutMapping("/{id}")
    public ResponseEntity<Alert> update(@PathVariable Long id, @RequestBody Alert up) {
        up.setId(id);
        return ResponseEntity.ok(service.update(up));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable Long id) {
        service.delete(id);
        return ResponseEntity.noContent().build();
    }
}
