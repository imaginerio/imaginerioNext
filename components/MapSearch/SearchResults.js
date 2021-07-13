import React from 'react';
import PropTypes from 'prop-types';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faBinoculars, faTimesCircle } from '@fortawesome/pro-solid-svg-icons';
import { Stack, Heading, Text, Spacer } from '@chakra-ui/react';

import { useImages } from '../../providers/ImageContext';

const SearchResults = ({ results }) => {
  const [{ highlightedFeature }, dispatch] = useImages();
  return (
    <>
      {results.map(({ title, Features }) => (
        <Stack key={title}>
          <Heading size="md" mb={0} fontSize={16}>
            {title}
          </Heading>
          {Features.map(({ id, name }) => {
            const isHighlighted = id === highlightedFeature;
            return (
              <Text
                key={id}
                variant="result"
                as="div"
                backgroundColor={isHighlighted ? '#666' : '#F2F2F2'}
                color={isHighlighted ? 'white' : 'black'}
                onClick={() => dispatch(['SET_HIGHLIGHTED_FEATURE', isHighlighted ? null : id])}
              >
                {name}
                <Spacer px="10px" />
                <FontAwesomeIcon icon={isHighlighted ? faTimesCircle : faBinoculars} />
              </Text>
            );
          })}
        </Stack>
      ))}
    </>
  );
};

SearchResults.propTypes = {
  results: PropTypes.arrayOf(PropTypes.shape()).isRequired,
};

export default SearchResults;
