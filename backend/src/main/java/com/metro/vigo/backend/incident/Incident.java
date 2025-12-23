package com.metro.vigo.backend.incident;

import com.metro.vigo.backend.line.Line;
import com.metro.vigo.backend.station.Station;
import jakarta.persistence.*;

import java.time.Instant;

@Entity
@Table(name = "incidents", indexes = {
        @Index(name = "idx_incidents_active", columnList = "active"),
        @Index(name = "idx_incidents_created", columnList = "createdAt")
})
public class Incident {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private IncidentSeverity severity;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private IncidentScope scope;

    @Column(nullable = false, length = 160)
    private String title;

    @Column(nullable = false, length = 800)
    private String message;

    @Column(nullable = false)
    private boolean active;

    @Column(nullable = false)
    private Instant createdAt;

    private Instant updatedAt;

    // Optional associations
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "line_id")
    private Line line;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "station_id")
    private Station station;

    protected Incident() {}

    public Incident(IncidentSeverity severity, IncidentScope scope, String title, String message, boolean active, Line line, Station station) {
        this.severity = severity;
        this.scope = scope;
        this.title = title;
        this.message = message;
        this.active = active;
        this.createdAt = Instant.now();
        this.updatedAt = this.createdAt;
        this.line = line;
        this.station = station;
    }

    public Long getId() { return id; }
    public IncidentSeverity getSeverity() { return severity; }
    public IncidentScope getScope() { return scope; }
    public String getTitle() { return title; }
    public String getMessage() { return message; }
    public boolean isActive() { return active; }
    public Instant getCreatedAt() { return createdAt; }
    public Instant getUpdatedAt() { return updatedAt; }
    public Line getLine() { return line; }
    public Station getStation() { return station; }
}
