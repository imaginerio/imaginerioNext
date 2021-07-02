import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import axios from 'axios';
import useSwr from 'swr';
import { sortBy } from 'lodash';
import { getLegend } from '@imaginerio/diachronic-atlas';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faAngleRight,
  faAngleLeft,
  faBinoculars,
  faTimesCircle,
} from '@fortawesome/free-solid-svg-icons';
import { Box, Stack, HStack, Flex, Spacer, Text, Heading, Switch } from '@chakra-ui/react';

import { useImages } from '../../providers/ImageContext';

import style from '../../assets/style/style.json';

const fetcher = url => axios.get(url).then(({ data }) => data);

const isHighlighted = ({ layer, type }, highlightedLayer) =>
  highlightedLayer && layer === highlightedLayer.layer && type === highlightedLayer.type;

const Legend = ({ highlightHandler, highlightedLayer }) => {
  const [{ year, showViewPoints }, dispatch] = useImages();
  const { data } = useSwr(`${process.env.NEXT_PUBLIC_SEARCH_API}/layers?year=${year}`, fetcher);

  const [legend, setLegend] = useState(null);
  const [legendOpen, setLegendOpen] = useState(false);

  useEffect(() => {
    if (data) {
      setLegend(
        sortBy(
          data
            .filter(layer => layer.types.filter(t => t).length)
            .map(layer => ({
              ...layer,
              types: layer.types.map(type => getLegend({ layer, type, style })),
            })),
          'title'
        )
      );
    }
  }, [data]);

  return (
    <>
      <Flex
        h="40px"
        w={legendOpen ? '280px' : '200px'}
        pos="absolute"
        mt="20px"
        pl="20px"
        pr="10px"
        zIndex={9}
        backgroundColor="white"
        boxShadow="md"
        borderRadius="0 4px 4px 0"
        alignItems="center"
        onClick={() => setLegendOpen(!legendOpen)}
        cursor="pointer"
      >
        <Text>{`Map Contents: ${year}`}</Text>
        <Spacer />
        <FontAwesomeIcon icon={legendOpen ? faAngleLeft : faAngleRight} />
      </Flex>
      <Box>
        {legendOpen && legend && (
          <Box
            pos="absolute"
            h="calc(100vh - 90px)"
            w="250px"
            p="20px"
            pb="20px"
            zIndex={9}
            backgroundColor="white"
            overflow="auto"
            boxShadow="2px 0 3px rgba(0,0,0,0.15)"
          >
            <Flex alignItems="center">
              <Switch
                mr={2}
                isChecked={showViewPoints}
                onChange={() => dispatch(['TOGGLE_VIEWPOINTS'])}
              />
              <Text>Show View Points</Text>
            </Flex>
            {legend.map(layer => (
              <Stack key={layer.name}>
                <Heading size="md" mb={0} fontSize={16}>
                  {layer.title}
                </Heading>
                {layer.types.map(type => {
                  const layerHighlighted = isHighlighted(
                    { layer: layer.name, type: type.type },
                    highlightedLayer
                  );
                  return (
                    <HStack
                      key={type.type}
                      alignItems="center"
                      onClick={() =>
                        highlightHandler(
                          layerHighlighted ? null : { layer: layer.name, type: type.type }
                        )
                      }
                    >
                      <Flex
                        w="200px"
                        minH="20px"
                        px="10px"
                        py="5px"
                        backgroundColor={layerHighlighted ? '#666' : '#F2F2F2'}
                        border="1px solid #DEDEDE"
                        color={layerHighlighted ? 'white' : 'black'}
                        fontSize="15px"
                        lineHeight="18px"
                        alignItems="center"
                        borderRadius="4px"
                        cursor="pointer"
                        _hover={{
                          backgroundColor: '#CCCCCC',
                        }}
                      >
                        {type.type}
                        <Spacer px="10px" />
                        <FontAwesomeIcon icon={layerHighlighted ? faTimesCircle : faBinoculars} />
                      </Flex>
                      <Box w="40px" h="20px" {...type.swatch} />
                    </HStack>
                  );
                })}
              </Stack>
            ))}
          </Box>
        )}
      </Box>
    </>
  );
};

Legend.propTypes = {
  highlightHandler: PropTypes.func.isRequired,
  highlightedLayer: PropTypes.shape(),
};

Legend.defaultProps = {
  highlightedLayer: null,
};

export default Legend;
