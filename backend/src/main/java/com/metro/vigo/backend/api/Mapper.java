package com.metro.vigo.backend.api;

import com.metro.vigo.backend.api.dto.LineDto;
import com.metro.vigo.backend.api.dto.StationDto;
import com.metro.vigo.backend.line.Line;
import com.metro.vigo.backend.station.Station;
import com.metro.vigo.backend.api.dto.IncidentDto;
import com.metro.vigo.backend.incident.Incident;

public class Mapper {

    public static LineDto toLineDto(Line l) {
        return new LineDto(l.getId(), l.getCode(), l.getName(), l.getColorHex(), l.getStatus());
    }

    public static StationDto toStationDto(Station s) {
        return new StationDto(
                s.getId(),
                s.getName(),
                s.getLat(),
                s.getLon(),
                s.isAccessible(),
                s.isHasElevator(),
                s.isHasToilets(),
                s.isHasInfoPoint(),
                s.isHasEBikes(),
                s.isHasBikeParking(),
                s.getAccessibilityNote()
        );
    }

    public static IncidentDto toIncidentDto(Incident i) {
        var line = i.getLine();
        var station = i.getStation();
        return new IncidentDto(
                i.getId(),
                i.getSeverity().name(),
                i.getScope().name(),
                i.getTitle(),
                i.getMessage(),
                i.isActive(),
                i.getCreatedAt(),
                line != null ? line.getId() : null,
                line != null ? line.getCode() : null,
                station != null ? station.getId() : null,
                station != null ? station.getName() : null
        );
    }
}
