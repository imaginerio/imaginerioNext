import React from 'react';
import PropTypes from 'prop-types';
import { Atlas } from '@imaginerio/diachronic-atlas';
import mapStyle from '../../assets/style/style.json';

const AtlasSingle = ({ year, geojson, activeBasemap, width, height, viewport }) => (
  <Atlas
    year={year}
    geojson={geojson}
    activeBasemap={activeBasemap}
    width={width}
    height={height}
    mapStyle={mapStyle}
    viewport={viewport}
    rasterUrl={process.env.NEXT_PUBLIC_RASTER_URL}
  />
);

AtlasSingle.propTypes = {
  year: PropTypes.number.isRequired,
  geojson: PropTypes.shape().isRequired,
  activeBasemap: PropTypes.string,
  width: PropTypes.number.isRequired,
  height: PropTypes.number.isRequired,
  viewport: PropTypes.shape().isRequired,
};

AtlasSingle.defaultProps = {
  activeBasemap: null,
};

export default AtlasSingle;
