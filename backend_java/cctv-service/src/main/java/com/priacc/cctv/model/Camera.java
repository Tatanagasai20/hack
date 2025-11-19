package com.priacc.cctv.model;

import jakarta.persistence.*;
import java.time.Instant;

@Entity
@Table(name = "cameras")
public class Camera {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String name;
    private String location;
    private String status; // online, offline, maintenance
    private String streamUrl;
    private java.time.Instant lastUpdated;

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public String getName() { return this.name; }
    public void setName(String name) { this.name = name; }
    
    public String getLocation() { return this.location; }
    public void setLocation(String location) { this.location = location; }
    
    public String getStatus() { return this.status; }
    public void setStatus(String status) { this.status = status; }
    
    public String getStreamUrl() { return this.streamUrl; }
    public void setStreamUrl(String streamUrl) { this.streamUrl = streamUrl; }
    
    public java.time.Instant getLastUpdated() { return this.lastUpdated; }
    public void setLastUpdated(java.time.Instant lastUpdated) { this.lastUpdated = lastUpdated; }
}

