package com.priacc.cctv.repo;

import org.springframework.data.jpa.repository.JpaRepository;
import com.priacc.cctv.model.Camera;

public interface CameraRepository extends JpaRepository<Camera, Long> {
}

