import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import axios from 'axios';
import { useRouter } from 'next/router';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowLeft } from '@fortawesome/pro-light-svg-icons';
import { faSearch, faVectorSquare, faBullseyePointer } from '@fortawesome/pro-regular-svg-icons';
import {
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
} from '@chakra-ui/react';

import { useImages } from '../../providers/ImageContext';
import useDebouncedEffect from '../../utils/useDebouncedEffect';

import SearchResults from './SearchResults';
import translations from '../../assets/config/translations';

const MapSearch = ({ handler }) => {
  const { locale } = useRouter();
  const [{ year, drawSearch, drawSearchCoords }, dispatch] = useImages();
  const [string, setString] = useState('');
  const [searchResults, setSearchResults] = useState(null);
  const [searchActive, setSearchActive] = useState(false);
  const [drawToggle, setDrawToggle] = useState(drawSearch);
  const [clickSearch, setClickSearch] = useState(true);

  useDebouncedEffect(
    () => {
      if (string.length > 2) {
        return axios
          .get(`${process.env.NEXT_PUBLIC_SEARCH_API}/search?text=${string}&year=${year}`)
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
      axios.get(`${process.env.NEXT_PUBLIC_SEARCH_API}/probe/features/${drawSearchCoords.join(',')}?year=${year}`)
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
              <FontAwesomeIcon
                icon={faArrowLeft}
                onClick={() => {
                  handler(false);
                  setString('');
                }}
                style={{ cursor: 'pointer' }}
              />
            ) : (
              <FontAwesomeIcon icon={faSearch} />
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
        <IconButton
          variant={drawSearch ? null : 'outline'}
          colorScheme="blackAlpha"
          color="black"
          border="none"
          icon={<FontAwesomeIcon icon={faBullseyePointer} />}
          onClick={() => setDrawToggle(!drawToggle)}
        />
      </HStack>
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
              leftIcon={<FontAwesomeIcon icon={faBullseyePointer} />}
              isActive={clickSearch}
              onClick={() => setClickSearch(true)}
            >
              Search by click
            </Button>
            <Button
              size="sm"
              color="black"
              leftIcon={<FontAwesomeIcon icon={faVectorSquare} />}
              isActive={!clickSearch}
              onClick={() => setClickSearch(false)}
            >
              Search by box
            </Button>
          </Stack>
          {!searchResults && (
            <Heading size="sm" textAlign="center" mt={30} fontSize={18} lineHeight={1.5} px={2}>
              {`Click${
                clickSearch ? '' : ' and drag'
              } on the map to draw a search area to identify features.`}
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
