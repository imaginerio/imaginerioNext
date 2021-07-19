import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import axios from 'axios';
import useSWR from 'swr';
import { Atlas } from '@imaginerio/diachronic-atlas';
import { Box } from '@chakra-ui/react';

import Legend from '../Legend';
import Probe from '../Probe';
import OpacityControl from '../OpacityControl';
import HeadingControl from '../HeadingControl';

import mapStyle from '../../assets/style/style.json';

import { useImages } from '../../providers/ImageContext';

const fetcher = ssid => {
  if (ssid) {
    return axios
      .get(`${process.env.NEXT_PUBLIC_SEARCH_API}/document/${ssid}`)
      .then(({ data }) => data);
  }
  return { data: null };
};

const buttonPosition = {
  pos: 'absolute',
  right: '15px',
  top: '200px',
  zIndex: 9,
};

const AtlasController = ({ width, height }) => {
  const [
    {
      activeImages,
      year,
      selectedImage,
      allImages,
      showViewPoints,
      highlightedLayer,
      highlightedFeature,
      yearDragging,
    },
    dispatch,
  ] = useImages();

  const [geojson, setGeojson] = useState([]);
  const [viewCone, setViewCone] = useState(null);
  const [viewpoints, setViewpoints] = useState(activeImages.filter(i => i.collection === 'views'));
  const [featureJson, setFeatureJson] = useState(null);
  const [hoverSSID, setHoverSSID] = useState(null);
  const [probeImage, setProbeImage] = useState(null);
  const [probePosition, setProbePosition] = useState(null);
  const [opacity, setOpacity] = useState(1);
  const [heading, setHeading] = useState(0);

  const { data: hover } = useSWR(hoverSSID, fetcher);

  useEffect(() => {
    if (selectedImage) {
      axios
        .get(`${process.env.NEXT_PUBLIC_SEARCH_API}/document/${selectedImage.ssid}`)
        .then(({ data }) =>
          setViewCone({
            id: selectedImage.ssid,
            data,
            type: 'fill',
            paint: { 'fill-color': 'rgba(0,0,0,0.25)' },
          })
        );
    } else {
      setViewCone(null);
    }
  }, [selectedImage]);

  useEffect(() => {
    if (highlightedFeature) {
      axios
        .get(`${process.env.NEXT_PUBLIC_SEARCH_API}/feature/${highlightedFeature}?year=${year}`)
        .then(({ data }) => {
          let type;
          const paint = {};
          switch (data.geometry.type) {
            case 'Point':
              type = 'circle';
              break;
            case 'LineString':
            case 'MultiLineString':
              type = 'line';
              paint['line-width'] = 2;
              break;
            case 'Polygon':
            case 'MultiPolygon':
              type = 'fill';
              break;
            default:
              type = 'fill';
          }
          return setFeatureJson({ id: highlightedFeature, data, type, paint });
        });
    } else {
      setFeatureJson(null);
    }
  }, [highlightedFeature]);

  useEffect(() => {
    const newViewpoints = activeImages.filter(i => i.collection === 'views');
    if (newViewpoints.length !== viewpoints.length) {
      setViewpoints(newViewpoints);
    }
  }, [activeImages]);

  useEffect(() => {
    const geo = [];
    if (viewCone) geo.push(viewCone);
    if (featureJson) geo.push(featureJson);
    setGeojson(geo);
  }, [viewCone, featureJson]);

  useEffect(() => {
    if (hoverSSID) {
      setProbeImage(activeImages.find(i => i.ssid === hoverSSID));
    } else {
      setProbeImage(null);
    }
  }, [hoverSSID]);

  return (
    <Box>
      <Legend />
      <Atlas
        year={year}
        mapStyle={mapStyle}
        viewport={{ longitude: -43.18, latitude: -22.9, zoom: 14.5 }}
        width={width}
        height={height}
        viewpoints={showViewPoints && !yearDragging ? viewpoints : null}
        activeBasemap={selectedImage && selectedImage.collection !== 'views' && selectedImage.ssid}
        geojson={geojson}
        rasterUrl={process.env.NEXT_PUBLIC_RASTER_URL}
        basemapHandler={ssid =>
          dispatch(['SET_SELECTED_IMAGE', allImages.find(i => i.ssid === ssid)])
        }
        circleMarkers
        hover={hover}
        opacity={opacity}
        highlightedLayer={highlightedLayer}
        bearing={heading}
        hoverHandler={e => {
          if (e.features.length) {
            setProbePosition(e.center);
            setHoverSSID(e.features[0].properties.ssid);
          } else {
            setHoverSSID(null);
          }
        }}
      />
      {selectedImage && selectedImage.collection !== 'views' && (
        <OpacityControl {...buttonPosition} opacity={opacity} handler={setOpacity} />
      )}
      {viewCone && viewCone.data.features[0].properties.heading && (
        <HeadingControl
          {...buttonPosition}
          targetHeading={viewCone.data.features[0].properties.heading}
          heading={heading}
          handler={setHeading}
        />
      )}
      {probeImage && <Probe image={probeImage} pos={probePosition} />}
    </Box>
  );
};

AtlasController.propTypes = {
  width: PropTypes.number.isRequired,
  height: PropTypes.number.isRequired,
};

export default AtlasController;
