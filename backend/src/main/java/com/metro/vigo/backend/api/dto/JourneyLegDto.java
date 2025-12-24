package com.metro.vigo.backend.api.dto;

public record JourneyLegDto(
        String type,        // WALK | METRO
        String lineCode,    // only METRO
        String fromName,
        String toName,
        int durationMin,    // ride or walk duration (without waiting)
        String direction,   // only METRO
        Integer stops,      // only METRO
        Integer waitMin     // only METRO (or transfer)
) {}
