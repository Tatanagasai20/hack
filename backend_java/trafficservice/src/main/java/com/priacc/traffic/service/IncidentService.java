package com.priacc.traffic.service;

import org.springframework.stereotype.Service;
import java.util.List;
import java.util.Optional;
import com.priacc.traffic.model.Incident;
import com.priacc.traffic.repo.IncidentRepository;

@Service
public class IncidentService {
    private final IncidentRepository repo;
    public IncidentService(IncidentRepository repo) { this.repo = repo; }

    public Incident create(Incident e) { return repo.save(e); }
    public List<Incident> list() { return repo.findAll(); }
    public Optional<Incident> get(Long id) { return repo.findById(id); }
    public Incident update(Incident e) { return repo.save(e); }
    public void delete(Long id) { repo.deleteById(id); }
}
