package com.utipdam.mobility.model.repository;

import com.utipdam.mobility.model.entity.DownloadsByDay;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.sql.Date;
import java.util.List;
import java.util.UUID;

public interface DownloadsByDayRepository extends JpaRepository<DownloadsByDay, Integer> {
    List<DownloadsByDay> findByDatasetDefinitionId(@Param("datasetDefinitionId") UUID datasetDefinitionId);
    DownloadsByDay findByDatasetDefinitionIdAndDate(@Param("datasetDefinitionId") UUID datasetDefinitionId,
                                                          @Param("date") Date date);

    @Modifying
    @Query(nativeQuery = true, value = "UPDATE downloads_by_day d SET d.count = d.count + 1 WHERE d.id = :id")
    void incrementCount(@Param("id") Integer id);

}
