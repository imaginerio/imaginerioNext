import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import axios from 'axios';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowLeft } from '@fortawesome/pro-light-svg-icons';
import { faSearch, faVectorSquare } from '@fortawesome/pro-regular-svg-icons';

import {
  InputGroup,
  Input,
  InputLeftElement,
  HStack,
  Flex,
  Spinner,
  Heading,
} from '@chakra-ui/react';

import { useImages } from '../../providers/ImageContext';
import useDebouncedEffect from '../../utils/useDebouncedEffect';

import SearchResults from './SearchResults';

const MapSearch = ({ handler }) => {
  const [{ year }] = useImages();
  const [string, setString] = useState('');
  const [searchResults, setSearchResults] = useState(null);
  const [searchActive, setSearchActive] = useState(false);

  useDebouncedEffect(
    () => {
      if (string.length > 2) {
        return axios
          .get(`${process.env.NEXT_PUBLIC_SEARCH_API}/search?text=${string}&year=${year}`)
          .then(({ data }) => setSearchResults(data));
      }
      return Promise.resolve(null);
    },
    [string],
    500
  );
  useEffect(() => {
    setSearchActive(Boolean(string));
    setSearchResults(null);
  }, [string]);
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
            placeholder="Search map..."
            value={string}
            onChange={e => setString(e.target.value)}
            border="none"
            _focus={{ border: 'none' }}
          />
        </InputGroup>
        <FontAwesomeIcon icon={faVectorSquare} />
      </HStack>
      {searchActive && !searchResults && (
        <Flex alignItems="center" justifyContent="center" mt={100}>
          <Spinner size="xl" />
        </Flex>
      )}
      {searchResults && searchResults.length > 0 && <SearchResults results={searchResults} />}
      {searchActive && searchResults && searchResults.length === 0 && (
        <Heading size="sm" textAlign="center" mt={30} fontSize={18} lineHeight={1.5} px={2}>
          {`No results found for "${string}" in ${year}. Please try your search again.`}
        </Heading>
      )}
    </>
  );
};

MapSearch.propTypes = {
  handler: PropTypes.func.isRequired,
};

export default MapSearch;
