package com.metro.vigo.backend.arrival;

import com.metro.vigo.backend.api.dto.NextArrivalDto;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/stations")
public class ArrivalController {

    private final ArrivalService service;

    public ArrivalController(ArrivalService service) {
        this.service = service;
    }

    @GetMapping("/{id}/arrivals")
    public List<NextArrivalDto> arrivals(@PathVariable Long id) {
        return service.nextArrivalsForStation(id);
    }
}
