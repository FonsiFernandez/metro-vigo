package com.metro.vigo.backend.arrival;

import com.metro.vigo.backend.api.dto.NextArrivalDto;
import com.metro.vigo.backend.incident.Incident;
import com.metro.vigo.backend.incident.IncidentSeverity;
import com.metro.vigo.backend.incident.IncidentRepository;
import com.metro.vigo.backend.line.Line;
import com.metro.vigo.backend.network.LineStationRepository;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;
import java.util.Random;

@Service
public class ArrivalService {

    private final LineStationRepository lineStationRepo;
    private final IncidentRepository incidentRepo;
    private final Random random = new Random();

    public ArrivalService(LineStationRepository lineStationRepo, IncidentRepository incidentRepo) {
        this.lineStationRepo = lineStationRepo;
        this.incidentRepo = incidentRepo;
    }

    public List<NextArrivalDto> nextArrivalsForStation(Long stationId) {
        var lineStations = lineStationRepo.findByStationIdWithLinesOrdered(stationId);
        var incidents = incidentRepo.findActiveWithRefs();

        List<NextArrivalDto> result = new ArrayList<>();

        for (var ls : lineStations) {
            Line line = ls.getLine();

            int baseFrequency = baseFrequencyMinutes(line.getCode());
            int minutes = random.nextInt(baseFrequency) + 1;

            // Apply delay if incident affects this line
            for (Incident i : incidents) {
                if (i.getLine() != null
                        && i.getLine().getId().equals(line.getId())
                        && i.getSeverity() != IncidentSeverity.INFO) {
                    minutes += delayForSeverity(i.getSeverity());
                }
            }

            result.add(new NextArrivalDto(
                    line.getId(),
                    line.getCode(),
                    line.getName(),
                    minutes
            ));
        }

        return result.stream()
                .sorted((a, b) -> Integer.compare(a.minutes(), b.minutes()))
                .toList();
    }

    private int baseFrequencyMinutes(String lineCode) {
        return switch (lineCode) {
            case "M7", "M8" -> 15; // express / special
            default -> 6;         // urban lines
        };
    }

    private int delayForSeverity(IncidentSeverity severity) {
        return switch (severity) {
            case MINOR -> 3;
            case MAJOR -> 6;
            case CRITICAL -> 12;
            default -> 0;
        };
    }
}
