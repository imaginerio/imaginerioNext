import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import axios from 'axios';
import { useRouter } from 'next/router';
import { FiArrowLeft, FiSearch, FiSquare, FiTarget, FiXCircle } from 'react-icons/fi';
import {
  Box,
  InputGroup,
  Input,
  InputLeftElement,
  Stack,
  HStack,
  Flex,
  Spinner,
  Heading,
  IconButton,
  Button,
  Tooltip,
} from '@chakra-ui/react';

import { useImages } from '../../providers/ImageContext';
import useDebouncedEffect from '../../utils/useDebouncedEffect';

import SearchResults from './SearchResults';
import translations from '../../assets/config/translations';

const MapSearch = ({ handler }) => {
  const { locale, query } = useRouter();
  const [{ year, drawSearch, drawSearchCoords, highlightedFeature }, dispatch] = useImages();

  const [string, setString] = useState(query.feature || '');
  const [searchResults, setSearchResults] = useState(null);
  const [searchActive, setSearchActive] = useState(false);
  const [drawToggle, setDrawToggle] = useState(drawSearch);
  const [clickSearch, setClickSearch] = useState(true);

  useDebouncedEffect(
    () => {
      if (string.length > 2) {
        return axios
          .get(
            `${process.env.NEXT_PUBLIC_SEARCH_API}/search?text=${string}&year=${year}&lang=${locale}`
          )
          .then(({ data }) => setSearchResults({ features: data, views: [] }));
      }
      return Promise.resolve(null);
    },
    [string],
    500
  );

  useEffect(() => {
    if (drawSearchCoords) {
      // eslint-disable-next-line prettier/prettier
      axios.get(`${process.env.NEXT_PUBLIC_SEARCH_API}/probe/features/${drawSearchCoords.join(',')}?year=${year}&lang=${locale}`)
        .then(({ data: features }) =>
          // eslint-disable-next-line prettier/prettier
          axios.get(`${process.env.NEXT_PUBLIC_SEARCH_API}/probe/views/${drawSearchCoords.join(',')}?year=${year}`)
            .then(({ data: views }) => setSearchResults({ features, views }))
        );
    }
  }, [drawSearchCoords]);

  useEffect(() => {
    setSearchActive(Boolean(string));
    setSearchResults(null);
    if (string) {
      setDrawToggle(false);
    }
  }, [string]);

  useEffect(() => {
    const searchType = clickSearch ? 'click' : 'box';
    dispatch(['SET_DRAW_SEARCH', drawToggle ? searchType : null]);
    setSearchResults(null);
    if (drawToggle) {
      setString('');
    }
  }, [drawToggle, clickSearch]);

  useEffect(() => handler(searchActive), [searchActive]);

  return (
    <>
      <HStack ml="-10px">
        <InputGroup>
          <InputLeftElement>
            {searchActive ? (
              <FiArrowLeft
                onClick={() => {
                  handler(false);
                  setString('');
                }}
                style={{ cursor: 'pointer' }}
              />
            ) : (
              <FiSearch />
            )}
          </InputLeftElement>
          <Input
            placeholder={translations.searchName[locale]}
            value={string}
            onChange={e => setString(e.target.value)}
            border="none"
            _focus={{ border: 'none' }}
          />
        </InputGroup>
        <Tooltip label={translations.searchMap[locale]}>
          <IconButton
            variant={drawSearch ? null : 'outline'}
            colorScheme="blackAlpha"
            color="black"
            border="none"
            icon={<FiTarget />}
            onClick={() => setDrawToggle(!drawToggle)}
          />
        </Tooltip>
      </HStack>
      {highlightedFeature && (
        <Box
          w="250px"
          pos="fixed"
          bottom="0"
          py={4}
          px="20px"
          mx="-20px"
          bg="white"
          boxShadow="0px -1px 5px 1px #ccc"
        >
          <Button
            isFullWidth
            variant="outline"
            borderColor="#ccc"
            bg="white"
            size="sm"
            leftIcon={<FiXCircle />}
            onClick={() => dispatch(['SET_HIGHLIGHTED_FEATURE', null])}
          >
            Clear highlighted feature
          </Button>
        </Box>
      )}
      {searchActive && !searchResults && (
        <Flex alignItems="center" justifyContent="center" mt={100}>
          <Spinner size="xl" />
        </Flex>
      )}
      {searchActive && searchResults && searchResults.length === 0 && (
        <Heading size="sm" textAlign="center" mt={30} fontSize={18} lineHeight={1.5} px={2}>
          {`${translations.noResults[locale]} "${string}" ${year}. ${translations.tryAgain[locale]}.`}
        </Heading>
      )}
      {drawSearch && (
        <>
          <Stack mt={2}>
            <Button
              size="sm"
              color="black"
              leftIcon={<FiTarget />}
              isActive={clickSearch}
              onClick={() => setClickSearch(true)}
            >
              {translations.searchClick[locale]}
            </Button>
            <Button
              size="sm"
              color="black"
              leftIcon={<FiSquare />}
              isActive={!clickSearch}
              onClick={() => setClickSearch(false)}
            >
              {translations.searchBox[locale]}
            </Button>
          </Stack>
          {!searchResults && (
            <Heading size="sm" textAlign="center" mt={30} fontSize={18} lineHeight={1.5} px={2}>
              {clickSearch
                ? translations.searchClickInstructions[locale]
                : translations.searchBoxInstructions[locale]}
            </Heading>
          )}
        </>
      )}
      {searchActive &&
        searchResults &&
        searchResults.features.length === 0 &&
        searchResults.views.length === 0 && (
          <Heading size="sm" textAlign="center" mt={30} fontSize={18} lineHeight={1.5} px={2}>
            {`${translations.noResults[locale]} "${string}" ${year}. ${translations.tryAgain[locale]}.`}
          </Heading>
        )}
      {drawSearch && !searchResults && (
        <Heading size="sm" textAlign="center" mt={30} fontSize={18} lineHeight={1.5} px={2}>
          {`${translations.noResults[locale]} ${year}. ${translations.tryAgain[locale]}.`}
        </Heading>
      )}
      {drawSearch &&
        searchResults &&
        searchResults.features.length === 0 &&
        searchResults.views.length === 0 && (
          <Heading size="sm" textAlign="center" mt={30} fontSize={18} lineHeight={1.5} px={2}>
            {`${translations.noResults[locale]} ${year}. ${translations.tryAgain[locale]}.`}
          </Heading>
        )}
      {searchResults && (searchResults.features.length || searchResults.views.length) && (
        <SearchResults results={searchResults} />
      )}
    </>
  );
};

MapSearch.propTypes = {
  handler: PropTypes.func.isRequired,
};

export default MapSearch;
