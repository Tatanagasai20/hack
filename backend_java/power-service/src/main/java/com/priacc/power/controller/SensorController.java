package com.priacc.power.controller;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.net.URI;
import java.util.List;
import com.priacc.power.model.Sensor;
import com.priacc.power.service.SensorService;

@RestController
@RequestMapping("/sensors")
public class SensorController {

    private final SensorService service;
    public SensorController(SensorService service) { this.service = service; }

    // ✅ Test endpoint
    @GetMapping
    public String test(@RequestHeader(value = "X-Username", required = false) String username) {
        return "Hello " + username + ", sensors data retrieved!";
    }

    @PostMapping
    public ResponseEntity<Sensor> create(@RequestBody Sensor dto) {
        Sensor created = service.create(dto);
        return ResponseEntity.created(URI.create("/api/sensors/" + created.getId())).body(created);
    }

    @GetMapping("/list")
    public ResponseEntity<List<Sensor>> list() {
        return ResponseEntity.ok(service.list());
    }

    @GetMapping("/{id}")
    public ResponseEntity<Sensor> get(@PathVariable Long id) {
        return service.get(id).map(ResponseEntity::ok).orElse(ResponseEntity.notFound().build());
    }

    @PutMapping("/{id}")
    public ResponseEntity<Sensor> update(@PathVariable Long id, @RequestBody Sensor up) {
        up.setId(id);
        return ResponseEntity.ok(service.update(up));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable Long id) {
        service.delete(id);
        return ResponseEntity.noContent().build();
    }
}
