package com.metro.vigo.backend.station;

import com.metro.vigo.backend.api.Mapper;
import com.metro.vigo.backend.api.dto.StationDto;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/stations")
public class StationController {

    private final StationRepository repo;

    public StationController(StationRepository repo) {
        this.repo = repo;
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
}
