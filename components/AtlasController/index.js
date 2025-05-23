import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import axios from 'axios';
import useSWR from 'swr';
import { useRouter } from 'next/router';
import { flatten } from 'lodash';
import { Atlas } from '@imaginerio/diachronic-atlas';
import { Box, Checkbox, HStack, Text } from '@chakra-ui/react';

import Legend from '../Legend';
import Probe from '../Probe';
import OpacityControl from '../OpacityControl';
import HeadingControl from '../HeadingControl';
import ViewControl from '../ViewControl';

import mapStyle from '../../assets/style/style.json';

import { useImages } from '../../providers/ImageContext';
import useDebouncedEffect from '../../utils/useDebouncedEffect';
import translation from '../../assets/config/translations';
import { useLocale } from '../../hooks/useLocale';

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
  top: '240px',
  zIndex: 9,
};

const AtlasController = ({ width, height, mobile }) => {
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
      drawSearch,
      mapBounds,
    },
    dispatch,
  ] = useImages();

  const router = useRouter();
  const { locale } = useLocale();
  useEffect(() => {
    const hash = router.asPath.split('#')[1];
    if (hash) {
      const newImage = allImages.find(image => image.ssid === hash);
      if (newImage) {
        dispatch(['SET_SELECTED_IMAGE', newImage]);
      }
    }
  }, []);

  const [geojson, setGeojson] = useState([]);
  const [viewCone, setViewCone] = useState(null);
  const [viewpoints, setViewpoints] = useState(activeImages.filter(i => i.collection === 'views'));
  const [featureJson, setFeatureJson] = useState(null);
  const [hoverSSID, setHoverSSID] = useState(null);
  const [probeImage, setProbeImage] = useState(null);
  const [probePosition, setProbePosition] = useState(null);
  const [opacity, setOpacity] = useState(1);
  const [heading, setHeading] = useState(0);
  const [searchMove, setSearchMove] = useState(false);
  const [mapBBox, setMapBBox] = useState(null);

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
            paint: {
              'fill-color':
                selectedImage.collection === 'views' ? 'rgba(0,0,0,0.25)' : 'rgba(0,0,0,0)',
            },
          })
        );
      router.replace(`${router.basePath}#${selectedImage.ssid}`);
    } else {
      setViewCone(null);
      if (router.basePath) {
        router.replace(router.basePath);
      }
    }
  }, [selectedImage]);

  useEffect(() => {
    if (highlightedFeature) {
      axios
        .get(`${process.env.NEXT_PUBLIC_SEARCH_API}/feature/${highlightedFeature}?year=${year}`)
        .then(({ data }) => {
          let geometry = data.geometry.type;
          if (geometry === 'GeometryCollection') geometry = data.geometry.geometries[0].type;
          let type;
          const paint = {};
          switch (geometry) {
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
              paint['fill-color'] = 'rgba(0,0,0,0.5)';
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

  useDebouncedEffect(
    () => {
      if (searchMove) {
        dispatch(['SET_MAP_BOUNDS', mapBBox]);
      } else if (mapBounds) {
        dispatch(['SET_MAP_BOUNDS', null]);
      }
    },
    [searchMove, mapBBox],
    500
  );

  return (
    <Box>
      <Legend />
      <Atlas
        year={year}
        mapStyle={mapStyle}
        viewport={{
          longitude: !Number.isNaN(parseFloat(router.query.lng)) ? +router.query.lng : -43.18,
          latitude: !Number.isNaN(parseFloat(router.query.lat)) ? +router.query.lat : -22.9,
          zoom: !Number.isNaN(parseFloat(router.query.zoom)) ? +router.query.zoom : 14.5,
        }}
        width={width}
        height={height}
        viewpoints={showViewPoints && !yearDragging ? viewpoints : null}
        activeBasemap={selectedImage && selectedImage.collection !== 'views' && selectedImage.ssid}
        geojson={geojson}
        rasterUrl={process.env.NEXT_PUBLIC_RASTER_URL}
        basemapHandler={ssid => {
          if (mobile) {
            window.open(`/iconography/views/${ssid}`);
          } else {
            dispatch(['SET_SELECTED_IMAGE', allImages.find(i => i.ssid === ssid)]);
          }
        }}
        loadHandler={() => dispatch(['SET_SHOW_INTRO', true])}
        circleMarkers
        hover={hover}
        opacity={opacity}
        highlightedLayer={highlightedLayer}
        bearing={heading}
        isDrawing={drawSearch === 'box'}
        drawBoxHandler={e => dispatch(['SET_DRAW_SEARCH_COORDS', flatten(e)])}
        clickHandler={e => {
          if (drawSearch === 'click') dispatch(['SET_DRAW_SEARCH_COORDS', e]);
        }}
        showSatellite={year === new Date().getFullYear()}
        maxZoom={18}
        hoverHandler={e => {
          if (e.features.length && !mobile) {
            setProbePosition(e.center);
            setHoverSSID(e.features[0].properties.ssid);
          } else {
            setHoverSSID(null);
          }
        }}
        bboxHandler={setMapBBox}
      />
      {!mobile && (
        <HStack
          pos="absolute"
          top="105px"
          right="55px"
          zIndex={9}
          bgColor="white"
          p={2}
          borderRadius={4}
          boxShadow="sm"
          onClick={() => setSearchMove(!searchMove)}
          cursor="pointer"
        >
          <Checkbox isChecked={searchMove} pointerEvents="none" />
          <Text>{translation.searchMoves[locale]}</Text>
        </HStack>
      )}
      <ViewControl
        {...buttonPosition}
        handler={() => dispatch(['TOGGLE_VIEWPOINTS'])}
        show={showViewPoints}
        top="200px"
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
  mobile: PropTypes.bool,
};

AtlasController.defaultProps = {
  mobile: false,
};

export default AtlasController;
