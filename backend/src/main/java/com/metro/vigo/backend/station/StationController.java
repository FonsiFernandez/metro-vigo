package com.metro.vigo.backend.station;

import com.metro.vigo.backend.api.Mapper;
import com.metro.vigo.backend.api.dto.StationDto;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import com.metro.vigo.backend.api.dto.LineDto;
import com.metro.vigo.backend.network.LineStationRepository;
import java.util.stream.Collectors;


import java.util.List;

@RestController
@RequestMapping("/api/stations")
public class StationController {

    private final StationRepository repo;

    private final LineStationRepository lineStationRepo;

    public StationController(StationRepository repo, LineStationRepository lineStationRepo) {
        this.repo = repo;
        this.lineStationRepo = lineStationRepo;
    }

    @GetMapping
    public List<StationDto> search(@RequestParam(name = "query", required = false) String query) {
        var list = (query == null || query.trim().isEmpty())
                ? repo.findTop20ByOrderByNameAsc()
                : repo.findTop10ByNameContainingIgnoreCaseOrderByNameAsc(query.trim());
        return list.stream().map(Mapper::toStationDto).toList();
    }

    @GetMapping("/{id}")
    public ResponseEntity<StationDto> byId(@PathVariable Long id) {
        return repo.findById(id)
                .map(Mapper::toStationDto)
                .map(ResponseEntity::ok)
                .orElseGet(() -> ResponseEntity.notFound().build());
    }

    @GetMapping("/{id}/lines")
    public List<LineDto> linesServingStation(@PathVariable Long id) {
        // uses join fetch query you already have: findByStationIdWithLinesOrdered
        var list = lineStationRepo.findByStationIdWithLinesOrdered(id);

        // Deduplicate by line id (a station may appear once per line, but we keep it safe)
        var byId = list.stream()
                .map(ls -> ls.getLine())
                .collect(Collectors.toMap(
                        l -> l.getId(),
                        l -> l,
                        (a, b) -> a
                ));

        return byId.values().stream()
                .sorted((a, b) -> a.getCode().compareToIgnoreCase(b.getCode()))
                .map(l -> new LineDto(l.getId(), l.getCode(), l.getName(), l.getColorHex(), l.getStatus()))
                .toList();
    }
}
