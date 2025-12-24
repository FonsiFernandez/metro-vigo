package com.metro.vigo.backend.journey;

import com.metro.vigo.backend.api.dto.JourneyPlanDto;
import org.springframework.web.bind.annotation.*;

import java.time.Instant;

@RestController
@RequestMapping("/api")
@CrossOrigin(origins = "http://localhost:5173")
public class JourneyController {

    private final JourneyPlannerService journeyPlannerService;

    public JourneyController(JourneyPlannerService journeyPlannerService) {
        this.journeyPlannerService = journeyPlannerService;
    }

    @GetMapping("/journey")
    public JourneyPlanDto plan(
            @RequestParam("from") long from,
            @RequestParam("to") long to,
            @RequestParam(value = "datetime", required = false) String datetime
    ) {
        Instant when = (datetime == null || datetime.isBlank())
                ? Instant.now()
                : Instant.parse(datetime);

        return journeyPlannerService.plan(from, to, when);
    }
}
