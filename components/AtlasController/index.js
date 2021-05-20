import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import axios from 'axios';
import { Atlas } from '@imaginerio/diachronic-atlas';
import { Box } from '@chakra-ui/react';

import Legend from '../Legend';

import mapStyle from '../../assets/style/style.json';

import { useImages } from '../../providers/ImageContext';

const AtlasController = ({ width, height }) => {
  const [{ activeImages, year, selectedImage, allImages }, dispatch] = useImages();
  const viewpoints = activeImages.filter(i => i.collection === 'views');

  const [geojson, setGeojson] = useState(null);
  useEffect(() => {
    if (selectedImage) {
      axios
        .get(`${process.env.NEXT_PUBLIC_SEARCH_API}/document/${selectedImage.ssid}`)
        .then(({ data }) => setGeojson(data));
    } else {
      setGeojson(null);
    }
  }, [selectedImage]);

  return (
    <Box>
      <Legend />
      <Atlas
        year={year}
        mapStyle={mapStyle}
        viewport={{ longitude: -43.18, latitude: -22.9, zoom: 10 }}
        size={{ width, height }}
        viewpoints={!selectedImage && viewpoints}
        activeBasemap={selectedImage && selectedImage.collection !== 'views' && selectedImage.ssid}
        geojson={geojson}
        rasterUrl={process.env.NEXT_PUBLIC_RASTER_URL}
        basemapHandler={ssid =>
          dispatch(['SET_SELECTED_IMAGE', allImages.find(i => i.ssid === ssid)])
        }
        circleMarkers
      />
    </Box>
  );
};

AtlasController.propTypes = {
  width: PropTypes.number.isRequired,
  height: PropTypes.number.isRequired,
};

export default AtlasController;
