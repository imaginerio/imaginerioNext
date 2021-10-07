import React from 'react';
import PropTypes from 'prop-types';
import { omit } from 'lodash';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEye, faEyeSlash } from '@fortawesome/pro-solid-svg-icons';
import { Box, IconButton } from '@chakra-ui/react';

const styleProps = {
  boxShadow: 'md',
  border: '1px solid #ccc',
  backgroundColor: 'white',
  borderRadius: '0.375rem',
};

const ViewControl = props => {
  const buttonStyleProps = omit(props, 'handler', 'show');
  const { handler, show } = props;

  return (
    <Box {...buttonStyleProps}>
      <IconButton
        size="sm"
        {...styleProps}
        icon={<FontAwesomeIcon icon={show ? faEye : faEyeSlash} color="black" />}
        onClick={handler}
      />
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
