package com.priacc.traffic.controller;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.net.URI;
import java.util.List;
import com.priacc.traffic.model.Incident;
import com.priacc.traffic.service.IncidentService;

@RestController
@RequestMapping("/incidents")
public class IncidentController {
    private final IncidentService service;
    public IncidentController(IncidentService service) { this.service = service; }

    @PostMapping
    public ResponseEntity<Incident> create(@RequestBody Incident dto) {
        Incident created = service.create(dto);
        return ResponseEntity.created(URI.create("/api/incidents/" + created.getId())).body(created);
    }
    
    @GetMapping
    public String test(@RequestHeader(value = "X-Username", required = false) String username) {
        return "Hello " + username + ", incidents data retrieved!";
    }

    @GetMapping("/list")
    public ResponseEntity<List<Incident>> list() {
        return ResponseEntity.ok(service.list());
    }

    @GetMapping("/{id}")
    public ResponseEntity<Incident> get(@PathVariable Long id) {
        return service.get(id).map(ResponseEntity::ok).orElse(ResponseEntity.notFound().build());
    }

    @PutMapping("/{id}")
    public ResponseEntity<Incident> update(@PathVariable Long id, @RequestBody Incident up) {
        up.setId(id);
        return ResponseEntity.ok(service.update(up));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable Long id) {
        service.delete(id);
        return ResponseEntity.noContent().build();
    }
}
