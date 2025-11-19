package com.priacc.traffic.model;

import jakarta.persistence.*;
import java.time.Instant;

@Entity
@Table(name = "incidents")
public class Incident {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String location;
    private String description;
    private String severity;
    private String status;

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public String getLocation() { return this.location; }
    public void setLocation(String location) { this.location = location; }
    public String getDescription() { return this.description; }
    public void setDescription(String description) { this.description = description; }
    public String getSeverity() { return this.severity; }
    public void setSeverity(String severity) { this.severity = severity; }
    public String getStatus() { return this.status; }
    public void setStatus(String status) { this.status = status; }
}
