package com.priacc.alert.service;

import org.springframework.stereotype.Service;
import java.util.List;
import java.util.Optional;
import com.priacc.alert.model.Alert;
import com.priacc.alert.repo.AlertRepository;

@Service
public class AlertService {
    private final AlertRepository repo;
    public AlertService(AlertRepository repo) { this.repo = repo; }

    public Alert create(Alert e) { return repo.save(e); }
    public List<Alert> list() { return repo.findAll(); }
    public Optional<Alert> get(Long id) { return repo.findById(id); }
    public Alert update(Alert e) { return repo.save(e); }
    public void delete(Long id) { repo.deleteById(id); }
}
