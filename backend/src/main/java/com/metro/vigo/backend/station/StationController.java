package com.metro.vigo.backend.station;

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
    public List<Station> search(@RequestParam(name = "query", required = false) String query) {
        if (query == null || query.trim().isEmpty()) {
            return repo.findTop20ByOrderByNameAsc();
        }
        return repo.findTop10ByNameContainingIgnoreCaseOrderByNameAsc(query.trim());
    }
}
