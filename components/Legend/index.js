import React, { useState } from 'react';
import { useRouter } from 'next/router';
import { FiChevronLeft, FiChevronRight } from 'react-icons/fi';
import { Box, Flex, Spacer, Text } from '@chakra-ui/react';

import { useImages } from '../../providers/ImageContext';

import LegendSwatches from './LegendSwatches';
import MapSearch from '../MapSearch';
import translations from '../../assets/config/translations';
import { useLocale } from '../../hooks/useLocale';

const Legend = () => {
  const { query } = useRouter();
  const { locale } = useLocale();
  const [{ year, drawSearch, highlightedFeature }] = useImages();
  const [legendOpen, setLegendOpen] = useState(Boolean(query.feature));
  const [searchResultsActive, setSearchResultsActive] = useState(Boolean(query.feature));

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
        className="intro___atlas___legend"
      >
        <Text>{`${translations.mapContents[locale]} ${year}`}</Text>
        <Spacer />
        {legendOpen ? <FiChevronLeft /> : <FiChevronRight />}
      </Flex>
      <Box>
        {legendOpen && (
          <Box
            pos="absolute"
            h="calc(100vh - 90px)"
            w="250px"
            zIndex={9}
            backgroundColor="white"
            boxShadow="2px 0 3px rgba(0,0,0,0.15)"
          >
            <Box h={`calc(100vh - ${highlightedFeature ? 155 : 90}px)`} overflow="auto" p="20px">
              <MapSearch handler={setSearchResultsActive} />
              {!searchResultsActive && !drawSearch && <LegendSwatches />}
            </Box>
          </Box>
        )}
      </Box>
    </>
  );
};

export default Legend;
