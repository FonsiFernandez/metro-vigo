package com.metro.vigo.backend;

import com.metro.vigo.backend.line.Line;
import com.metro.vigo.backend.line.LineRepository;
import com.metro.vigo.backend.network.LineStation;
import com.metro.vigo.backend.network.LineStationRepository;
import com.metro.vigo.backend.station.Station;
import com.metro.vigo.backend.station.StationRepository;
import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import com.metro.vigo.backend.incident.*;
import com.metro.vigo.backend.incident.IncidentRepository;

import java.util.Map;
import java.util.stream.Collectors;

@Configuration
public class SeedData {

    @Bean
    CommandLineRunner init(LineRepository lineRepo, StationRepository stationRepo, LineStationRepository lsRepo, IncidentRepository incidentRepo) {
        return args ->

        {

            // -------------------------
            // 1) LINES
            // -------------------------
            if (lineRepo.count() == 0) {
                lineRepo.save(new Line("V1", "Iago Aspas · Teis ↔ Balaídos ↔ Coruxo", "#00AEEF", "OK"));
                lineRepo.save(new Line("V2", "Clara Campoamor · Vialia ↔ Navia", "#8E44AD", "OK"));
                lineRepo.save(new Line("V3", "Atlántica · Teis ↔ Castrelos", "#27AE60", "DELAYED"));
                lineRepo.save(new Line("V4", "Julio Verne · CUVI ↔ Centro", "#E67E22", "OK"));
                lineRepo.save(new Line("V5", "Cíes · Oia ↔ Teis", "#E11D48", "OK"));
                lineRepo.save(new Line("V6", "Oliveira · Chapela ↔ Vigo Central", "#0EA5E9", "OK"));
                lineRepo.save(new Line("V7", "Peinador Express · Vigo Central ↔ Aeroporto", "#111827", "OK"));
                lineRepo.save(new Line("V8", "Circular Ría · Vigo Central ↔ Chapela ↔ Samil ↔ Vigo Central", "#06B6D4", "OK"));
            }

            // -------------------------
// 2) STATIONS
// -------------------------
            if (stationRepo.count() == 0) {
                // Core / downtown (more accurate)
                stationRepo.save(new Station("Príncipe", 42.2360488, -8.7201362, true));              // Rua do Príncipe :contentReference[oaicite:1]{index=1}
                stationRepo.save(new Station("Puerta del Sol", 42.2381667, -8.7260000, true));         // Porta do Sol :contentReference[oaicite:2]{index=2}
                stationRepo.save(new Station("Policarpo Sanz", 42.2375000, -8.7224444, true));         // Rúa Policarpo Sanz :contentReference[oaicite:3]{index=3}
                stationRepo.save(new Station("Areál", 42.2369000, -8.7159000, true));                  // keep close to Areal / Guixar axis (approx)
                stationRepo.save(new Station("Berbés", 42.2369167, -8.7296944, false));                // Ribeira do Berbés :contentReference[oaicite:4]{index=4}
                stationRepo.save(new Station("Casco Vello", 42.2389000, -8.7268000, false));           // old town core (approx)

                // Transport hub (Vigo Central = Urzaiz) + Vialia + Guixar
                stationRepo.save(new Station("Vigo Central (Urzaiz)", 42.2342570, -8.7136120, true));  // Vigo-Urzáiz :contentReference[oaicite:5]{index=5}
                stationRepo.save(new Station("Vialia", 42.2342570, -8.7136120, true));                 // same complex as Urzaiz/Vialia :contentReference[oaicite:6]{index=6}
                stationRepo.save(new Station("Guixar", 42.2395030, -8.7129150, true));                 // Guixar (photo coords) :contentReference[oaicite:7]{index=7}

                // Port / Cruise (Transatlánticos) — use passenger terminal area
                stationRepo.save(new Station("Estación Marítima (Puerto)", 42.2424167, -8.7235833, true));             // Estación Marítima area :contentReference[oaicite:8]{index=8}
                stationRepo.save(new Station("Terminal de Cruceros (Transatlánticos)", 42.2429000, -8.7254000, true)); // very close to maritime station (approx)

                // East / Teis
                stationRepo.save(new Station("Travesía de Vigo", 42.2449000, -8.6999000, true));       // approx (avenue area)
                stationRepo.save(new Station("Teis", 42.2511520, -8.6897100, false));                   // Teis reference point :contentReference[oaicite:9]{index=9}
                stationRepo.save(new Station("A Guía", 42.2469000, -8.7058000, false));                 // approx (Monte da Guía area)

                // South / Calvario / Lavadores
                stationRepo.save(new Station("O Calvario", 42.2246000, -8.7079000, true));              // approx
                stationRepo.save(new Station("A Doblada", 42.2280000, -8.7155000, true));               // approx
                stationRepo.save(new Station("Lavadores", 42.2239000, -8.6955000, false));              // approx
                stationRepo.save(new Station("Sárdoma", 42.2118000, -8.6887000, false));                // approx

                // West / Coia / Navia / Beaches (Plaza América key)
                stationRepo.save(new Station("Praza de América", 42.2210278, -8.7327778, true));        // Plaza América :contentReference[oaicite:10]{index=10}
                stationRepo.save(new Station("As Travesas", 42.2232000, -8.7398000, true));             // approx
                stationRepo.save(new Station("Balaídos", 42.2118417, -8.7397111, true));                // Balaídos :contentReference[oaicite:11]{index=11}
                stationRepo.save(new Station("Castrelos", 42.2137778, -8.7292500, true));               // Parque de Castrelos :contentReference[oaicite:12]{index=12}
                stationRepo.save(new Station("Coia", 42.2182924, -8.7441073, true));                    // Coia (neighborhood point) :contentReference[oaicite:13]{index=13}
                stationRepo.save(new Station("Alcabre", 42.2236667, -8.7625556, false));                // Alcabre (Carril/area) :contentReference[oaicite:14]{index=14}
                stationRepo.save(new Station("Navia", 42.2064889, -8.7674194, true));                   // Navia :contentReference[oaicite:15]{index=15}
                stationRepo.save(new Station("Samil", 42.2090833, -8.7759722, true));                   // Samil :contentReference[oaicite:16]{index=16}

                // Southwest / Oia / Coruxo
                stationRepo.save(new Station("Coruxo", 42.1809000, -8.7845000, false));                 // approx
                stationRepo.save(new Station("Oia", 42.1728000, -8.8060000, false));                    // approx

                // University / South
                stationRepo.save(new Station("Beade", 42.1896000, -8.7228000, false));                  // approx
                stationRepo.save(new Station("Matamá", 42.1745000, -8.6905000, false));                 // approx
                stationRepo.save(new Station("CUVI (Universidade)", 42.1682911, -8.6889985, true));     // UVigo campus :contentReference[oaicite:17]{index=17}

                // Airport (Peinador)
                stationRepo.save(new Station("Peinador (Airport)", 42.2322222, -8.6310833, true));      // Peinador :contentReference[oaicite:18]{index=18}

                // Nearby (metropolitan)
                stationRepo.save(new Station("Chapela", 42.2681389, -8.6663333, false));                // Chapela :contentReference[oaicite:19]{index=19}

                // Hospitals (CHUVI)
                stationRepo.save(new Station("Hospital Álvaro Cunqueiro", 42.1883889, -8.7144444, true));
                stationRepo.save(new Station("Hospital do Meixoeiro", 42.2147778, -8.6845278, true));
            }

            // -------------------------
            // 3) LINE-STATION RELATIONSHIPS (ordered)
            // -------------------------
            if (lsRepo.count() == 0) {

                Map<String, Line> lines =
                        lineRepo.findAll().stream().collect(Collectors.toMap(Line::getCode, l -> l));

                Map<String, Station> stations =
                        stationRepo.findAll().stream().collect(Collectors.toMap(Station::getName, s -> s));

                // ---- V1: Príncipe ↔ Samil (axis to beaches)
                lsRepo.save(new LineStation(lines.get("V1"), stations.get("Príncipe"), 1));
                lsRepo.save(new LineStation(lines.get("V1"), stations.get("Puerta del Sol"), 2));
                lsRepo.save(new LineStation(lines.get("V1"), stations.get("Policarpo Sanz"), 3));
                lsRepo.save(new LineStation(lines.get("V1"), stations.get("Praza de América"), 4));
                lsRepo.save(new LineStation(lines.get("V1"), stations.get("As Travesas"), 5));
                lsRepo.save(new LineStation(lines.get("V1"), stations.get("Balaídos"), 6));
                lsRepo.save(new LineStation(lines.get("V1"), stations.get("Samil"), 7));

                // ---- V2: Vialia ↔ Navia (hub + west residential)
                lsRepo.save(new LineStation(lines.get("V2"), stations.get("Vialia"), 1));
                lsRepo.save(new LineStation(lines.get("V2"), stations.get("Vigo Central (Urzaiz)"), 2));
                lsRepo.save(new LineStation(lines.get("V2"), stations.get("Areál"), 3));
                lsRepo.save(new LineStation(lines.get("V2"), stations.get("Praza de América"), 4));
                lsRepo.save(new LineStation(lines.get("V2"), stations.get("Coia"), 5));
                lsRepo.save(new LineStation(lines.get("V2"), stations.get("Alcabre"), 6));
                lsRepo.save(new LineStation(lines.get("V2"), stations.get("Navia"), 7));

                // ---- V3: Teis ↔ Castrelos (east to park)
                lsRepo.save(new LineStation(lines.get("V3"), stations.get("Teis"), 1));
                lsRepo.save(new LineStation(lines.get("V3"), stations.get("Travesía de Vigo"), 2));
                lsRepo.save(new LineStation(lines.get("V3"), stations.get("Guixar"), 3));
                lsRepo.save(new LineStation(lines.get("V3"), stations.get("Berbés"), 4));
                lsRepo.save(new LineStation(lines.get("V3"), stations.get("Príncipe"), 5));
                lsRepo.save(new LineStation(lines.get("V3"), stations.get("O Calvario"), 6));
                lsRepo.save(new LineStation(lines.get("V3"), stations.get("Castrelos"), 7));

                // ---- V4: CUVI ↔ Príncipe (university axis)
                lsRepo.save(new LineStation(lines.get("V4"), stations.get("CUVI (Universidade)"), 1));
                lsRepo.save(new LineStation(lines.get("V4"), stations.get("Matamá"), 2));
                lsRepo.save(new LineStation(lines.get("V4"), stations.get("Beade"), 3));
                lsRepo.save(new LineStation(lines.get("V4"), stations.get("Sárdoma"), 4));
                lsRepo.save(new LineStation(lines.get("V4"), stations.get("Balaídos"), 5));
                lsRepo.save(new LineStation(lines.get("V4"), stations.get("Praza de América"), 6));
                lsRepo.save(new LineStation(lines.get("V4"), stations.get("Príncipe"), 7));

                // ---- V5: Oia ↔ Teis (coastal + cross-city)
                lsRepo.save(new LineStation(lines.get("V5"), stations.get("Oia"), 1));
                lsRepo.save(new LineStation(lines.get("V5"), stations.get("Coruxo"), 2));
                lsRepo.save(new LineStation(lines.get("V5"), stations.get("Samil"), 3));
                lsRepo.save(new LineStation(lines.get("V5"), stations.get("Alcabre"), 4));
                lsRepo.save(new LineStation(lines.get("V5"), stations.get("Coia"), 5));
                lsRepo.save(new LineStation(lines.get("V5"), stations.get("Praza de América"), 6));
                lsRepo.save(new LineStation(lines.get("V5"), stations.get("Príncipe"), 7));
                lsRepo.save(new LineStation(lines.get("V5"), stations.get("Travesía de Vigo"), 8));
                lsRepo.save(new LineStation(lines.get("V5"), stations.get("Teis"), 9));

                // ---- V6: Chapela ↔ Vigo Central (metropolitan connector)
                lsRepo.save(new LineStation(lines.get("V6"), stations.get("Chapela"), 1));
                lsRepo.save(new LineStation(lines.get("V6"), stations.get("Teis"), 2));
                lsRepo.save(new LineStation(lines.get("V6"), stations.get("A Guía"), 3));
                lsRepo.save(new LineStation(lines.get("V6"), stations.get("Travesía de Vigo"), 4));
                lsRepo.save(new LineStation(lines.get("V6"), stations.get("Guixar"), 5));
                lsRepo.save(new LineStation(lines.get("V6"), stations.get("Vialia"), 6));
                lsRepo.save(new LineStation(lines.get("V6"), stations.get("Vigo Central (Urzaiz)"), 7));

                // ---- V7: Vigo Central ↔ Airport Express (Peinador)
                lsRepo.save(new LineStation(lines.get("V7"), stations.get("Vigo Central (Urzaiz)"), 1));
                lsRepo.save(new LineStation(lines.get("V7"), stations.get("Lavadores"), 2));
                lsRepo.save(new LineStation(lines.get("V7"), stations.get("Sárdoma"), 3));
                lsRepo.save(new LineStation(lines.get("V7"), stations.get("Peinador (Airport)"), 4));

                // ---- V8: Vigo Central ↔ Cruise Terminal (Transatlánticos)
                lsRepo.save(new LineStation(lines.get("V8"), stations.get("Vigo Central (Urzaiz)"), 1));
                lsRepo.save(new LineStation(lines.get("V8"), stations.get("Areál"), 2));
                lsRepo.save(new LineStation(lines.get("V8"), stations.get("Estación Marítima (Puerto)"), 3));
                lsRepo.save(new LineStation(lines.get("V8"), stations.get("Terminal de Cruceros (Transatlánticos)"), 4));
                lsRepo.save(new LineStation(lines.get("V8"), stations.get("Berbés"), 5));
                lsRepo.save(new LineStation(lines.get("V8"), stations.get("Casco Vello"), 6));
            }
            if (incidentRepo.count() == 0) {
                var lines = lineRepo.findAll().stream().collect(Collectors.toMap(Line::getCode, l -> l));
                var stations = stationRepo.findAll().stream().collect(Collectors.toMap(Station::getName, s -> s));

                // Network-wide info
                incidentRepo.save(new Incident(
                        IncidentSeverity.INFO,
                        IncidentScope.NETWORK,
                        "Maintenance window tonight",
                        "Scheduled maintenance between 01:00 and 03:00. Minor delays possible on all lines.",
                        true,
                        null,
                        null
                ));

                // Line incident (e.g. Airport Express)
                incidentRepo.save(new Incident(
                        IncidentSeverity.MAJOR,
                        IncidentScope.LINE,
                        "V7 reduced service",
                        "Airport Express running every 20 minutes due to rolling stock constraints.",
                        true,
                        lines.get("V7"),
                        null
                ));

                // Station incident (e.g. Vigo Central)
                incidentRepo.save(new Incident(
                        IncidentSeverity.MINOR,
                        IncidentScope.STATION,
                        "Elevator out of service",
                        "One elevator is temporarily out of service at Vigo Central. Staff assistance available.",
                        true,
                        null,
                        stations.get("Vigo Central (Urzaiz)")
                ));
            }
        };
    }
}
