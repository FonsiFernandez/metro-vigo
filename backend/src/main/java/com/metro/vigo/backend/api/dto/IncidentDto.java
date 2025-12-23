package com.metro.vigo.backend.api.dto;

import java.time.Instant;

public record IncidentDto(
        Long id,
        String severity,
        String scope,
        String title,
        String message,
        boolean active,
        Instant createdAt,
        Long lineId,
        String lineCode,
        Long stationId,
        String stationName
) {}
