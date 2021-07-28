import React, { useState } from 'react';
import { useRouter } from 'next/router';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faAngleRight, faAngleLeft } from '@fortawesome/pro-regular-svg-icons';
import { Box, Flex, Spacer, Text, Switch } from '@chakra-ui/react';

import { useImages } from '../../providers/ImageContext';

import LegendSwatches from './LegendSwatches';
import MapSearch from '../MapSearch';
import translations from '../../assets/config/translations';

const Legend = () => {
  const { locale } = useRouter();
  const [{ year, showViewPoints, drawSearch }, dispatch] = useImages();
  const [legendOpen, setLegendOpen] = useState(false);
  const [searchResultsActive, setSearchResultsActive] = useState(false);

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
        <Text>{`${translations.mapContents[locale]} ${year}`}</Text>
        <Spacer />
        <FontAwesomeIcon icon={legendOpen ? faAngleLeft : faAngleRight} />
      </Flex>
      <Box>
        {legendOpen && (
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
            <MapSearch handler={setSearchResultsActive} />
            {!searchResultsActive && !drawSearch && (
              <>
                <Flex alignItems="center" mt={2}>
                  <Switch
                    mr={2}
                    isChecked={showViewPoints}
                    onChange={() => dispatch(['TOGGLE_VIEWPOINTS'])}
                  />
                  <Text>{translations.showViews[locale]}</Text>
                </Flex>
                <LegendSwatches />
              </>
            )}
          </Box>
        )}
      </Box>
    </>
  );
};

export default Legend;
