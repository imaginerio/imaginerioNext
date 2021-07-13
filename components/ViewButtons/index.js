import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faList, faBars } from '@fortawesome/pro-regular-svg-icons';
import { faTh } from '@fortawesome/pro-solid-svg-icons';
import { IconButton, ButtonGroup } from '@chakra-ui/react';

import { useImages } from '../../providers/ImageContext';

const viewButtons = [
  { key: 'full', icon: faList },
  { key: 'small', icon: faBars },
  { key: 'grid', icon: faTh },
];

const ViewButtons = () => {
  const [{ size }, dispatch] = useImages();
  return (
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
  );
};

export default ViewButtons;
