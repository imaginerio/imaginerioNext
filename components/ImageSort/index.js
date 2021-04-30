import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowUp, faArrowDown } from '@fortawesome/free-solid-svg-icons';
import { Flex, Select, IconButton } from '@chakra-ui/react';

import { useImages } from '../../providers/ImageContext';

const ImageSort = () => {
  const [{ direction }, dispatch] = useImages();
  return (
    <Flex>
      <Select
        placeholder="Sort by..."
        borderRadius="4px 0 0 4px"
        colorScheme="blackAlpha"
        onChange={({ target: { value } }) => dispatch(['SORT', value])}
      >
        <option value="title">Title</option>
        <option value="date">Date</option>
        <option value="creator">Creator</option>
      </Select>
      <IconButton
        colorScheme="blackAlpha"
        variant="outline"
        borderRadius="0 4px 4px 0"
        icon={<FontAwesomeIcon icon={direction ? faArrowUp : faArrowDown} />}
        onClick={() => dispatch(['DIRECTION'])}
      />
    </Flex>
  );
};

ImageSort.propTypes = {};

ImageSort.defaultProps = {};

export default ImageSort;
