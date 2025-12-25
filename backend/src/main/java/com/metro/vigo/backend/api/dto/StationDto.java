package com.metro.vigo.backend.api.dto;

public record StationDto(
        Long id,
        String name,
        Double lat,
        Double lon,

        boolean accessible,
        boolean hasElevator,
        boolean hasToilets,
        boolean hasInfoPoint,
        boolean hasEBikes,
        boolean hasBikeParking,

        String accessibilityNote
) {}
