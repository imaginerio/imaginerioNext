import React, { useState, useEffect } from 'react';
import axios from 'axios';
import useSwr from 'swr';
import { sortBy } from 'lodash';
import { getLegend } from '@imaginerio/diachronic-atlas';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faAngleRight, faAngleLeft, faBinoculars } from '@fortawesome/free-solid-svg-icons';
import { Box, Stack, HStack, Flex, Spacer, Text, Heading } from '@chakra-ui/react';

import { useImages } from '../../providers/ImageContext';

import style from '../../assets/style/style.json';

const fetcher = url => axios.get(url).then(({ data }) => data);

const Legend = () => {
  const [{ year }] = useImages();
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
            px="20px"
            pb="20px"
            zIndex={9}
            backgroundColor="white"
            overflow="auto"
            boxShadow="2px 0 3px rgba(0,0,0,0.15)"
          >
            {legend.map(layer => (
              <Stack key={layer.name}>
                <Heading size="md" mb={0} fontSize={16}>
                  {layer.title}
                </Heading>
                {layer.types.map(type => (
                  <HStack key={type.type} alignItems="center">
                    <Flex
                      w="200px"
                      minH="20px"
                      px="10px"
                      py="5px"
                      backgroundColor="#F2F2F2"
                      border="1px solid #DEDEDE"
                      color="black"
                      fontSize="15px"
                      lineHeight="18px"
                      alignItems="center"
                      borderRadius="4px"
                    >
                      {type.type}
                      <Spacer px="10px" />
                      <FontAwesomeIcon icon={faBinoculars} />
                    </Flex>
                    <Box w="40px" h="20px" {...type.swatch} />
                  </HStack>
                ))}
              </Stack>
            ))}
          </Box>
        )}
      </Box>
    </>
  );
};

export default Legend;
