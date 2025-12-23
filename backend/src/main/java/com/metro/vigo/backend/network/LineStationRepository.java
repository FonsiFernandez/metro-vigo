package com.metro.vigo.backend.network;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;

public interface LineStationRepository extends JpaRepository<LineStation, Long> {

    @Query("""
        select ls
        from LineStation ls
        join fetch ls.station s
        where ls.line.id = :lineId
        order by ls.position asc
    """)
    List<LineStation> findByLineIdWithStationsOrdered(@Param("lineId") Long lineId);

    @Query("""
        select ls
        from LineStation ls
        join fetch ls.line l
        where ls.station.id = :stationId
        order by ls.position asc
    """)
    List<LineStation> findByStationIdWithLinesOrdered(@Param("stationId") Long stationId);
}
