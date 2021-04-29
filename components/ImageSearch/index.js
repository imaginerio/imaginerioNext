import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSearch, faTimesCircle } from '@fortawesome/free-solid-svg-icons';
import { InputGroup, Input, InputRightAddon, InputRightElement } from '@chakra-ui/react';

import { useImages } from '../../providers/ImageContext';

const ImageSearch = () => {
  const [{ query }, dispatch] = useImages();
  return (
    <InputGroup>
      <Input
        value={query}
        onChange={({ target: { value } }) => dispatch(['QUERY', value])}
        placeholder="Search images..."
      />
      <InputRightElement mr="45px">
        {query && (
          <FontAwesomeIcon
            icon={faTimesCircle}
            color="#666"
            onClick={() => dispatch(['QUERY', ''])}
            style={{ cursor: 'pointer' }}
          />
        )}
      </InputRightElement>
      <InputRightAddon>
        <FontAwesomeIcon icon={faSearch} />
      </InputRightAddon>
    </InputGroup>
  );
};

ImageSearch.propTypes = {};

ImageSearch.defaultProps = {};

export default ImageSearch;
