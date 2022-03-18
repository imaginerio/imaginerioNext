import React from 'react';
import { useRouter } from 'next/router';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faList, faBars } from '@fortawesome/pro-regular-svg-icons';
import { faTh } from '@fortawesome/pro-solid-svg-icons';
import { IconButton, ButtonGroup, Tooltip } from '@chakra-ui/react';

import { useImages } from '../../providers/ImageContext';
import translation from '../../assets/config/translations';

const viewButtons = [
  { key: 'full', icon: faList },
  { key: 'small', icon: faBars },
  { key: 'grid', icon: faTh },
];

const ViewButtons = () => {
  const [{ size }, dispatch] = useImages();
  const { locale } = useRouter();
  return (
    <ButtonGroup isAttached colorScheme="blackAlpha">
      {viewButtons.map(button => (
        <Tooltip key={button.key} label={translation[`${button.key}View`][locale]}>
          <IconButton
            icon={<FontAwesomeIcon icon={button.icon} />}
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
