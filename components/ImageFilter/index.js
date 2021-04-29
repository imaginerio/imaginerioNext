import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faArrowUp,
  faArrowDown,
  faList,
  faBars,
  faGripHorizontal,
} from '@fortawesome/free-solid-svg-icons';
import { Grid, Flex, Select, IconButton, ButtonGroup } from '@chakra-ui/react';

import { useImages } from '../../providers/ImageContext';
import Timeline from '../Timeline';
import ImageSearch from '../ImageSearch';

const viewButtons = [
  { key: 'full', icon: faList },
  { key: 'small', icon: faBars },
  { key: 'grid', icon: faGripHorizontal },
];

const ImageFilter = () => {
  const [{ size, direction }, dispatch] = useImages();
  return (
    <>
      <Timeline min={1600} max={2020} />
      <Grid templateColumns="2fr 1fr 1fr" gap="50px" my={5}>
        <ImageSearch />
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
        <ButtonGroup isAttached colorScheme="blackAlpha">
          {viewButtons.map(button => (
            <IconButton
              key={button.key}
              icon={<FontAwesomeIcon icon={button.icon} />}
              variant={size === button.key ? null : 'outline'}
              onClick={() => dispatch(['SET_SIZE', button.key])}
            />
          ))}
        </ButtonGroup>
      </Grid>
    </>
  );
};

export default ImageFilter;
