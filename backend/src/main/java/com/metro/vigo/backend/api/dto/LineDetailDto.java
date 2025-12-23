package com.metro.vigo.backend.api.dto;

import java.util.List;

public record LineDetailDto(
        Long id,
        String code,
        String name,
        String colorHex,
        String status,
        List<StationDto> stations
) {}
