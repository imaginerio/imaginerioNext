import React, { useEffect, useRef, useState } from 'react';
import PropTypes from 'prop-types';
import ReactMapGL, { Source, Layer } from 'react-map-gl';

const Atlas = ({ year, latitude, longitude, activeBasemap }) => {
  const mapRef = useRef(null);
  const [viewport, setViewport] = useState({
    width: '100vw',
    height: '100vh',
    latitude: -22.951697,
    longitude: -43.210244,
    zoom: 12,
  });

  useEffect(() => {
    const map = mapRef.current.getMap();
    let style = null;
    try {
      style = map.getStyle();
    } catch (err) {
      style = null;
    } finally {
      if (style) {
        style.layers = style.layers.map(layer => {
          if (layer.source === 'composite') {
            const filter =
              layer.filter && layer.filter[1][0] === 'match' ? layer.filter.slice(0, 2) : ['all'];
            return {
              ...layer,
              filter: [
                ...filter,
                ['<=', ['get', 'firstyear'], year],
                ['>=', ['get', 'lastyear'], year],
              ],
            };
          }
          return layer;
        });
        map.setStyle(style);
      }
    }
  });

  return (
    <ReactMapGL
      ref={mapRef}
      {...viewport}
      mapboxApiAccessToken="pk.eyJ1IjoiYXhpc21hcHMiLCJhIjoieUlmVFRmRSJ9.CpIxovz1TUWe_ecNLFuHNg"
      mapStyle="/style.json"
      width="100%"
      height="100%"
      onViewportChange={nextViewport => setViewport(nextViewport)}
    >
      {activeBasemap && (
        <Source
          type="raster"
          tiles={[
            `https://imaginerio-rasters.s3.us-east-1.amazonaws.com/${activeBasemap.ssid}/{z}/{x}/{y}.png`,
          ]}
          scheme="tms"
        >
          <Layer id="overlay" type="raster" paint={{ 'raster-opacity': 0.5 }} />
        </Source>
      )}
    </ReactMapGL>
  );
};

Atlas.propTypes = {
  year: PropTypes.number.isRequired,
  scrollZoom: PropTypes.bool,
  disabledLayers: PropTypes.arrayOf(PropTypes.string),
  activeBasemap: PropTypes.shape(),
  selectedFeature: PropTypes.shape({
    layerid: PropTypes.number.isRequired,
    objectid: PropTypes.number.isRequired,
  }),
  opacity: PropTypes.number,
};

Atlas.defaultProps = {
  scrollZoom: true,
  disabledLayers: [],
  activeBasemap: null,
  selectedFeature: null,
  opacity: 1,
};

export default Atlas;
