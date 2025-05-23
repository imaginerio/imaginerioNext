import React from 'react';
import { FiGrid, FiList, FiMenu } from 'react-icons/fi';
import { ButtonGroup, IconButton, Tooltip } from '@chakra-ui/react';

import { useImages } from '../../providers/ImageContext';
import translation from '../../assets/config/translations';
import { useLocale } from '../../hooks/useLocale';

const viewButtons = [
  { key: 'full', icon: FiList },
  { key: 'small', icon: FiMenu },
  { key: 'grid', icon: FiGrid },
];

const ViewButtons = () => {
  const [{ size }, dispatch] = useImages();
  const { locale } = useLocale();
  return (
    <ButtonGroup isAttached colorScheme="blackAlpha">
      {viewButtons.map(button => (
        <Tooltip key={button.key} label={translation[`${button.key}View`][locale]}>
          <IconButton
            icon={<button.icon />}
            variant="outline"
            bg={size === button.key ? '#6CB2F5' : 'transparent'}
            borderColor={size === button.key ? '#6CB2F5' : '#E2E8F0'}
            color={size === button.key ? 'white' : 'gray.500'}
            onClick={() => dispatch(['SET_SIZE', button.key])}
          />
        </Tooltip>
      ))}
    </ButtonGroup>
  );
};

export default ViewButtons;
