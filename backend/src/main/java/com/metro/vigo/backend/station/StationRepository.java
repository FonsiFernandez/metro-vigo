package com.metro.vigo.backend.station;

import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface StationRepository extends JpaRepository<Station, Long> {
    List<Station> findTop10ByNameContainingIgnoreCaseOrderByNameAsc(String query);
    List<Station> findTop20ByOrderByNameAsc();
}
