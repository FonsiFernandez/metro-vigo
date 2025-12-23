package com.metro.vigo.backend.api.dto;

public record NextArrivalDto(
        Long lineId,
        String lineCode,
        String direction,
        int minutes
) {}
