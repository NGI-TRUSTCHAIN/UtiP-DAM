import { MapContainer, Marker, TileLayer } from 'react-leaflet';
import React, { useEffect, useRef, useState } from 'react';
import { getMapBounds, getMapCenter } from '../utils/Helper';

import { MdClose } from 'react-icons/md';
import ReactDOMServer from 'react-dom/server';
import { TbCapture } from 'react-icons/tb';
import { divIcon } from 'leaflet';

const LocationsMap = ({ coordinates, onLocationSelect }) => {
  const mapRef = useRef(null);
  const [locations, setLocations] = useState([]);
  const [mapCenter, setMapCenter] = useState(null);
  const [bounds, setBounds] = useState([]);
  const [badges, setBadges] = useState([]);

  useEffect(() => {
    setLocations(
      coordinates.map((i) => {
        return { ...i };
      })
    );
    const tmp = coordinates.map((item) => {
      return [item.lat, item.lng];
    });
    const bounds = getMapBounds(tmp);
    const center = getMapCenter(coordinates);
    setMapCenter(center);
    setBounds(bounds);
  }, [coordinates]);

  useEffect(() => {
    onLocationSelect(
      badges.map((id) => {
        return { id, name: locations.find((i) => i.id === id)?.name || '' };
      })
    );
  }, [badges, locations]);

  const handleLocationClick = (selectedItem) => {
    //* ADD ONLY IF the last one in the array is not the clicked marker
    if (badges[badges.length - 1] !== selectedItem.id) {
      setBadges([...Array.from([...badges]), selectedItem.id]);
    }
  };

  // Function to handle deleting a badge
  const handleDelete = (deleteIndex) => {
    const tempBadges = [...badges];
    tempBadges.splice(deleteIndex, 1);
    setBadges(tempBadges);
  };

  const handleRecenterClick = () => {
    if (mapRef.current) {
      mapRef.current.target.fitBounds(bounds);
    }
  };
  const renderBadges = () => {
    return badges.map((id, index) => (
      <div
        key={index}
        className="inline-flex items-center rounded-md bg-blue-50 px-2 py-1 text-xs font-medium text-blue-700 ring-1 ring-inset ring-blue-700/10"
        onClick={() => handleDelete(index)}>
        {id}
        <span
          className="ml-1 cursor-pointer"
          onClick={() => handleDelete(index)}>
          <MdClose />
        </span>
      </div>
    ));
  };

  return locations.length > 0 ? (
    <>
      <div className="flex flex-wrap gap-1 mb-2 mt-[-0.5rem] border-b py-1">
        {renderBadges()}
      </div>
      <div className="border border-primary/40 rounded">
        <MapContainer
          center={mapCenter}
          bounds={bounds}
          className="map-container"
          whenReady={(map) => {
            mapRef.current = map;
          }}>
          <TileLayer
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />
          {locations.map((location, index) => (
            <Marker
              key={index}
              position={[location.lat, location.lng]}
              eventHandlers={{
                click: (e) => handleLocationClick(location, e),
              }}
              icon={divIcon({
                className: 'custom-div-icon',
                iconAnchor: [10, 10],
                html: ReactDOMServer.renderToString(
                  <div className="btn-sm custom-div-icon">
                    <div
                      className={`${badges.includes(location.id) > 0 ? 'location-point-selected' : 'location-point'}`}></div>
                    <span
                      className={`${badges.includes(location.id) ? 'text-amber-700 font-bold' : undefined} text-ellipsis text-xs line-clamp-1`}>
                      {location.id}: {location.name}
                    </span>
                  </div>
                ),
              })}
            />
          ))}
          <button
            className="btn btn-ghost btn-sm z-[999] absolute right-4 top-2 w-fit px-2 py-1 text-xs"
            onClick={handleRecenterClick}>
            <TbCapture size={20} />
            Recenter
          </button>
        </MapContainer>
      </div>
    </>
  ) : (
    <div
      name="no-locations-message"
      className="h-20 w-full inline-flex justify-center items-center">
      No locations are provided for this dataset
    </div>
  );
};

export default LocationsMap;
