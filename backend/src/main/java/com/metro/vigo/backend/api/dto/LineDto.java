package com.metro.vigo.backend.api.dto;

public record LineDto(
        Long id,
        String code,
        String name,
        String colorHex,
        String status
) {}
