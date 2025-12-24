package com.metro.vigo.backend.api.dto;

import java.util.List;

public record JourneyPlanDto(
        int totalDurationMin,
        int transfers,
        List<JourneyLegDto> legs
) {}
