package com.priacc.power.service;

import org.springframework.stereotype.Service;
import java.util.List;
import java.util.Optional;
import com.priacc.power.model.Sensor;
import com.priacc.power.repo.SensorRepository;

@Service
public class SensorService {
    private final SensorRepository repo;
    public SensorService(SensorRepository repo) { this.repo = repo; }

    public Sensor create(Sensor e) { return repo.save(e); }
    public List<Sensor> list() { return repo.findAll(); }
    public Optional<Sensor> get(Long id) { return repo.findById(id); }
    public Sensor update(Sensor e) { return repo.save(e); }
    public void delete(Long id) { repo.deleteById(id); }
}
