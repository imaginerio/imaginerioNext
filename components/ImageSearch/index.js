import React from 'react';
import PropTypes from 'prop-types';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSearch } from '@fortawesome/pro-regular-svg-icons';
import { faTimesCircle } from '@fortawesome/pro-solid-svg-icons';
import { InputGroup, Input, InputRightAddon, InputRightElement } from '@chakra-ui/react';

import { useImages } from '../../providers/ImageContext';

const ImageSearch = ({ hideIcon }) => {
  const [{ query }, dispatch] = useImages();
  return (
    <InputGroup>
      <Input
        value={query}
        onChange={({ target: { value } }) => dispatch(['QUERY', value])}
        placeholder="Search images..."
      />
      <InputRightElement mr={hideIcon ? 0 : '45px'}>
        {query && (
          <FontAwesomeIcon
            icon={faTimesCircle}
            color="#666"
            onClick={() => dispatch(['QUERY', ''])}
            style={{ cursor: 'pointer' }}
          />
        )}
      </InputRightElement>
      {!hideIcon && (
        <InputRightAddon>
          <FontAwesomeIcon icon={faSearch} />
        </InputRightAddon>
      )}
    </InputGroup>
  );
};

ImageSearch.propTypes = {
  hideIcon: PropTypes.bool,
};

ImageSearch.defaultProps = {
  hideIcon: false,
};

export default ImageSearch;
