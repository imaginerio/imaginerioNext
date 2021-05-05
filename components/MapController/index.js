import React from 'react';
import PropTypes from 'prop-types';
import Atlas from '@imaginerio/diachronic-atlas';

import mapStyle from '../../assets/style/style.json';

import { useImages } from '../../providers/ImageContext';

const MapController = ({ width, height }) => {
  const [{ activeImages, dates }] = useImages();

  const viewpoints = activeImages.filter(i => i.collection === 'views');

  return (
    <Atlas
      dates={dates}
      mapStyle={mapStyle}
      viewport={{ longitude: -43.18, latitude: -22.9, zoom: 10 }}
      size={{ width, height }}
      viewpoints={viewpoints}
      circleMarkers
    />
  );
};

MapController.propTypes = {
  width: PropTypes.number.isRequired,
  height: PropTypes.number.isRequired,
};

export default MapController;
