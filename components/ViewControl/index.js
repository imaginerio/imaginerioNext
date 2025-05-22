import React from 'react';
import PropTypes from 'prop-types';
import { omit } from 'lodash';
import { FiEye, FiEyeOff } from 'react-icons/fi';
import { Box, IconButton, Tooltip } from '@chakra-ui/react';

import translation from '../../assets/config/translations';
import { useLocale } from '../../hooks/useLocale';

const styleProps = {
  boxShadow: 'md',
  border: '1px solid #ccc',
  backgroundColor: 'white',
  borderRadius: '0.375rem',
};

const ViewControl = props => {
  const { locale } = useLocale();
  const buttonStyleProps = omit(props, 'handler', 'show');
  const { handler, show } = props;

  return (
    <Box {...buttonStyleProps}>
      <Tooltip
        label={show ? translation.hideViewPoints[locale] : translation.showViewPoints[locale]}
        placement="left"
        hasArrow
      >
        <IconButton
          size="sm"
          {...styleProps}
          icon={show ? <FiEye color="black" /> : <FiEyeOff color="black" />}
          onClick={handler}
        />
      </Tooltip>
    </Box>
  );
};

ViewControl.propTypes = {
  handler: PropTypes.func.isRequired,
  show: PropTypes.bool,
};

ViewControl.defaultProps = {
  show: true,
};

export default ViewControl;
