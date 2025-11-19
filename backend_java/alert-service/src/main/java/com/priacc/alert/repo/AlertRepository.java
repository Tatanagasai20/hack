package com.priacc.alert.repo;

import org.springframework.data.jpa.repository.JpaRepository;
import com.priacc.alert.model.Alert;
public interface AlertRepository extends JpaRepository<Alert, Long> {
}
