package com.priacc.power.model;

import jakarta.persistence.*;
import java.time.Instant;

@Entity
@Table(name = "sensors")
public class Sensor {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String type;
    private Double value;
    private String status;
    private java.time.Instant lastUpdated;

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public String getType() { return this.type; }
    public void setType(String type) { this.type = type; }
    public Double getValue() { return this.value; }
    public void setValue(Double value) { this.value = value; }
    public String getStatus() { return this.status; }
    public void setStatus(String status) { this.status = status; }
    public java.time.Instant getLastUpdated() { return this.lastUpdated; }
    public void setLastUpdated(java.time.Instant lastUpdated) { this.lastUpdated = lastUpdated; }
}
