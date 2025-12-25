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
    CommandLineRunner init(
            LineRepository lineRepo,
            StationRepository stationRepo,
            LineStationRepository lsRepo,
            IncidentRepository incidentRepo
    ) {
        return args -> {

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
            // 2) STATIONS (+ facilities)
            // -------------------------
            if (stationRepo.count() == 0) {

                // Helper to reduce repetition
                java.util.function.Consumer<Station> save = stationRepo::save;

                // Core / downtown
                var principe = new Station("Príncipe", 42.2360488, -8.7201362, true);
                principe.setHasElevator(true);
                principe.setHasToilets(false);
                principe.setHasInfoPoint(true);
                principe.setHasEBikes(true);
                principe.setHasBikeParking(true);
                principe.setAccessibilityNote("Acceso sin escalones desde la entrada principal.");
                save.accept(principe);

                var puertaSol = new Station("Puerta del Sol", 42.2381667, -8.7260000, true);
                puertaSol.setHasElevator(false);
                puertaSol.setHasToilets(false);
                puertaSol.setHasInfoPoint(true);
                puertaSol.setHasEBikes(false);
                puertaSol.setHasBikeParking(true);
                puertaSol.setAccessibilityNote("Acceso accesible por rampa en superficie.");
                save.accept(puertaSol);

                var policarpo = new Station("Policarpo Sanz", 42.2375000, -8.7224444, true);
                policarpo.setHasElevator(false);
                policarpo.setHasToilets(false);
                policarpo.setHasInfoPoint(false);
                policarpo.setHasEBikes(false);
                policarpo.setHasBikeParking(true);
                policarpo.setAccessibilityNote("Acceso en superficie; andenes a cota similar.");
                save.accept(policarpo);

                var areal = new Station("Areál", 42.2369000, -8.7159000, true);
                areal.setHasElevator(true);
                areal.setHasToilets(false);
                areal.setHasInfoPoint(false);
                areal.setHasEBikes(true);
                areal.setHasBikeParking(true);
                areal.setAccessibilityNote("Paso accesible y ascensor a nivel de andén.");
                save.accept(areal);

                var berbes = new Station("Berbés", 42.2369167, -8.7296944, false);
                berbes.setHasElevator(false);
                berbes.setHasToilets(false);
                berbes.setHasInfoPoint(false);
                berbes.setHasEBikes(false);
                berbes.setHasBikeParking(true);
                berbes.setAccessibilityNote("Zona histórica con desniveles; acceso limitado.");
                save.accept(berbes);

                var cascoVello = new Station("Casco Vello", 42.2389000, -8.7268000, false);
                cascoVello.setHasElevator(false);
                cascoVello.setHasToilets(false);
                cascoVello.setHasInfoPoint(true);
                cascoVello.setHasEBikes(false);
                cascoVello.setHasBikeParking(false);
                cascoVello.setAccessibilityNote("Calles estrechas y pendientes; accesibilidad limitada.");
                save.accept(cascoVello);

                // Transport hubs
                var vigoCentral = new Station("Vigo Central (Urzaiz)", 42.2342570, -8.7136120, true);
                vigoCentral.setHasElevator(true);
                vigoCentral.setHasToilets(true);
                vigoCentral.setHasInfoPoint(true);
                vigoCentral.setHasEBikes(true);
                vigoCentral.setHasBikeParking(true);
                vigoCentral.setAccessibilityNote("Ascensores a andenes y conexión directa con Vialia.");
                save.accept(vigoCentral);

                var vialia = new Station("Vialia", 42.2342570, -8.7136120, true);
                vialia.setHasElevator(true);
                vialia.setHasToilets(true);
                vialia.setHasInfoPoint(true);
                vialia.setHasEBikes(true);
                vialia.setHasBikeParking(true);
                vialia.setAccessibilityNote("Intercambiador accesible; servicios y aseos disponibles.");
                save.accept(vialia);

                var guixar = new Station("Guixar", 42.2395030, -8.7129150, true);
                guixar.setHasElevator(true);
                guixar.setHasToilets(true);
                guixar.setHasInfoPoint(true);
                guixar.setHasEBikes(false);
                guixar.setHasBikeParking(true);
                guixar.setAccessibilityNote("Terminal con ascensor y aseos.");
                save.accept(guixar);

                // Port / Cruise
                var estMaritima = new Station("Estación Marítima (Puerto)", 42.2424167, -8.7235833, true);
                estMaritima.setHasElevator(true);
                estMaritima.setHasToilets(true);
                estMaritima.setHasInfoPoint(true);
                estMaritima.setHasEBikes(false);
                estMaritima.setHasBikeParking(true);
                estMaritima.setAccessibilityNote("Acceso accesible; servicios en terminal marítima.");
                save.accept(estMaritima);

                var cruceros = new Station("Terminal de Cruceros (Transatlánticos)", 42.2429000, -8.7254000, true);
                cruceros.setHasElevator(true);
                cruceros.setHasToilets(true);
                cruceros.setHasInfoPoint(true);
                cruceros.setHasEBikes(false);
                cruceros.setHasBikeParking(false);
                cruceros.setAccessibilityNote("Terminal accesible; atención al viajero.");
                save.accept(cruceros);

                // East / Teis
                var travesia = new Station("Travesía de Vigo", 42.2449000, -8.6999000, true);
                travesia.setHasElevator(false);
                travesia.setHasToilets(false);
                travesia.setHasInfoPoint(false);
                travesia.setHasEBikes(true);
                travesia.setHasBikeParking(true);
                travesia.setAccessibilityNote("Acceso accesible en superficie.");
                save.accept(travesia);

                var teis = new Station("Teis", 42.2511520, -8.6897100, false);
                teis.setHasElevator(false);
                teis.setHasToilets(false);
                teis.setHasInfoPoint(false);
                teis.setHasEBikes(false);
                teis.setHasEBikes(false);
                teis.setHasBikeParking(true);
                teis.setAccessibilityNote("Barrio con pendientes; accesibilidad limitada.");
                save.accept(teis);

                var guia = new Station("A Guía", 42.2469000, -8.7058000, false);
                guia.setHasElevator(false);
                guia.setHasToilets(false);
                guia.setHasInfoPoint(false);
                guia.setHasEBikes(false);
                guia.setHasBikeParking(false);
                guia.setAccessibilityNote("Acceso limitado por desnivel.");
                save.accept(guia);

                // South / Calvario / Lavadores
                var calvario = new Station("O Calvario", 42.2246000, -8.7079000, true);
                calvario.setHasElevator(false);
                calvario.setHasToilets(false);
                calvario.setHasInfoPoint(true);
                calvario.setHasEBikes(true);
                calvario.setHasBikeParking(true);
                calvario.setAccessibilityNote("Acceso accesible; punto de información en horas punta.");
                save.accept(calvario);

                var doblada = new Station("A Doblada", 42.2280000, -8.7155000, true);
                doblada.setHasElevator(false);
                doblada.setHasToilets(false);
                doblada.setHasInfoPoint(false);
                doblada.setHasEBikes(false);
                doblada.setHasBikeParking(true);
                doblada.setAccessibilityNote("Acceso accesible en superficie.");
                save.accept(doblada);

                var lavadores = new Station("Lavadores", 42.2239000, -8.6955000, false);
                lavadores.setHasElevator(false);
                lavadores.setHasToilets(false);
                lavadores.setHasInfoPoint(false);
                lavadores.setHasEBikes(false);
                lavadores.setHasBikeParking(true);
                lavadores.setHasBikeParking(true);
                lavadores.setAccessibilityNote("Accesibilidad limitada por desniveles.");
                save.accept(lavadores);

                var sardoma = new Station("Sárdoma", 42.2118000, -8.6887000, false);
                sardoma.setHasElevator(false);
                sardoma.setHasToilets(false);
                sardoma.setHasInfoPoint(false);
                sardoma.setHasEBikes(false);
                sardoma.setHasBikeParking(true);
                sardoma.setAccessibilityNote("Acceso limitado.");
                save.accept(sardoma);

                // West / Coia / Navia / Beaches
                var prazaAmerica = new Station("Praza de América", 42.2210278, -8.7327778, true);
                prazaAmerica.setHasElevator(true);
                prazaAmerica.setHasToilets(false);
                prazaAmerica.setHasInfoPoint(true);
                prazaAmerica.setHasEBikes(true);
                prazaAmerica.setHasBikeParking(true);
                prazaAmerica.setAccessibilityNote("Intercambiador accesible.");
                save.accept(prazaAmerica);

                var travesas = new Station("As Travesas", 42.2232000, -8.7398000, true);
                travesas.setHasElevator(false);
                travesas.setHasToilets(false);
                travesas.setHasInfoPoint(false);
                travesas.setHasEBikes(true);
                travesas.setHasBikeParking(true);
                travesas.setAccessibilityNote("Acceso accesible.");
                save.accept(travesas);

                var balaidos = new Station("Balaídos", 42.2118417, -8.7397111, true);
                balaidos.setHasElevator(true);
                balaidos.setHasToilets(true);
                balaidos.setHasInfoPoint(true);
                balaidos.setHasEBikes(true);
                balaidos.setHasEBikes(true);
                balaidos.setHasBikeParking(true);
                balaidos.setAccessibilityNote("Estación-evento; aseos e información en días de partido.");
                save.accept(balaidos);

                var castrelos = new Station("Castrelos", 42.2137778, -8.7292500, true);
                castrelos.setHasElevator(false);
                castrelos.setHasToilets(false);
                castrelos.setHasInfoPoint(false);
                castrelos.setHasEBikes(false);
                castrelos.setHasBikeParking(true);
                castrelos.setAccessibilityNote("Acceso accesible.");
                save.accept(castrelos);

                var coia = new Station("Coia", 42.2182924, -8.7441073, true);
                coia.setHasElevator(false);
                coia.setHasToilets(false);
                coia.setHasInfoPoint(false);
                coia.setHasEBikes(true);
                coia.setHasBikeParking(true);
                coia.setAccessibilityNote("Acceso accesible; aparcabicis disponible.");
                save.accept(coia);

                var alcabre = new Station("Alcabre", 42.2236667, -8.7625556, false);
                alcabre.setHasElevator(false);
                alcabre.setHasToilets(false);
                alcabre.setHasInfoPoint(false);
                alcabre.setHasEBikes(false);
                alcabre.setHasBikeParking(true);
                alcabre.setAccessibilityNote("Accesibilidad limitada.");
                save.accept(alcabre);

                var navia = new Station("Navia", 42.2064889, -8.7674194, true);
                navia.setHasElevator(false);
                navia.setHasToilets(false);
                navia.setHasInfoPoint(false);
                navia.setHasEBikes(true);
                navia.setHasBikeParking(true);
                navia.setAccessibilityNote("Acceso accesible; movilidad ciclista.");
                save.accept(navia);

                var samil = new Station("Samil", 42.2090833, -8.7759722, true);
                samil.setHasElevator(false);
                samil.setHasToilets(true);
                samil.setHasInfoPoint(false);
                samil.setHasEBikes(true);
                samil.setHasBikeParking(true);
                samil.setAccessibilityNote("Acceso accesible; aseos en temporada.");
                save.accept(samil);

                // Southwest / Oia / Coruxo
                var coruxo = new Station("Coruxo", 42.1809000, -8.7845000, false);
                coruxo.setHasElevator(false);
                coruxo.setHasToilets(false);
                coruxo.setHasInfoPoint(false);
                coruxo.setHasEBikes(false);
                coruxo.setHasBikeParking(true);
                coruxo.setAccessibilityNote("Accesibilidad limitada.");
                save.accept(coruxo);

                var oia = new Station("Oia", 42.1728000, -8.8060000, false);
                oia.setHasElevator(false);
                oia.setHasToilets(false);
                oia.setHasInfoPoint(false);
                oia.setHasEBikes(false);
                oia.setHasBikeParking(false);
                oia.setAccessibilityNote("Acceso limitado; estación rural.");
                save.accept(oia);

                // University / South
                var beade = new Station("Beade", 42.1896000, -8.7228000, false);
                beade.setHasElevator(false);
                beade.setHasToilets(false);
                beade.setHasInfoPoint(false);
                beade.setHasEBikes(false);
                beade.setHasBikeParking(true);
                beade.setAccessibilityNote("Acceso limitado.");
                save.accept(beade);

                var matama = new Station("Matamá", 42.1745000, -8.6905000, false);
                matama.setHasElevator(false);
                matama.setHasToilets(false);
                matama.setHasInfoPoint(false);
                matama.setHasEBikes(false);
                matama.setHasBikeParking(true);
                matama.setAccessibilityNote("Accesibilidad limitada.");
                save.accept(matama);

                var cuvi = new Station("CUVI (Universidade)", 42.1682911, -8.6889985, true);
                cuvi.setHasElevator(true);
                cuvi.setHasToilets(true);
                cuvi.setHasInfoPoint(true);
                cuvi.setHasEBikes(true);
                cuvi.setHasBikeParking(true);
                cuvi.setAccessibilityNote("Campus accesible; servicios completos.");
                save.accept(cuvi);

                // Airport
                var peinador = new Station("Peinador (Airport)", 42.2322222, -8.6310833, true);
                peinador.setHasElevator(true);
                peinador.setHasToilets(true);
                peinador.setHasInfoPoint(true);
                peinador.setHasEBikes(false);
                peinador.setHasBikeParking(true);
                peinador.setAccessibilityNote("Acceso accesible; terminal con aseos e información.");
                save.accept(peinador);

                // Metropolitan
                var chapela = new Station("Chapela", 42.2681389, -8.6663333, false);
                chapela.setHasElevator(false);
                chapela.setHasToilets(false);
                chapela.setHasInfoPoint(false);
                chapela.setHasEBikes(false);
                chapela.setHasBikeParking(true);
                chapela.setAccessibilityNote("Accesibilidad limitada.");
                save.accept(chapela);

                // Hospitals
                var alvaro = new Station("Hospital Álvaro Cunqueiro", 42.1883889, -8.7144444, true);
                alvaro.setHasElevator(true);
                alvaro.setHasToilets(true);
                alvaro.setHasInfoPoint(true);
                alvaro.setHasEBikes(true);
                alvaro.setHasBikeParking(true);
                alvaro.setAccessibilityNote("Hospital: accesibilidad completa y servicios.");
                save.accept(alvaro);

                var meix = new Station("Hospital do Meixoeiro", 42.2147778, -8.6845278, true);
                meix.setHasElevator(true);
                meix.setHasToilets(true);
                meix.setHasInfoPoint(true);
                meix.setHasEBikes(false);
                meix.setHasBikeParking(true);
                meix.setAccessibilityNote("Hospital: acceso accesible; aparcabicis disponible.");
                save.accept(meix);
            }

            // -------------------------
            // 3) LINE-STATION RELATIONSHIPS (ordered)
            // -------------------------
            if (lsRepo.count() == 0) {

                Map<String, Line> lines =
                        lineRepo.findAll().stream().collect(Collectors.toMap(Line::getCode, l -> l));

                Map<String, Station> stations =
                        stationRepo.findAll().stream().collect(Collectors.toMap(Station::getName, s -> s));

                // ---- V1
                lsRepo.save(new LineStation(lines.get("V1"), stations.get("Príncipe"), 1));
                lsRepo.save(new LineStation(lines.get("V1"), stations.get("Puerta del Sol"), 2));
                lsRepo.save(new LineStation(lines.get("V1"), stations.get("Policarpo Sanz"), 3));
                lsRepo.save(new LineStation(lines.get("V1"), stations.get("Praza de América"), 4));
                lsRepo.save(new LineStation(lines.get("V1"), stations.get("As Travesas"), 5));
                lsRepo.save(new LineStation(lines.get("V1"), stations.get("Balaídos"), 6));
                lsRepo.save(new LineStation(lines.get("V1"), stations.get("Samil"), 7));

                // ---- V2
                lsRepo.save(new LineStation(lines.get("V2"), stations.get("Vialia"), 1));
                lsRepo.save(new LineStation(lines.get("V2"), stations.get("Vigo Central (Urzaiz)"), 2));
                lsRepo.save(new LineStation(lines.get("V2"), stations.get("Areál"), 3));
                lsRepo.save(new LineStation(lines.get("V2"), stations.get("Praza de América"), 4));
                lsRepo.save(new LineStation(lines.get("V2"), stations.get("Coia"), 5));
                lsRepo.save(new LineStation(lines.get("V2"), stations.get("Alcabre"), 6));
                lsRepo.save(new LineStation(lines.get("V2"), stations.get("Navia"), 7));

                // ---- V3
                lsRepo.save(new LineStation(lines.get("V3"), stations.get("Teis"), 1));
                lsRepo.save(new LineStation(lines.get("V3"), stations.get("Travesía de Vigo"), 2));
                lsRepo.save(new LineStation(lines.get("V3"), stations.get("Guixar"), 3));
                lsRepo.save(new LineStation(lines.get("V3"), stations.get("Berbés"), 4));
                lsRepo.save(new LineStation(lines.get("V3"), stations.get("Príncipe"), 5));
                lsRepo.save(new LineStation(lines.get("V3"), stations.get("O Calvario"), 6));
                lsRepo.save(new LineStation(lines.get("V3"), stations.get("Castrelos"), 7));

                // ---- V4
                lsRepo.save(new LineStation(lines.get("V4"), stations.get("CUVI (Universidade)"), 1));
                lsRepo.save(new LineStation(lines.get("V4"), stations.get("Matamá"), 2));
                lsRepo.save(new LineStation(lines.get("V4"), stations.get("Beade"), 3));
                lsRepo.save(new LineStation(lines.get("V4"), stations.get("Sárdoma"), 4));
                lsRepo.save(new LineStation(lines.get("V4"), stations.get("Balaídos"), 5));
                lsRepo.save(new LineStation(lines.get("V4"), stations.get("Praza de América"), 6));
                lsRepo.save(new LineStation(lines.get("V4"), stations.get("Príncipe"), 7));

                // ---- V5
                lsRepo.save(new LineStation(lines.get("V5"), stations.get("Oia"), 1));
                lsRepo.save(new LineStation(lines.get("V5"), stations.get("Coruxo"), 2));
                lsRepo.save(new LineStation(lines.get("V5"), stations.get("Samil"), 3));
                lsRepo.save(new LineStation(lines.get("V5"), stations.get("Alcabre"), 4));
                lsRepo.save(new LineStation(lines.get("V5"), stations.get("Coia"), 5));
                lsRepo.save(new LineStation(lines.get("V5"), stations.get("Praza de América"), 6));
                lsRepo.save(new LineStation(lines.get("V5"), stations.get("Príncipe"), 7));
                lsRepo.save(new LineStation(lines.get("V5"), stations.get("Travesía de Vigo"), 8));
                lsRepo.save(new LineStation(lines.get("V5"), stations.get("Teis"), 9));

                // ---- V6
                lsRepo.save(new LineStation(lines.get("V6"), stations.get("Chapela"), 1));
                lsRepo.save(new LineStation(lines.get("V6"), stations.get("Teis"), 2));
                lsRepo.save(new LineStation(lines.get("V6"), stations.get("A Guía"), 3));
                lsRepo.save(new LineStation(lines.get("V6"), stations.get("Travesía de Vigo"), 4));
                lsRepo.save(new LineStation(lines.get("V6"), stations.get("Guixar"), 5));
                lsRepo.save(new LineStation(lines.get("V6"), stations.get("Vialia"), 6));
                lsRepo.save(new LineStation(lines.get("V6"), stations.get("Vigo Central (Urzaiz)"), 7));

                // ---- V7
                lsRepo.save(new LineStation(lines.get("V7"), stations.get("Vigo Central (Urzaiz)"), 1));
                lsRepo.save(new LineStation(lines.get("V7"), stations.get("Lavadores"), 2));
                lsRepo.save(new LineStation(lines.get("V7"), stations.get("Sárdoma"), 3));
                lsRepo.save(new LineStation(lines.get("V7"), stations.get("Peinador (Airport)"), 4));

                // ---- V8 (tu circular actual: ojo, no cierra el loop; si quieres cerrar, añade Vigo Central al final también)
                lsRepo.save(new LineStation(lines.get("V8"), stations.get("Vigo Central (Urzaiz)"), 1));
                lsRepo.save(new LineStation(lines.get("V8"), stations.get("Areál"), 2));
                lsRepo.save(new LineStation(lines.get("V8"), stations.get("Estación Marítima (Puerto)"), 3));
                lsRepo.save(new LineStation(lines.get("V8"), stations.get("Terminal de Cruceros (Transatlánticos)"), 4));
                lsRepo.save(new LineStation(lines.get("V8"), stations.get("Berbés"), 5));
                lsRepo.save(new LineStation(lines.get("V8"), stations.get("Casco Vello"), 6));
            }

            // -------------------------
            // 4) INCIDENTS
            // -------------------------
            if (incidentRepo.count() == 0) {
                var lines = lineRepo.findAll().stream().collect(Collectors.toMap(Line::getCode, l -> l));
                var stations = stationRepo.findAll().stream().collect(Collectors.toMap(Station::getName, s -> s));

                incidentRepo.save(new Incident(
                        IncidentSeverity.INFO,
                        IncidentScope.NETWORK,
                        "Maintenance window tonight",
                        "Scheduled maintenance between 01:00 and 03:00. Minor delays possible on all lines.",
                        true,
                        null,
                        null
                ));

                incidentRepo.save(new Incident(
                        IncidentSeverity.MAJOR,
                        IncidentScope.LINE,
                        "V7 reduced service",
                        "Airport Express running every 20 minutes due to rolling stock constraints.",
                        true,
                        lines.get("V7"),
                        null
                ));

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
