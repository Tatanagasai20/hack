package com.priacc.power.repo;

import org.springframework.data.jpa.repository.JpaRepository;
import com.priacc.power.model.Sensor;
public interface SensorRepository extends JpaRepository<Sensor, Long> {
}
