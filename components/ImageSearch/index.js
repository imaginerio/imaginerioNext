import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSearch } from '@fortawesome/pro-regular-svg-icons';
import { faTimesCircle } from '@fortawesome/pro-solid-svg-icons';
import { InputGroup, Input, InputRightElement, InputLeftElement } from '@chakra-ui/react';

import { useImages } from '../../providers/ImageContext';

const ImageSearch = () => {
  const [{ query }, dispatch] = useImages();
  return (
    <InputGroup gridColumn={['1 / 3', '1']}>
      <InputLeftElement>
        <FontAwesomeIcon icon={faSearch} />
      </InputLeftElement>
      <Input
        value={query}
        onChange={({ target: { value } }) => dispatch(['QUERY', value])}
        placeholder="Search images..."
      />
      <InputRightElement>
        {query && (
          <FontAwesomeIcon
            icon={faTimesCircle}
            color="#666"
            onClick={() => dispatch(['QUERY', ''])}
            style={{ cursor: 'pointer' }}
          />
        )}
      </InputRightElement>
    </InputGroup>
  );
};

export default ImageSearch;
