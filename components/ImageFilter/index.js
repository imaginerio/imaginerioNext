import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import Fuse from 'fuse.js';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSearch, faTimesCircle } from '@fortawesome/free-solid-svg-icons';
import { Grid, InputGroup, Input, InputRightAddon, InputRightElement } from '@chakra-ui/react';

const ImageFilter = ({ images, handler }) => {
  const [search, setSearch] = useState('');
  const fuse = new Fuse(images, {
    keys: ['title', 'creator', 'depicts.value'],
  });

  useEffect(() => {
    if (search) return handler(fuse.search(search).map(f => f.item));
    return handler(images);
  }, [search]);

  return (
    <Grid templateColumns="1fr 1fr" mb={2}>
      <InputGroup>
        <Input
          value={search}
          onChange={({ target: { value } }) => setSearch(value)}
          placeholder="Search images..."
        />
        <InputRightElement mr="45px">
          {search && (
            <FontAwesomeIcon
              icon={faTimesCircle}
              color="#666"
              onClick={() => setSearch('')}
              style={{ cursor: 'pointer' }}
            />
          )}
        </InputRightElement>
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
