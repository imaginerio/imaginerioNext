import React from 'react';
import PropTypes from 'prop-types';
import { FiEye, FiImage, FiXCircle } from 'react-icons/fi';
import { Heading, HStack, Spacer, Stack, Text } from '@chakra-ui/react';

import { useImages } from '../../providers/ImageContext';
import translation from '../../assets/config/translations';
import { useLocale } from '../../hooks/useLocale';

const SearchResults = ({ results: { features, views } }) => {
  const { locale } = useLocale();
  const [{ highlightedFeature, selectedImage, allImages }, dispatch] = useImages();

  return (
    <>
      {views.map(({ title, Features }) => (
        <Stack key={title}>
          <Heading size="md" mb={0} fontSize={16}>
            {title}
          </Heading>
          {Features.map(view => {
            const isHighlighted = selectedImage && view.ssid === selectedImage.ssid;
            return (
              <Text
                key={view.id}
                variant="result"
                as="div"
                backgroundColor={isHighlighted ? '#666' : '#F2F2F2'}
                alignItems="flex-start"
                onClick={() =>
                  dispatch([
                    'SET_SELECTED_IMAGE',
                    isHighlighted ? null : allImages.find(i => i.ssid === view.ssid),
                  ])
                }
              >
                {view.title}
                <Spacer px="5px" />
                {isHighlighted ? (
                  <FiXCircle style={{ marginTop: 3 }} />
                ) : (
                  <FiImage style={{ marginTop: 3 }} />
                )}
              </Text>
            );
          })}
        </Stack>
      ))}
      {features.map(({ title, Features }) => (
        <Stack key={title}>
          <Heading size="md" mb={0} fontSize={16}>
            {title}
          </Heading>
          {Features.map(({ id, name, firstyear, lastyear, creator }) => {
            const isHighlighted = id === highlightedFeature;
            const mapped =
              firstyear !== lastyear
                ? `${firstyear} - ${lastyear === 8888 ? translation.today[locale] : lastyear}`
                : firstyear;
            return (
              <Text
                key={id}
                as="div"
                variant="result"
                flexDir="column"
                alignItems="flex-start"
                spacing={0}
                backgroundColor={isHighlighted ? '#666' : '#F2F2F2'}
                color={isHighlighted ? 'white' : 'black'}
                onClick={() => dispatch(['SET_HIGHLIGHTED_FEATURE', isHighlighted ? null : id])}
              >
                <HStack w="100%">
                  <Text>{name}</Text>
                  <Spacer px="10px" />
                  {isHighlighted ? <FiXCircle /> : <FiEye />}
                </HStack>
                <Stack fontSize={13} spacing={1} mt={1} lineHeight={1.1}>
                  <Text>{`${translation.mapped[locale]}: ${mapped}`}</Text>
                  {creator && <Text>{`${translation.creator[locale]}: ${creator}`}</Text>}
                </Stack>
              </Text>
            );
          })}
        </Stack>
      ))}
    </>
  );
};

SearchResults.propTypes = {
  results: PropTypes.shape({
    features: PropTypes.arrayOf(PropTypes.shape()),
    views: PropTypes.arrayOf(PropTypes.shape()),
  }).isRequired,
};

export default SearchResults;
