import React, { useState, useEffect, useContext } from 'react';
import PropTypes from 'prop-types';
import { isEqual } from 'lodash';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faSearch,
  faTimesCircle,
  faArrowUp,
  faArrowDown,
  faList,
  faBars,
  faGripHorizontal,
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

import ImageContext from '../../providers/ImageContext';
import Timeline from '../Timeline';

const viewButtons = [
  { key: 'full', icon: faList },
  { key: 'small', icon: faBars },
  { key: 'grid', icon: faGripHorizontal },
];

const ImageFilter = () => {
  const {
    query,
    setQuery,
    setSort,
    setDates,
    sortDirection,
    setSortDirection,
    size,
    setSize,
  } = useContext(ImageContext);

  return (
    <>
      <Timeline min={1600} max={2020} handler={setDates} />
      <Grid templateColumns="2fr 1fr 1fr" gap="50px" my={5}>
        <InputGroup>
          <Input
            value={query}
            onChange={({ target: { value } }) => setQuery(value)}
            placeholder="Search images..."
          />
          <InputRightElement mr="45px">
            {query && (
              <FontAwesomeIcon
                icon={faTimesCircle}
                color="#666"
                onClick={() => setQuery('')}
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
          {viewButtons.map(button => (
            <IconButton
              key={button.key}
              icon={<FontAwesomeIcon icon={button.icon} />}
              variant={size === button.key ? null : 'outline'}
              onClick={() => setSize(button.key)}
            />
          ))}
        </ButtonGroup>
      </Grid>
    </>
  );
};

ImageFilter.propTypes = {
  images: PropTypes.arrayOf(PropTypes.shape()).isRequired,
  handler: PropTypes.func.isRequired,
  size: PropTypes.string.isRequired,
  sizeHandler: PropTypes.func.isRequired,
};

export default ImageFilter;
