package com.metro.vigo.backend.station;

import jakarta.persistence.*;

@Entity
@Table(name = "stations", indexes = {
        @Index(name = "idx_stations_name", columnList = "name")
})
public class Station {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String name;

    private Double lat;
    private Double lon;

    @Column(nullable = false)
    private boolean accessible;

    // NEW: facilities
    @Column(nullable = false)
    private boolean hasElevator;

    @Column(nullable = false)
    private boolean hasToilets;

    @Column(nullable = false)
    private boolean hasInfoPoint;

    @Column(nullable = false)
    private boolean hasEBikes;

    @Column(nullable = false)
    private boolean hasBikeParking;

    // Optional note (short, human readable)
    @Column(length = 240)
    private String accessibilityNote;

    protected Station() {}

    public Station(String name, Double lat, Double lon, boolean accessible) {
        this.name = name;
        this.lat = lat;
        this.lon = lon;
        this.accessible = accessible;

        // defaults (safe)
        this.hasElevator = false;
        this.hasToilets = false;
        this.hasInfoPoint = false;
        this.hasEBikes = false;
        this.hasBikeParking = false;
        this.accessibilityNote = null;
    }

    public Long getId() { return id; }
    public String getName() { return name; }
    public Double getLat() { return lat; }
    public Double getLon() { return lon; }
    public boolean isAccessible() { return accessible; }

    public boolean isHasElevator() { return hasElevator; }
    public boolean isHasToilets() { return hasToilets; }
    public boolean isHasInfoPoint() { return hasInfoPoint; }
    public boolean isHasEBikes() { return hasEBikes; }
    public boolean isHasBikeParking() { return hasBikeParking; }
    public String getAccessibilityNote() { return accessibilityNote; }

    // Setters (you can add Lombok instead if you want)
    public void setHasElevator(boolean hasElevator) { this.hasElevator = hasElevator; }
    public void setHasToilets(boolean hasToilets) { this.hasToilets = hasToilets; }
    public void setHasInfoPoint(boolean hasInfoPoint) { this.hasInfoPoint = hasInfoPoint; }
    public void setHasEBikes(boolean hasEBikes) { this.hasEBikes = hasEBikes; }
    public void setHasBikeParking(boolean hasBikeParking) { this.hasBikeParking = hasBikeParking; }
    public void setAccessibilityNote(String accessibilityNote) { this.accessibilityNote = accessibilityNote; }
}
