import React from 'react';
import PropTypes from 'prop-types';
import Fuse from 'fuse.js';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSearch } from '@fortawesome/free-solid-svg-icons';
import { Grid, InputGroup, Input, InputRightAddon } from '@chakra-ui/react';

const ImageFilter = ({ images, handler }) => {
  const fuse = new Fuse(images, {
    keys: ['title', 'creator', 'depicts.value'],
  });

  const nameSearch = ({ target: { value } }) => {
    if (value) return handler(fuse.search(value).map(f => f.item));
    return handler(images);
  };

  return (
    <Grid templateColumns="1fr 1fr" mb={2}>
      <InputGroup>
        <Input onChange={nameSearch} placeholder="Search images..." />
        <InputRightAddon>
          <FontAwesomeIcon icon={faSearch} />
        </InputRightAddon>
      </InputGroup>
    </Grid>
  );
};

ImageFilter.propTypes = {
  images: PropTypes.arrayOf(PropTypes.shape()).isRequired,
  handler: PropTypes.func.isRequired,
};

export default ImageFilter;
