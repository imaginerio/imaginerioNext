import React from 'react';
import PropTypes from 'prop-types';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faBinoculars } from '@fortawesome/fontawesome-pro-solid';
import { Stack, Heading, Text, Spacer } from '@chakra-ui/react';

const SearchResults = ({ results }) => (
  <>
    {results.map(({ title, Features }) => (
      <Stack key={title}>
        <Heading size="md" mb={0} fontSize={16}>
          {title}
        </Heading>
        {Features.map(({ id, name }) => (
          <Text key={id} variant="result" as="div">
            {name}
            <Spacer px="10px" />
            <FontAwesomeIcon icon={faBinoculars} />
          </Text>
        ))}
      </Stack>
    ))}
  </>
);

SearchResults.propTypes = {
  results: PropTypes.arrayOf(PropTypes.shape()).isRequired,
};

export default SearchResults;
