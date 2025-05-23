import React, { useEffect, useState } from 'react';
import axios from 'axios';
import useSwr from 'swr';
import { sortBy } from 'lodash';
import { getLegend } from '@imaginerio/diachronic-atlas';
import { FiEye, FiXCircle } from 'react-icons/fi';
import { Box, Flex, Heading, HStack, Spacer, Spinner, Stack, Text } from '@chakra-ui/react';

import { useImages } from '../../providers/ImageContext';

import style from '../../assets/style/style.json';
import { useLocale } from '../../hooks/useLocale';

const isHighlighted = ({ layer, type }, highlightedLayer) =>
  highlightedLayer && layer === highlightedLayer.layer && type === highlightedLayer.type;

const fetcher = url => axios.get(url).then(({ data }) => data);

const LegendSwatches = () => {
  const { locale } = useLocale();
  const [legend, setLegend] = useState(null);
  const [{ year, highlightedLayer }, dispatch] = useImages();
  const { data } = useSwr(
    `${process.env.NEXT_PUBLIC_SEARCH_API}/layers?year=${year}&lang=${locale}`,
    fetcher
  );
  useEffect(() => {
    if (data) {
      setLegend(
        data.map(f => ({
          ...f,
          layers: sortBy(
            f.layers.map(layer => ({
              ...layer,
              types: layer.types.map(({ name: type, title }) => ({
                ...getLegend({ layer, type, style }),
                title,
              })),
            })),
            'title'
          ),
        }))
      );
    }
  }, [data]);

  if (!legend || !data)
    return (
      <Flex alignItems="center" justifyContent="center" h="100%">
        <Spinner size="xl" />
      </Flex>
    );

  return (
    <>
      {legend.map((folder, i) => (
        <Box key={folder.name}>
          <Heading
            as="h2"
            size="md"
            mt={i > 0 ? 10 : 'auto'}
            mb={-3}
            mx={-3}
            bg="#ccc"
            px={3}
            py={1}
            sx={{
              position: 'sticky',
              top: -5,
            }}
          >
            {folder.name}
          </Heading>
          {folder.layers.map(layer => (
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
                      dispatch([
                        'SET_HIGHLIGHTED_LAYER',
                        layerHighlighted ? null : { layer: layer.name, type: type.type },
                      ])
                    }
                  >
                    <Text
                      as="div"
                      variant="result"
                      backgroundColor={layerHighlighted ? '#666' : '#F2F2F2'}
                      color={layerHighlighted ? 'white' : 'black'}
                    >
                      {type.title}
                      <Spacer px="10px" />
                      {layerHighlighted ? <FiXCircle /> : <FiEye />}
                    </Text>
                    <Box w="40px" h="20px" {...type.swatch} />
                  </HStack>
                );
              })}
            </Stack>
          ))}
        </Box>
      ))}
    </>
  );
};

export default LegendSwatches;
