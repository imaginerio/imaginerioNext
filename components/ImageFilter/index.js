import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import Fuse from 'fuse.js';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSearch, faTimesCircle } from '@fortawesome/free-solid-svg-icons';
import { Grid, InputGroup, Input, InputRightAddon, InputRightElement } from '@chakra-ui/react';

import Timeline from '../Timeline';

const ImageFilter = ({ images, handler }) => {
  const { min, max } = images.reduce(
    (memo, nextImage) => ({
      min: Math.min(memo.min, nextImage.firstyear),
      max: Math.max(memo.max, nextImage.lastyear),
    }),
    { min: Infinity, max: -Infinity }
  );

  const [search, setSearch] = useState('');
  const [dates, setDates] = useState([min, max]);

  const fuse = new Fuse(images, {
    keys: ['title', 'creator', 'depicts.value'],
  });

  useEffect(() => {
    let items = images;
    if (search) items = fuse.search(search).map(f => f.item);
    items = items.filter(i => i.firstyear <= dates[1] && i.lastyear >= dates[0]);
    handler(items);
  }, [search, dates]);

  return (
    <Grid templateColumns="2fr 3fr" gap="20px" mb={2}>
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
      <Timeline min={min} max={max} handler={setDates} />
    </Grid>
  );
};

ImageFilter.propTypes = {
  images: PropTypes.arrayOf(PropTypes.shape()).isRequired,
  handler: PropTypes.func.isRequired,
};

export default ImageFilter;
