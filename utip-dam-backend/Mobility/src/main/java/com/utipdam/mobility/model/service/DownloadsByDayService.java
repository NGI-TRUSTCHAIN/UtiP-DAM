package com.utipdam.mobility.model.service;


import com.utipdam.mobility.model.entity.DownloadsByDay;
import com.utipdam.mobility.model.repository.DownloadsByDayRepository;
import jakarta.transaction.Transactional;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.sql.Date;
import java.util.List;
import java.util.Optional;
import java.util.UUID;


@Service
public class DownloadsByDayService {
    private final DownloadsByDayRepository downloadsByDayRepository;

    @Autowired
    public DownloadsByDayService(DownloadsByDayRepository downloadsByDayRepository) {
        this.downloadsByDayRepository = downloadsByDayRepository;
    }
    public Optional<DownloadsByDay> findById(Integer id) {
        return downloadsByDayRepository.findById(id);
    }

    public List<DownloadsByDay> findByDatasetDefinitionId(UUID datasetDefinitionId) {
        return downloadsByDayRepository.findByDatasetDefinitionId(datasetDefinitionId);
    }

    public DownloadsByDay findByDatasetDefinitionIdAndDate(UUID datasetDefinitionId, Date date) {
        return downloadsByDayRepository.findByDatasetDefinitionIdAndDate(datasetDefinitionId, date);
    }

    @Transactional
    public void incrementCount(Integer id) {
        downloadsByDayRepository.incrementCount(id);
    }

    public void save(DownloadsByDay downloadsByDay) {
        downloadsByDayRepository.save(downloadsByDay);
    }
}
