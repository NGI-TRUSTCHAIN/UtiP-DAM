import React, { useEffect, useState } from 'react';
import { WEEK_DAYS_CHAR, WEEK_DAYS_SHORT } from '../../utils/Constants';

import AddButton from '../../components/buttons/AddButton';
import { FaCircleArrowDown } from 'react-icons/fa6';
import Map from 'react-map-gl';
import { RiMapPin2Fill } from 'react-icons/ri';
import SubmitButton from '../../components/buttons/SubmitButton';
import TextInput from '../../components/inputs/TextInput';
import WeekdayButton from '../../components/buttons/WeekdayButton';

const IndividualsTools = () => {
  const MAPBOX_TOKEN = process.env.REACT_APP_MAPBOX_TOKEN;

  const [days, setDays] = useState([]);

  useEffect(() => {
    setDays(WEEK_DAYS_CHAR.map((i) => false));
  }, []);

  return (
    <div>
      <div
        name="check anonymity floater"
        className="z-40 animate-raise bg-white-900 absolute top-[15%] right-10 my-0 w-96 h-2/3 rounded-lg shadow-secondary-900 shadow-lg px-4 py-6 text-center overflow-clip">
        <div className="text-xl font-bold">Anonymity Verification</div>
        <p className="text-gray-700 text-xs mt-3 leading-4 font-medium">
          Input a typical journey's start and end points below to check if your
          identity may be exposed in a mobility dataset
        </p>
        <div
          name="start-end-inputs"
          className="mt-6 leading-7 flex flex-col gap-3 justify-around items-center">
          <span>
            <FaCircleArrowDown className="inline-flex p-1 mb-2 mr-2 text-2xl ring-2 ring-opacity-60 text-sky-950 border rounded-full border-primary bg-sky-300 bg-opacity-55" />
            <TextInput placeholder="Start point" />
          </span>
          <span>
            <RiMapPin2Fill className="inline-flex p-1 mb-2 mr-2 text-2xl ring-2 ring-opacity-60 text-sky-950 border rounded-full border-primary bg-sky-400 bg-opacity-55" />
            <TextInput placeholder="End point" />
          </span>

          <AddButton onClick={() => {}}>Add a location</AddButton>
        </div>
        <div
          name="anonymity-bottom"
          className="flex flex-col justify-between items-center">
          <div className="text-base font-semibold text-center">Schedule</div>
          <div className="text-text-muted text-center text-xs mb-3 leading-6">
            Select the days of the week that match this journey
          </div>
          <div
            name="days-week-icon-buttons"
            className="flex gap-1 justify-center">
            {WEEK_DAYS_CHAR.map((day, i) => (
              <WeekdayButton
                key={i}
                tooltip={WEEK_DAYS_SHORT[i]}
                onClick={() => {
                  let daysUpdated = days.toSpliced(i, 1, !days[i]);
                  setDays(daysUpdated);
                }}
                value={day}
                active={days[i]}>
                {day}
              </WeekdayButton>
            ))}
          </div>
          <SubmitButton
            customCss="animate-[bounce_2s_infinite] hover:animate-none"
            onClick={() => {}}>
            Check Anonymity
          </SubmitButton>
        </div>
      </div>
      <div name="map" className="main-content min-h-100 px-2 w-full">
        <Map
          reuseMaps
          mapLib={import('mapbox-gl')}
          initialViewState={{
            latitude: 37.805,
            longitude: -122.447,
            zoom: 15,
          }}
          style={{ width: '100%', height: 500 }}
          mapStyle="mapbox://styles/thanda/cls9ysuhd00fw01r61db241tl"
          styleDiffing
          mapboxAccessToken={MAPBOX_TOKEN}
          attributionControl={false}
        />
      </div>
    </div>
  );
};

export default IndividualsTools;
