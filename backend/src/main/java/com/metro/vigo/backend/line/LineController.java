package com.metro.vigo.backend.line;

import com.metro.vigo.backend.api.Mapper;
import com.metro.vigo.backend.api.dto.LineDetailDto;
import com.metro.vigo.backend.api.dto.LineDto;
import com.metro.vigo.backend.network.LineStationRepository;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/lines")
public class LineController {

    private final LineRepository repo;
    private final LineStationRepository lineStationRepo;

    public LineController(LineRepository repo, LineStationRepository lineStationRepo) {
        this.repo = repo;
        this.lineStationRepo = lineStationRepo;
    }

    @GetMapping
    public List<LineDto> all() {
        return repo.findAll().stream().map(Mapper::toLineDto).toList();
    }

    @GetMapping("/{id}")
    public ResponseEntity<LineDetailDto> byId(@PathVariable Long id) {
        var lineOpt = repo.findById(id);
        if (lineOpt.isEmpty()) return ResponseEntity.notFound().build();

        var line = lineOpt.get();
        var stations = lineStationRepo.findByLineIdWithStationsOrdered(id)
                .stream()
                .map(ls -> Mapper.toStationDto(ls.getStation()))
                .toList();

        var dto = new LineDetailDto(
                line.getId(),
                line.getCode(),
                line.getName(),
                line.getColorHex(),
                line.getStatus(),
                stations
        );

        return ResponseEntity.ok(dto);
    }
}
