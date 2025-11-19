package com.priacc.alert.model;

import jakarta.persistence.*;
import java.time.Instant;

@Entity
@Table(name = "alerts")
public class Alert {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String title;
    private String message;
    private String priority;
    private java.time.Instant timestamp;

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public String getTitle() { return this.title; }
    public void setTitle(String title) { this.title = title; }
    public String getMessage() { return this.message; }
    public void setMessage(String message) { this.message = message; }
    public String getPriority() { return this.priority; }
    public void setPriority(String priority) { this.priority = priority; }
    public java.time.Instant getTimestamp() { return this.timestamp; }
    public void setTimestamp(java.time.Instant timestamp) { this.timestamp = timestamp; }
}
