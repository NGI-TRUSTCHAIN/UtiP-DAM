package com.utipdam.mobility.model;

import lombok.Data;

import java.util.List;
import java.util.UUID;

@Data
public class DownloadDTO {
    private UUID datasetDefinitionId;
    private boolean selectedDate;
    private boolean pastDate;
    private boolean futureDate;
    private List<UUID> datasetIds;

}
