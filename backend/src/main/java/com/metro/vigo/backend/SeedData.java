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

import java.util.Map;
import java.util.stream.Collectors;

@Configuration
public class SeedData {

    @Bean
    CommandLineRunner init(LineRepository lineRepo, StationRepository stationRepo, LineStationRepository lsRepo) {
        return args -> {

            // -------------------------
            // 1) LINES
            // -------------------------
            if (lineRepo.count() == 0) {
                lineRepo.save(new Line("M1", "Centro ↔ Samil", "#00AEEF", "OK"));
                lineRepo.save(new Line("M2", "Vialia ↔ Navia", "#8E44AD", "OK"));
                lineRepo.save(new Line("M3", "Teis ↔ Castrelos", "#27AE60", "DELAYED"));
                lineRepo.save(new Line("M4", "CUVI ↔ Centro", "#E67E22", "OK"));
                lineRepo.save(new Line("M5", "Oia ↔ Teis", "#E11D48", "OK"));
                lineRepo.save(new Line("M6", "Chapela ↔ Vigo Central", "#0EA5E9", "OK"));

                // NEW: Airport + Cruise terminal
                lineRepo.save(new Line("M7", "Vigo Central ↔ Airport Express", "#111827", "OK"));
                lineRepo.save(new Line("M8", "Vigo Central ↔ Cruise Terminal", "#06B6D4", "OK"));
            }

            // -------------------------
            // 2) STATIONS
            // -------------------------
            if (stationRepo.count() == 0) {
                // Core / downtown
                stationRepo.save(new Station("Centro", 42.2406, -8.7207, true));
                stationRepo.save(new Station("Puerta del Sol", 42.2393, -8.7243, true));
                stationRepo.save(new Station("Policarpo Sanz", 42.2408, -8.7230, true));
                stationRepo.save(new Station("Areál", 42.2386, -8.7182, true));
                stationRepo.save(new Station("Berbés", 42.2380, -8.7290, false));
                stationRepo.save(new Station("Casco Vello", 42.2392, -8.7269, false));

                // Transport hub (Vigo Central = Urzaiz)
                stationRepo.save(new Station("Vigo Central (Urzaiz)", 42.2329, -8.7110, true));
                stationRepo.save(new Station("Vialia", 42.2325, -8.7120, true));
                stationRepo.save(new Station("Guixar", 42.2372, -8.7086, true));

                // Port / Cruise (Transatlánticos)
                stationRepo.save(new Station("Estación Marítima (Puerto)", 42.2402, -8.7260, true));
                stationRepo.save(new Station("Terminal de Cruceros (Transatlánticos)", 42.2400, -8.7281, true));

                // East / Teis
                stationRepo.save(new Station("Travesía de Vigo", 42.2482, -8.7079, true));
                stationRepo.save(new Station("Teis", 42.2538, -8.7005, false));
                stationRepo.save(new Station("A Guía", 42.2496, -8.6991, false));

                // South / Calvario / Lavadores
                stationRepo.save(new Station("O Calvario", 42.2268, -8.7137, true));
                stationRepo.save(new Station("A Doblada", 42.2286, -8.7179, true));
                stationRepo.save(new Station("Lavadores", 42.2254, -8.7009, false));
                stationRepo.save(new Station("Sárdoma", 42.2193, -8.6906, false));

                // West / Coia / Navia / Beaches (Plaza América is a key interchange)
                stationRepo.save(new Station("Praza de América", 42.2258, -8.7411, true));
                stationRepo.save(new Station("As Travesas", 42.2239, -8.7439, true));
                stationRepo.save(new Station("Balaídos", 42.2128, -8.7396, true));
                stationRepo.save(new Station("Castrelos", 42.2147, -8.7372, true));
                stationRepo.save(new Station("Coia", 42.2168, -8.7630, true));
                stationRepo.save(new Station("Alcabre", 42.2127, -8.7708, false));
                stationRepo.save(new Station("Navia", 42.2097, -8.7702, true));
                stationRepo.save(new Station("Samil", 42.2067, -8.7956, true));

                // Southwest / Oia / Coruxo
                stationRepo.save(new Station("Coruxo", 42.1997, -8.8052, false));
                stationRepo.save(new Station("Oia", 42.1916, -8.8167, false));

                // University / South
                stationRepo.save(new Station("Beade", 42.1769, -8.7069, false));
                stationRepo.save(new Station("Matamá", 42.1717, -8.6908, false));
                stationRepo.save(new Station("CUVI (Universidade)", 42.1692, -8.6862, true));

                // Airport (Peinador)
                stationRepo.save(new Station("Peinador (Airport)", 42.2313, -8.6260, true));

                // Nearby (metropolitan)
                stationRepo.save(new Station("Chapela", 42.2680, -8.6909, false));
            }

            // -------------------------
            // 3) LINE-STATION RELATIONSHIPS (ordered)
            // -------------------------
            if (lsRepo.count() == 0) {

                Map<String, Line> lines =
                        lineRepo.findAll().stream().collect(Collectors.toMap(Line::getCode, l -> l));

                Map<String, Station> stations =
                        stationRepo.findAll().stream().collect(Collectors.toMap(Station::getName, s -> s));

                // ---- M1: Centro ↔ Samil (axis to beaches)
                lsRepo.save(new LineStation(lines.get("M1"), stations.get("Centro"), 1));
                lsRepo.save(new LineStation(lines.get("M1"), stations.get("Puerta del Sol"), 2));
                lsRepo.save(new LineStation(lines.get("M1"), stations.get("Policarpo Sanz"), 3));
                lsRepo.save(new LineStation(lines.get("M1"), stations.get("Praza de América"), 4));
                lsRepo.save(new LineStation(lines.get("M1"), stations.get("As Travesas"), 5));
                lsRepo.save(new LineStation(lines.get("M1"), stations.get("Balaídos"), 6));
                lsRepo.save(new LineStation(lines.get("M1"), stations.get("Samil"), 7));

                // ---- M2: Vialia ↔ Navia (hub + west residential)
                lsRepo.save(new LineStation(lines.get("M2"), stations.get("Vialia"), 1));
                lsRepo.save(new LineStation(lines.get("M2"), stations.get("Vigo Central (Urzaiz)"), 2));
                lsRepo.save(new LineStation(lines.get("M2"), stations.get("Areál"), 3));
                lsRepo.save(new LineStation(lines.get("M2"), stations.get("Praza de América"), 4));
                lsRepo.save(new LineStation(lines.get("M2"), stations.get("Coia"), 5));
                lsRepo.save(new LineStation(lines.get("M2"), stations.get("Alcabre"), 6));
                lsRepo.save(new LineStation(lines.get("M2"), stations.get("Navia"), 7));

                // ---- M3: Teis ↔ Castrelos (east to park)
                lsRepo.save(new LineStation(lines.get("M3"), stations.get("Teis"), 1));
                lsRepo.save(new LineStation(lines.get("M3"), stations.get("Travesía de Vigo"), 2));
                lsRepo.save(new LineStation(lines.get("M3"), stations.get("Guixar"), 3));
                lsRepo.save(new LineStation(lines.get("M3"), stations.get("Berbés"), 4));
                lsRepo.save(new LineStation(lines.get("M3"), stations.get("Centro"), 5));
                lsRepo.save(new LineStation(lines.get("M3"), stations.get("O Calvario"), 6));
                lsRepo.save(new LineStation(lines.get("M3"), stations.get("Castrelos"), 7));

                // ---- M4: CUVI ↔ Centro (university axis)
                lsRepo.save(new LineStation(lines.get("M4"), stations.get("CUVI (Universidade)"), 1));
                lsRepo.save(new LineStation(lines.get("M4"), stations.get("Matamá"), 2));
                lsRepo.save(new LineStation(lines.get("M4"), stations.get("Beade"), 3));
                lsRepo.save(new LineStation(lines.get("M4"), stations.get("Sárdoma"), 4));
                lsRepo.save(new LineStation(lines.get("M4"), stations.get("Balaídos"), 5));
                lsRepo.save(new LineStation(lines.get("M4"), stations.get("Praza de América"), 6));
                lsRepo.save(new LineStation(lines.get("M4"), stations.get("Centro"), 7));

                // ---- M5: Oia ↔ Teis (coastal + cross-city)
                lsRepo.save(new LineStation(lines.get("M5"), stations.get("Oia"), 1));
                lsRepo.save(new LineStation(lines.get("M5"), stations.get("Coruxo"), 2));
                lsRepo.save(new LineStation(lines.get("M5"), stations.get("Samil"), 3));
                lsRepo.save(new LineStation(lines.get("M5"), stations.get("Alcabre"), 4));
                lsRepo.save(new LineStation(lines.get("M5"), stations.get("Coia"), 5));
                lsRepo.save(new LineStation(lines.get("M5"), stations.get("Praza de América"), 6));
                lsRepo.save(new LineStation(lines.get("M5"), stations.get("Centro"), 7));
                lsRepo.save(new LineStation(lines.get("M5"), stations.get("Travesía de Vigo"), 8));
                lsRepo.save(new LineStation(lines.get("M5"), stations.get("Teis"), 9));

                // ---- M6: Chapela ↔ Vigo Central (metropolitan connector)
                lsRepo.save(new LineStation(lines.get("M6"), stations.get("Chapela"), 1));
                lsRepo.save(new LineStation(lines.get("M6"), stations.get("Teis"), 2));
                lsRepo.save(new LineStation(lines.get("M6"), stations.get("A Guía"), 3));
                lsRepo.save(new LineStation(lines.get("M6"), stations.get("Travesía de Vigo"), 4));
                lsRepo.save(new LineStation(lines.get("M6"), stations.get("Guixar"), 5));
                lsRepo.save(new LineStation(lines.get("M6"), stations.get("Vialia"), 6));
                lsRepo.save(new LineStation(lines.get("M6"), stations.get("Vigo Central (Urzaiz)"), 7));

                // ---- M7: Vigo Central ↔ Airport Express (Peinador)
                lsRepo.save(new LineStation(lines.get("M7"), stations.get("Vigo Central (Urzaiz)"), 1));
                lsRepo.save(new LineStation(lines.get("M7"), stations.get("Lavadores"), 2));
                lsRepo.save(new LineStation(lines.get("M7"), stations.get("Sárdoma"), 3));
                lsRepo.save(new LineStation(lines.get("M7"), stations.get("Peinador (Airport)"), 4));

                // ---- M8: Vigo Central ↔ Cruise Terminal (Transatlánticos)
                lsRepo.save(new LineStation(lines.get("M8"), stations.get("Vigo Central (Urzaiz)"), 1));
                lsRepo.save(new LineStation(lines.get("M8"), stations.get("Areál"), 2));
                lsRepo.save(new LineStation(lines.get("M8"), stations.get("Estación Marítima (Puerto)"), 3));
                lsRepo.save(new LineStation(lines.get("M8"), stations.get("Terminal de Cruceros (Transatlánticos)"), 4));
                lsRepo.save(new LineStation(lines.get("M8"), stations.get("Berbés"), 5));
                lsRepo.save(new LineStation(lines.get("M8"), stations.get("Casco Vello"), 6));
            }
        };
    }
}
