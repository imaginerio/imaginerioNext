import React, { useState, useEffect } from 'react';
import axios from 'axios';
import useSwr from 'swr';
import { getLegend } from '@imaginerio/diachronic-atlas';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faAngleRight, faBinoculars } from '@fortawesome/free-solid-svg-icons';
import { Box, Stack, HStack, Flex, Spacer, Text, Button, Heading } from '@chakra-ui/react';

import { useImages } from '../../providers/ImageContext';

import style from '../../assets/style/style.json';

const fetcher = url => axios.get(url).then(({ data }) => data);

const Legend = () => {
  const [{ year }] = useImages();
  const { data } = useSwr(`${process.env.NEXT_PUBLIC_SEARCH_API}/layers?year=${year}`, fetcher);

  const [legend, setLegend] = useState(null);

  useEffect(() => {
    if (data) {
      setLegend(
        data.map(layer => ({
          ...layer,
          types: layer.types.map(type => getLegend({ layer, type, style })),
        }))
      );
    }
  }, [data]);

  return (
    <>
      <Flex
        h="40px"
        w="200px"
        pos="absolute"
        mt="20px"
        pl="20px"
        pr="10px"
        zIndex={9}
        backgroundColor="white"
        boxShadow="sm"
        borderRadius="0 4px 4px 0"
        alignItems="center"
      >
        <Text>{`Map Contents: ${year}`}</Text>
        <Spacer />
        <FontAwesomeIcon icon={faAngleRight} />
      </Flex>
      <Box>
        {legend && (
          <Box
            pos="absolute"
            h="calc(100vh - 90px)"
            px="20px"
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
                    <Button
                      h="30px"
                      w="200px"
                      justifyContent="flex-start"
                      backgroundColor="#F2F2F2"
                      border="1px solid #DEDEDE"
                      color="black"
                    >
                      {type.type}
                      <Spacer />
                      <FontAwesomeIcon icon={faBinoculars} />
                    </Button>
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
