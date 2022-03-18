import React from 'react';
import PropTypes from 'prop-types';
import { useRouter } from 'next/router';
import { omit } from 'lodash';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEye, faEyeSlash } from '@fortawesome/pro-solid-svg-icons';
import { Box, IconButton, Tooltip } from '@chakra-ui/react';

import translation from '../../assets/config/translations';

const styleProps = {
  boxShadow: 'md',
  border: '1px solid #ccc',
  backgroundColor: 'white',
  borderRadius: '0.375rem',
};

const ViewControl = props => {
  const { locale } = useRouter();
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
          icon={<FontAwesomeIcon icon={show ? faEye : faEyeSlash} color="black" />}
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
