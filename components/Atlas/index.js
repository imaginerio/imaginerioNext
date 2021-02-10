import React, { useEffect, useRef, useState } from 'react';
import PropTypes from 'prop-types';
import ReactMapGL, { Source, Layer, NavigationControl, WebMercatorViewport } from 'react-map-gl';
import bbox from '@turf/bbox';

const Atlas = ({ viewport, year, geojson, activeBasemap, opacity }) => {
  const mapRef = useRef(null);

  const [mapViewport, setMapViewport] = useState(viewport);

  const setMapYear = () => {
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
  };
  useEffect(() => setMapViewport(viewport), [viewport]);
  useEffect(setMapYear, [year]);

  useEffect(() => {
    let bounds = bbox(geojson);
    bounds = [
      [bounds[0], bounds[1]],
      [bounds[2], bounds[3]],
    ];
    const { width, height } = mapViewport;
    const vp = new WebMercatorViewport({ width, height }).fitBounds(bounds);
    setMapViewport({
      ...mapViewport,
      ...vp,
      zoom: vp.zoom - 0.5,
    });
  }, [geojson]);

  const onViewportChange = nextViewport => {
    setMapViewport(nextViewport);
  };

  const onMapLoad = () => {
    setMapYear();
  };

  return (
    <ReactMapGL
      ref={mapRef}
      mapboxApiAccessToken="pk.eyJ1IjoiYXhpc21hcHMiLCJhIjoieUlmVFRmRSJ9.CpIxovz1TUWe_ecNLFuHNg"
      mapStyle="/style.json"
      width="100%"
      height="100%"
      onLoad={onMapLoad}
      onViewportChange={onViewportChange}
      {...mapViewport}
    >
      {activeBasemap && (
        <Source
          type="raster"
          tiles={[
            `https://imaginerio-rasters.s3.us-east-1.amazonaws.com/${activeBasemap}/{z}/{x}/{y}.png`,
          ]}
          scheme="tms"
        >
          <Layer
            id="overlay"
            type="raster"
            paint={{ 'raster-opacity': opacity }}
            beforeId="expressway-label"
          />
        </Source>
      )}
      {geojson && (
        <Source type="geojson" data={geojson}>
          <Layer id="selected-fill" type="fill" paint={{ 'fill-color': 'rgba(0,0,0,0.25)' }} />
          <Layer
            id="selected-case"
            type="line"
            paint={{ 'line-width': 6, 'line-color': '#eeeeee' }}
          />
          <Layer
            id="selected-line"
            type="line"
            paint={{ 'line-width': 3, 'line-color': '#000000' }}
          />
        </Source>
      )}
      <div style={{ position: 'absolute', left: 15, top: 15 }}>
        <NavigationControl />
      </div>
    </ReactMapGL>
  );
};

Atlas.propTypes = {
  viewport: PropTypes.shape({
    longitude: PropTypes.number,
    latitude: PropTypes.number,
    zoom: PropTypes.number,
    bearing: PropTypes.number,
    pitch: PropTypes.number,
  }),
  year: PropTypes.number.isRequired,
  activeBasemap: PropTypes.shape(),
  geojson: PropTypes.shape(),
  opacity: PropTypes.number,
};

Atlas.defaultProps = {
  viewport: null,
  activeBasemap: null,
  opacity: 1,
  geojson: null,
};

export default Atlas;
