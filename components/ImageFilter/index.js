import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import Fuse from 'fuse.js';
import { orderBy } from 'lodash';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faSearch,
  faTimesCircle,
  faArrowUp,
  faArrowDown,
  faList,
  faBars,
} from '@fortawesome/free-solid-svg-icons';
import {
  Grid,
  Flex,
  InputGroup,
  Input,
  InputRightAddon,
  InputRightElement,
  Select,
  IconButton,
  ButtonGroup,
} from '@chakra-ui/react';

import Timeline from '../Timeline';
import unaccent from '../../utils/unaccent';

const ImageFilter = ({ images, handler, size, sizeHandler }) => {
  const { min, max } = images.reduce(
    (memo, nextImage) => ({
      min: Math.min(memo.min, nextImage.firstyear),
      max: Math.max(memo.max, nextImage.lastyear),
    }),
    { min: Infinity, max: -Infinity }
  );

  const [search, setSearch] = useState('');
  const [dates, setDates] = useState([min, max]);
  const [sort, setSort] = useState(null);
  const [sortDirection, setSortDirection] = useState(true);

  const fuse = new Fuse(images, {
    keys: ['title', 'creator', 'depicts.value'],
  });

  useEffect(() => {
    let items = images;
    if (search) items = fuse.search(search).map(f => f.item);
    items = items.filter(i => i.firstyear <= dates[1] && i.lastyear >= dates[0]);
    if (sort) {
      items = orderBy(
        items,
        i => {
          if (sort === 'date') return parseInt(i.firstyear, `0`);
          return unaccent(i[sort]).replace(/\W/gi, '');
        },
        sortDirection ? 'asc' : 'desc'
      );
    }
    handler(items);
  }, [search, dates, sort, sortDirection]);

  return (
    <>
      <Timeline min={min} max={max} handler={setDates} />
      <Grid templateColumns="2fr 1fr 1fr" gap="20px" my={5}>
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
        <Flex>
          <Select
            placeholder="Sort by..."
            borderRadius="4px 0 0 4px"
            colorScheme="blackAlpha"
            onChange={({ target: { value } }) => setSort(value)}
          >
            <option value="title">Title</option>
            <option value="date">Date</option>
            <option value="creator">Creator</option>
          </Select>
          <IconButton
            colorScheme="blackAlpha"
            variant="outline"
            borderRadius="0 4px 4px 0"
            icon={<FontAwesomeIcon icon={sortDirection ? faArrowUp : faArrowDown} />}
            onClick={() => setSortDirection(!sortDirection)}
          />
        </Flex>
        <ButtonGroup isAttached colorScheme="blackAlpha">
          <IconButton
            icon={<FontAwesomeIcon icon={faList} />}
            variant={size ? null : 'outline'}
            onClick={() => sizeHandler(true)}
          />
          <IconButton
            icon={<FontAwesomeIcon icon={faBars} />}
            variant={size ? 'outline' : null}
            onClick={() => sizeHandler(false)}
          />
        </ButtonGroup>
      </Grid>
    </>
  );
};

ImageFilter.propTypes = {
  images: PropTypes.arrayOf(PropTypes.shape()).isRequired,
  handler: PropTypes.func.isRequired,
  size: PropTypes.bool.isRequired,
  sizeHandler: PropTypes.func.isRequired,
};

export default ImageFilter;
