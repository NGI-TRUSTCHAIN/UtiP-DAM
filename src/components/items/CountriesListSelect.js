/* eslint-disable import/no-webpack-loader-syntax */

import React, { useEffect, useState } from 'react';

import Papa from 'papaparse';
import csv from '!!raw-loader!../../assets/docs/countries-data.csv';

const CountriesListSelect = ({
  onSelect,
  selectedValue,
  disabled,
  className,
}) => {
  const [countries, setCountries] = useState([]);

  useEffect(() => {
    getCountries();
  }, []);

  const getCountries = () => {
    Papa.parse(csv, {
      header: true,
      complete: function (results) {
        let tmp = results.data?.map((i) => {
          return i;
        });
        setCountries(tmp);
      },
    });
  };

  return (
    <select
      name="bank_country"
      value={selectedValue}
      onChange={onSelect}
      className={className ?? 'select select-bordered mb-2 text-sm'}
      disabled={disabled}>
      {countries.map((item, idx) => (
        <option key={idx}>{item.Country_Name}</option>
      ))}
    </select>
  );
};

export default CountriesListSelect;
