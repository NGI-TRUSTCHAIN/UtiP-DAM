/* eslint-disable import/no-webpack-loader-syntax */

import React, { useEffect, useState } from 'react';

import Papa from 'papaparse';
import { authenticationActions } from '../store/authentication';
import countriesCsv from '!!raw-loader!../assets/docs/countries-data.csv';
import isArray from 'lodash/isArray';

export const formattedCurrency = (number, currency) => {
  return number
    ? number.toLocaleString('en-US', {
        style: 'currency',
        currency: currency || 'EUR',
      })
    : '';
};

export const formattedNumber = (number) => {
  return number?.toLocaleString('en-US');
};

export const getCountriesList = () => {
  let countries;
  Papa.parse(countriesCsv, {
    header: true,
    complete: function (results) {
      countries = results.data || [];
    },
  });
  return countries;
};

export const getMapCenter = (locations) => {
  let mapCenter = [0, 0];
  const totalLat = locations.reduce((sum, location) => sum + location.lat, 0);
  const totalLng = locations.reduce((sum, location) => sum + location.lng, 0);
  const avgLat = totalLat / locations.length;
  const avgLng = totalLng / locations.length;
  mapCenter = [avgLat, avgLng];

  return mapCenter;
};

export const getMapBounds = (coordinates) => {
  if (isArray(coordinates) && coordinates.length > 0) {
    let bounds;

    let minLat = Infinity;
    let maxLat = -Infinity;
    let minLng = Infinity;
    let maxLng = -Infinity;

    coordinates.forEach((coord) => {
      minLat = Math.min(minLat, coord[0]);
      maxLat = Math.max(maxLat, coord[0]);
      minLng = Math.min(minLng, coord[1]);
      maxLng = Math.max(maxLng, coord[1]);
    });

    bounds = [
      [minLat, minLng], // Southwest corner
      [maxLat, maxLng], // Northeast corner
    ];
    return bounds;
  }
};

export const getCountryCode = (countryName) => {
  Papa.parse(countriesCsv, {
    header: true,
    complete: function (results) {
      let country =
        results.data
          .find(
            (item) =>
              item.Country_Name.toLowerCase() === countryName.toLowerCase()
          )
          ?.Two_Letter_Country_Code?.toLowerCase() || undefined;

      return country;
    },
  });
};

export const useHandleApiError = (
  err,
  rejectWithValue,
  dispatch,
  showDefaultMessage = false
) => {
  if (err?.error) {
    return rejectWithValue({ error: err.error });
  }
  if (err.response?.status === 400) {
    return rejectWithValue(
      showDefaultMessage
        ? { error: 'Bad Request. Please check your inputs and try again' }
        : {
            ...(err.response.data !== ''
              ? err.response.data
              : undefined ?? {
                  error: 'Bad Request. Please check your inputs and try again',
                }),
          }
    );
  } else if (err.response?.status === 401) {
    if (dispatch) {
      dispatch(authenticationActions.logout());
    }
    return rejectWithValue(
      showDefaultMessage
        ? {
            error: 'Unauthorized Error. Please log in with valid credentials.',
          }
        : {
            ...(err.response.data !== ''
              ? err.response.data
              : undefined ?? {
                  error:
                    'Unauthorized Error. Please log in with valid credentials.',
                }),
          }
    );
  } else if (err.response?.status === 500) {
    return rejectWithValue({
      ...{
        error: 'Server error. Please try again later.',
      },
    });
  }
  return rejectWithValue(err.response?.data);
};

export const extractLatLong = (pointString) => {
  const coordinatesString = pointString.replace('POINT (', '').replace(')', '');

  const [longitude, latitude] = coordinatesString.split(' ');

  const lat = parseFloat(latitude);
  const lng = parseFloat(longitude);

  return { lat, lng };
};

export const WordCarousel = ({ words, interval, className }) => {
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    const intervalId = setInterval(() => {
      setCurrentIndex((prevIndex) => (prevIndex + 1) % words.length);
    }, interval);

    return () => clearInterval(intervalId);
  }, [words, interval]);

  return (
    <div className={`bg-inherit rotateWord ${className}`}>
      {words[currentIndex]}
    </div>
  );
};

export const BadgeWithStatus = ({
  status,
  label,
  className: customClassName,
  children,
}) => {
  let className = 'badge ';
  switch (status) {
    case 'info':
      className = 'badge badge-info ';
      break;
    case 'success':
      className = 'badge badge-success ';
      break;
    case 'warning':
      className = 'badge badge-warning ';
      break;
    case 'error':
      className = 'badge badge-error ';
      break;
    default:
      break;
  }

  return (
    <div className={className + customClassName}>
      {label}
      {children}
    </div>
  );
};

export const durationInMonth = (start, end) => {
  if (!(start && end)) return 0;
  const startDate = new Date(start);
  const endDate = new Date(end);
  const diffTime = Math.abs(endDate - startDate);
  const diffDays = Math.ceil(diffTime / (1000 * 3600 * 24));
  const diffMonths = Math.ceil(diffDays / 30);
  return diffMonths;
};

export default useHandleApiError;
