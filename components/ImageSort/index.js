import React from 'react';
import PropTypes from 'prop-types';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowUp, faArrowDown } from '@fortawesome/free-solid-svg-icons';
import { Flex, Select, IconButton } from '@chakra-ui/react';

import { useImages } from '../../providers/ImageContext';

const ImageSort = ({ small, collection }) => {
  const [{ direction }, dispatch] = useImages();
  return (
    <Flex>
      <Select
        size={small ? 'xs' : 'lg'}
        placeholder="Sort by..."
        borderRadius="4px 0 0 4px"
        colorScheme="blackAlpha"
        borderStyle={small ? 'none' : 'solid'}
        onChange={({ target: { value } }) => dispatch(['SORT', value])}
      >
        <option value="title">Title</option>
        <option value="date">Date</option>
        <option value="creator">Creator</option>
        {collection && <option value="collection">Collection</option>}
      </Select>
      <IconButton
        size={small ? 'xs' : 'lg'}
        colorScheme="blackAlpha"
        variant="outline"
        borderRadius="0 4px 4px 0"
        borderStyle={small ? 'none' : 'solid'}
        icon={<FontAwesomeIcon icon={direction ? faArrowUp : faArrowDown} />}
        onClick={() => dispatch(['DIRECTION'])}
      />
    </Flex>
  );
};

ImageSort.propTypes = {
  small: PropTypes.bool,
  collection: PropTypes.bool,
};

ImageSort.defaultProps = {
  small: false,
  collection: false,
};

export default ImageSort;
