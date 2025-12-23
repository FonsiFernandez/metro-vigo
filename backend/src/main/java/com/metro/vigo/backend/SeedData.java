package com.metro.vigo.backend;

import com.metro.vigo.backend.line.Line;
import com.metro.vigo.backend.line.LineRepository;
import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

@Configuration
public class SeedData {

    @Bean
    CommandLineRunner init(LineRepository repo) {
        return args -> {
            if (repo.count() == 0) {
                repo.save(new Line("M1", "Centro ↔ Coia", "#00AEEF", "OK"));
                repo.save(new Line("M2", "Urzaiz ↔ Navia", "#8E44AD", "OK"));
                repo.save(new Line("M3", "Teis ↔ Castrelos", "#27AE60", "DELAYED"));
            }
        };
    }
}
