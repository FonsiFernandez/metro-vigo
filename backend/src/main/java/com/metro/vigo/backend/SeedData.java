package com.metro.vigo.backend;

import com.metro.vigo.backend.line.Line;
import com.metro.vigo.backend.line.LineRepository;
import com.metro.vigo.backend.station.Station;
import com.metro.vigo.backend.station.StationRepository;
import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

@Configuration
public class SeedData {

    @Bean
    CommandLineRunner init(LineRepository lineRepo, StationRepository stationRepo) {
        return args -> {
            if (lineRepo.count() == 0) {
                lineRepo.save(new Line("M1", "Centro ↔ Coia", "#00AEEF", "OK"));
                lineRepo.save(new Line("M2", "Urzaiz ↔ Navia", "#8E44AD", "OK"));
                lineRepo.save(new Line("M3", "Teis ↔ Castrelos", "#27AE60", "DELAYED"));
            }

            if (stationRepo.count() == 0) {
                stationRepo.save(new Station("Urzaiz", 42.2329, -8.7110, true));
                stationRepo.save(new Station("Vialia", 42.2325, -8.7120, true));
                stationRepo.save(new Station("Centro", 42.2406, -8.7207, true));
                stationRepo.save(new Station("Puerta del Sol", 42.2393, -8.7243, true));
                stationRepo.save(new Station("Bouzas", 42.2159, -8.7500, false));
                stationRepo.save(new Station("Coia", 42.2168, -8.7630, true));
                stationRepo.save(new Station("Navia", 42.2097, -8.7702, true));
                stationRepo.save(new Station("Castrelos", 42.2147, -8.7372, true));
                stationRepo.save(new Station("Teis", 42.2538, -8.7005, false));
                stationRepo.save(new Station("Travesía", 42.2482, -8.7079, true));
            }
        };
    }
}
