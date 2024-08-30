import Papa from 'papaparse';
import { createSelector } from '@reduxjs/toolkit';

const getAuditData = (state) => state.anonymization.audit_dataset.data;
const getAuditStatus = (state) => state.anonymization.audit_dataset.status;

const getMobilityUploadStatus = (state) =>
  state.anonymization.mobility_upload.status;
const getMobilityUploadData = (state) =>
  state.anonymization.mobility_upload.data;
const getMobilityUploadPerformanceMetricsData = (state) =>
  state.anonymization.mobility_upload.performance_metrics_data;
const getMobilityDownloadStatus = (state) =>
  state.anonymization.mobility_download.status;
const getMobilityDownloadData = (state) =>
  state.anonymization.mobility_download.data;
const getVisitorDetectionStatus = (state) =>
  state.anonymization.visitor_detection.status;
const getVisitorDetectionData = (state) =>
  state.anonymization.visitor_detection.data;

const selectDownloadedCsv = createSelector(
  [getMobilityUploadData],
  (csvInText) => {
    if (typeof csvInText !== 'object') {
      const csvData = Papa.parse(csvInText, {
        header: true,
        skipEmptyLines: true,
      });

      const csvFile = Papa.unparse(csvData.data);
      const csvBlob = new Blob([csvFile], { type: 'text/csv' });

      return csvBlob;
    }
  }
);

export const anonymizationState = {
  getAuditData,
  getAuditStatus,
  getMobilityDownloadStatus,
  getMobilityDownloadData,
  getMobilityUploadStatus,
  getMobilityUploadData,
  getMobilityUploadPerformanceMetricsData,
  getVisitorDetectionData,
  getVisitorDetectionStatus,
  selectDownloadedCsv,
};
