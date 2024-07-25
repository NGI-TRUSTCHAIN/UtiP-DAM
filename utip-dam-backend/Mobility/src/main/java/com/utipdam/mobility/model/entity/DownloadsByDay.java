package com.utipdam.mobility.model.entity;

import jakarta.persistence.*;
import lombok.Data;

import java.sql.Date;
import java.util.UUID;

@Entity(name = "downloads_by_day")
@Data
public class DownloadsByDay {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id")
    private Integer id;

    @Column(name = "dataset_definition_id")
    private UUID datasetDefinitionId;

    @Column(name = "date")
    private Date date;

    @Column(name = "count")
    private Integer count;
    public DownloadsByDay() {
    }


    public DownloadsByDay(UUID datasetDefinitionId, Date date, Integer count) {
        this.datasetDefinitionId = datasetDefinitionId;
        this.date = date;
        this.count = count;
    }

    public void update(DownloadsByDay downloadsByDay) {
        if (downloadsByDay.getDatasetDefinitionId() != null) {
            this.datasetDefinitionId = downloadsByDay.getDatasetDefinitionId();
        }
        if (downloadsByDay.getDate() != null) {
            this.date = downloadsByDay.getDate();
        }
        if (downloadsByDay.getCount() != null) {
            this.count = downloadsByDay.getCount();
        }
    }

}
