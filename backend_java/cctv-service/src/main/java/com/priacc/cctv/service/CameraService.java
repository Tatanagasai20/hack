package com.priacc.cctv.service;

import org.springframework.stereotype.Service;
import java.util.List;
import java.util.Optional;
import com.priacc.cctv.model.Camera;
import com.priacc.cctv.repo.CameraRepository;

@Service
public class CameraService {
    private final CameraRepository repo;
    public CameraService(CameraRepository repo) { this.repo = repo; }

    public Camera create(Camera e) { return repo.save(e); }
    public List<Camera> list() { return repo.findAll(); }
    public Optional<Camera> get(Long id) { return repo.findById(id); }
    public Camera update(Camera e) { return repo.save(e); }
    public void delete(Long id) { repo.deleteById(id); }
}

