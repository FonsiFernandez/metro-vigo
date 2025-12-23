package com.metro.vigo.backend.incident;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;

public interface IncidentRepository extends JpaRepository<Incident, Long> {

    @Query("""
        select i
        from Incident i
        left join fetch i.line l
        left join fetch i.station s
        where i.active = true
        order by 
          case i.severity
            when com.metro.vigo.backend.incident.IncidentSeverity.CRITICAL then 1
            when com.metro.vigo.backend.incident.IncidentSeverity.MAJOR then 2
            when com.metro.vigo.backend.incident.IncidentSeverity.MINOR then 3
            else 4
          end,
          i.createdAt desc
    """)
    List<Incident> findActiveWithRefs();

    @Query("""
        select i
        from Incident i
        left join fetch i.line l
        left join fetch i.station s
        where i.active = true
          and (:lineId is null or l.id = :lineId)
          and (:stationId is null or s.id = :stationId)
        order by i.createdAt desc
    """)
    List<Incident> findActiveFiltered(@Param("lineId") Long lineId, @Param("stationId") Long stationId);
}
