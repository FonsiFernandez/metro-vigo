package com.metro.vigo.backend.api;

import com.metro.vigo.backend.api.dto.LineDto;
import com.metro.vigo.backend.api.dto.StationDto;
import com.metro.vigo.backend.line.Line;
import com.metro.vigo.backend.station.Station;

public class Mapper {

    public static LineDto toLineDto(Line l) {
        return new LineDto(l.getId(), l.getCode(), l.getName(), l.getColorHex(), l.getStatus());
    }

    public static StationDto toStationDto(Station s) {
        return new StationDto(s.getId(), s.getName(), s.getLat(), s.getLon(), s.isAccessible());
    }
}
