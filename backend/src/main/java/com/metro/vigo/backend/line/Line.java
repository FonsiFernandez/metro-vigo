package com.metro.vigo.backend.line;

import jakarta.persistence.*;

@Entity
@Table(name = "lines")
public class Line {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, unique = true)
    private String code; // M1, M2...

    @Column(nullable = false)
    private String name;

    @Column(nullable = false)
    private String colorHex; // "#00AEEF"

    @Column(nullable = false)
    private String status; // OK, DELAYED, DOWN

    protected Line() {}

    public Line(String code, String name, String colorHex, String status) {
        this.code = code;
        this.name = name;
        this.colorHex = colorHex;
        this.status = status;
    }

    public Long getId() { return id; }
    public String getCode() { return code; }
    public String getName() { return name; }
    public String getColorHex() { return colorHex; }
    public String getStatus() { return status; }

    public void setStatus(String status) { this.status = status; }
}
