package com.metro.vigo.backend.network;

import com.metro.vigo.backend.line.Line;
import com.metro.vigo.backend.station.Station;
import jakarta.persistence.*;

@Entity
@Table(name = "line_stations",
        uniqueConstraints = @UniqueConstraint(name = "uq_line_station", columnNames = {"line_id", "station_id"}),
        indexes = {
                @Index(name = "idx_line_stations_line_pos", columnList = "line_id, position")
        })
public class LineStation {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(optional = false, fetch = FetchType.LAZY)
    @JoinColumn(name = "line_id")
    private Line line;

    @ManyToOne(optional = false, fetch = FetchType.LAZY)
    @JoinColumn(name = "station_id")
    private Station station;

    @Column(nullable = false)
    private int position;

    protected LineStation() {}

    public LineStation(Line line, Station station, int position) {
        this.line = line;
        this.station = station;
        this.position = position;
    }

    public Long getId() { return id; }
    public Line getLine() { return line; }
    public Station getStation() { return station; }
    public int getPosition() { return position; }
}
