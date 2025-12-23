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

    // Optional geo info (nice for future map)
    private Double lat;
    private Double lon;

    @Column(nullable = false)
    private boolean accessible;

    protected Station() {}

    public Station(String name, Double lat, Double lon, boolean accessible) {
        this.name = name;
        this.lat = lat;
        this.lon = lon;
        this.accessible = accessible;
    }

    public Long getId() { return id; }
    public String getName() { return name; }
    public Double getLat() { return lat; }
    public Double getLon() { return lon; }
    public boolean isAccessible() { return accessible; }
}
