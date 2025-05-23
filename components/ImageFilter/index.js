import React, { useEffect, useRef, useState } from 'react';
import PropTypes from 'prop-types';
import { useRouter } from 'next/router';
import { FiFilter } from 'react-icons/fi';
import {
  Box,
  Heading,
  HStack,
  IconButton,
  Input,
  Radio,
  RadioGroup,
  Stack,
  Text,
  Tooltip,
} from '@chakra-ui/react';

import { useImages } from '../../providers/ImageContext';
import translation from '../../assets/config/translations';
import { useLocale } from '../../hooks/useLocale';

const CollectionFilter = () => {
  const { query } = useRouter();
  const { locale } = useLocale();
  const [{ categories, collection }, dispatch] = useImages();

  useEffect(() => {
    if (query.collection && Object.keys(categories).includes(query.collection)) {
      dispatch(['SET_COLLECTION', query.collection]);
    }
  }, [query.collection]);

  return (
    <Box mb={1} pb={3} borderBottom="1px solid #ccc">
      <Heading size="sm" mb={2}>
        {`${translation.imageCategory[locale]}:`}
      </Heading>
      <RadioGroup
        value={collection || 'all'}
        onChange={value => dispatch(['SET_COLLECTION', value])}
      >
        <Stack>
          {Object.keys(categories).map(category => (
            <Radio key={category} value={category}>
              <Text textTransform="capitalize">
                {`${translation[category.toLowerCase()][locale]} (${categories[category]})`}
              </Text>
            </Radio>
          ))}
        </Stack>
      </RadioGroup>
    </Box>
  );
};

const FilterMenu = ({ xPos }) => {
  const { locale } = useLocale();
  const [{ dates }, dispatch] = useImages();
  const [tempDates, setTempDates] = useState(dates);
  const [isError, setIsError] = useState(false);

  useEffect(() => {
    if (
      tempDates[0] >= 1500 &&
      tempDates[0] <= new Date().getFullYear() &&
      tempDates[1] >= 1500 &&
      tempDates[1] <= new Date().getFullYear() &&
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
          {`${translation.imageYear[locale]}:`}
        </Heading>
        <HStack>
          <Box>
            <Text>{translation.start[locale]}</Text>
            <Input
              value={tempDates[0]}
              isInvalid={isError}
              onChange={({ target: { value } }) =>
                setTempDates([parseInt(value, 10), tempDates[1]])
              }
            />
          </Box>
          <Box>
            <Text>{translation.end[locale]}</Text>
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
  const { locale } = useLocale();
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
          icon={<FiFilter />}
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
