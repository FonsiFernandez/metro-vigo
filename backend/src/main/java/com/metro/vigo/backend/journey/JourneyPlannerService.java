package com.metro.vigo.backend.journey;

import com.metro.vigo.backend.api.dto.JourneyLegDto;
import com.metro.vigo.backend.api.dto.JourneyPlanDto;
import com.metro.vigo.backend.api.dto.LineDetailDto;
import com.metro.vigo.backend.api.Mapper;
import com.metro.vigo.backend.api.NotFoundException;
import com.metro.vigo.backend.line.Line;
import com.metro.vigo.backend.line.LineRepository;
import com.metro.vigo.backend.station.Station;
import com.metro.vigo.backend.station.StationRepository;
import org.springframework.stereotype.Service;
import com.metro.vigo.backend.network.LineStationRepository;
import com.metro.vigo.backend.api.dto.StationDto;
import com.metro.vigo.backend.network.LineStation;


import java.time.Instant;
import java.util.*;

@Service
public class JourneyPlannerService {

  private final StationRepository stationRepository;
  private final LineRepository lineRepository;
  private final LineStationRepository lineStationRepository;


  public JourneyPlannerService(
          StationRepository stationRepository,
          LineRepository lineRepository,
          LineStationRepository lineStationRepository
  ) {
    this.stationRepository = stationRepository;
    this.lineRepository = lineRepository;
    this.lineStationRepository = lineStationRepository;
  }


  /** Backwards compatible */
  public JourneyPlanDto plan(long fromId, long toId) {
    return plan(fromId, toId, Instant.now());
  }

  /** New: deterministic waits based on time */
  public JourneyPlanDto plan(long fromId, long toId, Instant when) {
    if (fromId == toId) {
      return new JourneyPlanDto(0, 0, List.of());
    }

    Station from = stationRepository.findById(fromId)
            .orElseThrow(() -> new NotFoundException("From station not found: " + fromId));
    Station to = stationRepository.findById(toId)
            .orElseThrow(() -> new NotFoundException("To station not found: " + toId));

    List<Line> lines = lineRepository.findAll();
    List<LineDetailDto> details = lines.stream().map(this::toDetailDto).toList();

    // 1) Direct line
    for (LineDetailDto line : details) {
      int a = indexOf(line, fromId);
      int b = indexOf(line, toId);
      if (a != -1 && b != -1) {
        return direct(from, to, line, a, b, when);
      }
    }

    // 2) One transfer
    for (LineDetailDto l1 : details) {
      int a = indexOf(l1, fromId);
      if (a == -1) continue;

      for (LineDetailDto l2 : details) {
        if (Objects.equals(l2.id(), l1.id())) continue;

        int b = indexOf(l2, toId);
        if (b == -1) continue;

        Long interchangeId = findInterchange(l1, l2);
        if (interchangeId == null) continue;

        Station x = stationRepository.findById(interchangeId)
                .orElseThrow(() -> new NotFoundException("Interchange station not found: " + interchangeId));

        int ax = indexOf(l1, interchangeId);
        int xb = indexOf(l2, interchangeId);
        if (ax == -1 || xb == -1) continue;

        return oneTransfer(from, x, to, l1, l2, a, ax, xb, b, when);
      }
    }

    // No route
    throw new NotFoundException("No route found from " + from.getName() + " to " + to.getName());
  }

  private int indexOf(LineDetailDto line, long stationId) {
    for (int i = 0; i < line.stations().size(); i++) {
      if (Objects.equals(line.stations().get(i).id(), stationId)) return i;
    }
    return -1;
  }

  private Long findInterchange(LineDetailDto a, LineDetailDto b) {
    Set<Long> ids = new HashSet<>();
    a.stations().forEach(s -> ids.add(s.id()));
    for (var s : b.stations()) {
      if (ids.contains(s.id())) return s.id();
    }
    return null;
  }

  private JourneyPlanDto direct(Station from, Station to, LineDetailDto line, int fromIdx, int toIdx, Instant when) {
    int walk1 = 3, walk2 = 2;

    int stops = Math.abs(toIdx - fromIdx);
    int ride = estimateRideMinutes(stops);

    // Wait depends on line frequency + time (stable per-minute)
    int wait = estimateWaitMinutes(line.code(), from.getId(), to.getId(), when);

    String direction = (toIdx > fromIdx)
            ? line.stations().get(line.stations().size() - 1).name()
            : line.stations().get(0).name();

    var legs = List.of(
            new JourneyLegDto("WALK", null, "Street", from.getName(), walk1, null, null, null),
            new JourneyLegDto("METRO", line.code(), from.getName(), to.getName(), ride, direction, stops, wait),
            new JourneyLegDto("WALK", null, to.getName(), "Street", walk2, null, null, null)
    );

    int total = walk1 + wait + ride + walk2;
    return new JourneyPlanDto(total, 0, legs);
  }

  private JourneyPlanDto oneTransfer(
          Station from, Station x, Station to,
          LineDetailDto l1, LineDetailDto l2,
          int fromIdx, int xOnL1, int xOnL2, int toIdx,
          Instant when
  ) {
    int walk1 = 3, walk2 = 2;

    int stops1 = Math.abs(xOnL1 - fromIdx);
    int stops2 = Math.abs(toIdx - xOnL2);

    int ride1 = estimateRideMinutes(stops1);
    int ride2 = estimateRideMinutes(stops2);

    int wait1 = estimateWaitMinutes(l1.code(), from.getId(), x.getId(), when);
    // Transfer time: interchange walking + second-platform wait
    int transferWalk = 3;
    int wait2 = estimateWaitMinutes(l2.code(), x.getId(), to.getId(), when.plusSeconds((walk1 + wait1 + ride1 + transferWalk) * 60L));

    String dir1 = (xOnL1 > fromIdx)
            ? l1.stations().get(l1.stations().size() - 1).name()
            : l1.stations().get(0).name();

    String dir2 = (toIdx > xOnL2)
            ? l2.stations().get(l2.stations().size() - 1).name()
            : l2.stations().get(0).name();

    var legs = List.of(
            new JourneyLegDto("WALK", null, "Street", from.getName(), walk1, null, null, null),
            new JourneyLegDto("METRO", l1.code(), from.getName(), x.getName(), ride1, dir1, stops1, wait1),
            new JourneyLegDto("WALK", null, x.getName(), x.getName() + " (transfer)", transferWalk, null, null, null),
            new JourneyLegDto("METRO", l2.code(), x.getName(), to.getName(), ride2, dir2, stops2, wait2),
            new JourneyLegDto("WALK", null, to.getName(), "Street", walk2, null, null, null)
    );

    int total = walk1 + wait1 + ride1 + transferWalk + wait2 + ride2 + walk2;
    return new JourneyPlanDto(total, 1, legs);
  }

  /** Ride time per stop: dwell + travel. */
  private int estimateRideMinutes(int stops) {
    if (stops <= 0) return 2;
    // ~2 min for first hop, then ~2–3 min per additional stop
    return Math.max(2, 2 + (stops * 2));
  }

  /** Frequency model + stable per-minute randomness */
  private int estimateWaitMinutes(String lineCode, long fromStationId, long toStationId, Instant when) {
    int freq = switch (lineCode) {
      case "M7", "M8" -> 15; // express/special
      default -> 6;          // city lines
    };

    long minuteBucket = when.getEpochSecond() / 60;
    long seed = minuteBucket
            ^ (fromStationId * 31L)
            ^ (toStationId * 17L)
            ^ (lineCode.hashCode() * 13L);

    Random r = new Random(seed);
    // Wait between 0..(freq-1), but at least 1 min to feel realistic
    return Math.max(1, r.nextInt(freq));
  }

  private LineDetailDto toDetailDto(Line line) {
    var links = lineStationRepository.findByLineIdWithStationsOrdered(line.getId());

    var stations = links.stream()
            .map(ls -> ls.getStation())
            .map(Mapper::toStationDto)
            .toList();

    // OJO: esta firma debe coincidir con tu LineDetailDto record.
    // Si tu LineDetailDto incluye otros campos, dímelo y lo ajusto.
    return new LineDetailDto(
            line.getId(),
            line.getCode(),
            line.getName(),
            line.getColorHex(),
            line.getStatus(),
            stations
    );
  }
}
