import React, { useState, useRef, useEffect } from 'react';
import PropTypes from 'prop-types';
import { useRouter } from 'next/router';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faFilter } from '@fortawesome/pro-solid-svg-icons';
import {
  Stack,
  Box,
  Text,
  IconButton,
  Heading,
  Radio,
  RadioGroup,
  HStack,
  Input,
  Tooltip,
} from '@chakra-ui/react';

import { useImages } from '../../providers/ImageContext';
import translation from '../../assets/config/translations';

const CollectionFilter = () => {
  const [{ categories, collection }, dispatch] = useImages();
  return (
    <Box mb={1} pb={3} borderBottom="1px solid #ccc">
      <Heading size="sm" mb={2}>
        Image category:
      </Heading>
      <RadioGroup
        value={collection || 'all'}
        onChange={value => dispatch(['SET_COLLECTION', value])}
      >
        <Stack>
          {Object.keys(categories).map(category => (
            <Radio key={category} value={category}>
              <Text textTransform="capitalize">{`${category} (${categories[category]})`}</Text>
            </Radio>
          ))}
        </Stack>
      </RadioGroup>
    </Box>
  );
};

const FilterMenu = ({ xPos }) => {
  const [{ dates }, dispatch] = useImages();
  const [tempDates, setTempDates] = useState(dates);
  const [isError, setIsError] = useState(false);

  useEffect(() => {
    if (
      tempDates[0] >= 1500 &&
      tempDates[0] <= 2021 &&
      tempDates[1] >= 1500 &&
      tempDates[1] <= 2021 &&
      tempDates[0] < tempDates[1]
    ) {
      dispatch(['DATES', tempDates]);
      setIsError(false);
    } else {
      setIsError(true);
    }
  }, [tempDates]);

  useEffect(() => setTempDates(dates), [dates]);

  return (
    <Stack
      w={220}
      backgroundColor="white"
      boxShadow="lg"
      pos="absolute"
      left={xPos}
      top={65}
      p={5}
      zIndex={4}
    >
      <CollectionFilter />
      <Box>
        <Heading size="sm" mb={2}>
          Image year:
        </Heading>
        <HStack>
          <Box>
            <Text>Start</Text>
            <Input
              value={tempDates[0]}
              isInvalid={isError}
              onChange={({ target: { value } }) =>
                setTempDates([parseInt(value, 10), tempDates[1]])
              }
            />
          </Box>
          <Box>
            <Text>End</Text>
            <Input
              value={tempDates[1]}
              isInvalid={isError}
              onChange={({ target: { value } }) =>
                setTempDates([tempDates[0], parseInt(value, 10)])
              }
            />
          </Box>
        </HStack>
      </Box>
    </Stack>
  );
};

FilterMenu.propTypes = {
  xPos: PropTypes.number.isRequired,
};

const ImageFilter = () => {
  const { locale } = useRouter();
  const buttonRef = useRef(null);
  const [isOpen, setIsOpen] = useState();
  const [{ collection }] = useImages();
  const isActive = collection && collection !== 'all';

  useEffect(() => setIsOpen(false), [collection]);

  return (
    <>
      <Tooltip label={translation.filters[locale]}>
        <IconButton
          ref={buttonRef}
          variant="outline"
          colorScheme="blackAlpha"
          icon={<FontAwesomeIcon icon={faFilter} />}
          bg={isActive ? '#6CB2F5' : 'transparent'}
          borderColor={isActive ? '#6CB2F5' : '#E2E8F0'}
          color={isActive ? 'white' : 'gray.500'}
          onClick={() => setIsOpen(!isOpen)}
        />
      </Tooltip>
      {isOpen && <FilterMenu xPos={buttonRef.current.getBoundingClientRect().left} />}
    </>
  );
};

export default ImageFilter;
