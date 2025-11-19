package com.priacc.cctv.controller;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.net.URI;
import java.util.List;
import com.priacc.cctv.model.Camera;
import com.priacc.cctv.service.CameraService;

@RestController
@RequestMapping("/cameras")
public class CameraController {
    private final CameraService service;
    public CameraController(CameraService service) { this.service = service; }

    @PostMapping
    public ResponseEntity<Camera> create(@RequestBody Camera dto) {
        Camera created = service.create(dto);
        return ResponseEntity.created(URI.create("/api/cameras/" + created.getId())).body(created);
    }
    
    @GetMapping
    public String test(@RequestHeader(value = "X-Username", required = false) String username) {
        return "Hello " + username + ", cameras data retrieved!";
    }

    @GetMapping("/list")
    public ResponseEntity<List<Camera>> list() {
        return ResponseEntity.ok(service.list());
    }

    @GetMapping("/{id}")
    public ResponseEntity<Camera> get(@PathVariable Long id) {
        return service.get(id).map(ResponseEntity::ok).orElse(ResponseEntity.notFound().build());
    }

    @PutMapping("/{id}")
    public ResponseEntity<Camera> update(@PathVariable Long id, @RequestBody Camera up) {
        up.setId(id);
        return ResponseEntity.ok(service.update(up));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable Long id) {
        service.delete(id);
        return ResponseEntity.noContent().build();
    }
}

