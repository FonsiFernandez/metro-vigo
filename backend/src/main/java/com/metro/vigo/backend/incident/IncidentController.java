package com.metro.vigo.backend.incident;

import com.metro.vigo.backend.api.Mapper;
import com.metro.vigo.backend.api.dto.IncidentDto;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/incidents")
public class IncidentController {

    private final IncidentRepository repo;

    public IncidentController(IncidentRepository repo) {
        this.repo = repo;
    }

    // /api/incidents?lineId=1&stationId=2
    @GetMapping
    public List<IncidentDto> active(
            @RequestParam(name = "lineId", required = false) Long lineId,
            @RequestParam(name = "stationId", required = false) Long stationId
    ) {
        var list = (lineId == null && stationId == null)
                ? repo.findActiveWithRefs()
                : repo.findActiveFiltered(lineId, stationId);

        return list.stream().map(Mapper::toIncidentDto).toList();
    }

    @GetMapping("/active")
    public List<IncidentDto> activeAlias() {
        return repo.findActiveWithRefs().stream().map(Mapper::toIncidentDto).toList();
    }
}
