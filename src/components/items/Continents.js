/* eslint-disable import/no-webpack-loader-syntax */

import { FaEarthAsia, FaEarthEurope } from 'react-icons/fa6';
import {
  GiAntarctica,
  GiEarthAfricaEurope,
  GiEarthAmerica,
  GiEarthAsiaOceania,
} from 'react-icons/gi';
import React, { useMemo } from 'react';

import { CONTINENTS } from '../../utils/Constants';
import { IconContext } from 'react-icons';
import Papa from 'papaparse';
import csv from '!!raw-loader!../../assets/docs/countries-data.csv';

const icons = [
  FaEarthEurope,
  FaEarthAsia,
  GiEarthAmerica,
  GiEarthAmerica,
  GiEarthAsiaOceania,
  GiEarthAfricaEurope,
  GiAntarctica,
];

const Continents = ({ onSelect, selectedValue }) => {
  const iconContextValue = useMemo(() => {
    return { size: '1.7em' };
  }, []);

  const extractCountries = (continent) => {
    Papa.parse(csv, {
      header: true,
      complete: function (results) {
        let countries = results.data
          .filter(
            (item) =>
              item.Continent_Name.toLowerCase() === continent.toLowerCase()
          )
          ?.map((i) => {
            return { countryCode: i.Two_Letter_Country_Code.toLowerCase() };
          });
        onSelect({ continent: continent, countries });
      },
    });
  };

  return (
    <IconContext.Provider value={iconContextValue}>
      {CONTINENTS.map((item, idx) => {
        const Icon = icons[idx];
        return (
          <button
            key={idx}
            className={`btn btn-ghost btn-sm ${selectedValue === item ? 'bg-primary/70 text-white' : 'bg-neutral text-secondary-500/90'}  font-normal text-xs rounded-lg hover:bg-white hover:text-secondary-500 hover:ring-2 hover:ring-primary/70`}
            onClick={() => {
              extractCountries(item);
            }}>
            <Icon />
            {item}
          </button>
        );
      })}
    </IconContext.Provider>
  );
};

export default Continents;
