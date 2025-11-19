package com.priacc.traffic.repo;

import org.springframework.data.jpa.repository.JpaRepository;
import com.priacc.traffic.model.Incident;
public interface IncidentRepository extends JpaRepository<Incident, Long> {
}
