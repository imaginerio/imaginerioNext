import React from 'react';
import PropTypes from 'prop-types';
import { useRouter } from 'next/router';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowUp, faArrowDown } from '@fortawesome/pro-solid-svg-icons';
import { Flex, Select, IconButton } from '@chakra-ui/react';

import { useImages } from '../../providers/ImageContext';
import translation from '../../assets/config/translations';

const ImageSort = ({ small, collection }) => {
  const { locale } = useRouter();
  const [{ direction }, dispatch] = useImages();

  return (
    <Flex>
      <Select
        h={['40px', '']}
        size={small ? 'xs' : 'lg'}
        placeholder={translation.sortBy[locale]}
        borderRadius="4px 0 0 4px"
        colorScheme="blackAlpha"
        borderStyle={small ? 'none' : 'solid'}
        borderColor={small ? 'transparent' : '#E2E8F0'}
        onChange={({ target: { value } }) => dispatch(['SORT', value])}
      >
        <option value="title">{translation.title[locale]}</option>
        <option value="date">{translation.date[locale]}</option>
        <option value="creator">{translation.creator[locale]}</option>
        {collection && <option value="collection">{translation.collection[locale]}</option>}
      </Select>
      <IconButton
        h={['40px', 'auto']}
        ml="-1px"
        size={small ? 'xs' : 'lg'}
        colorScheme="blackAlpha"
        variant="outline"
        borderRadius="0 4px 4px 0"
        borderStyle={small ? 'none' : 'solid'}
        borderColor={small ? 'transparent' : '#E2E8F0'}
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
