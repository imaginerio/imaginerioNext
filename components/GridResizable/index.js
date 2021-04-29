import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { Grid, Box } from '@chakra-ui/react';

const GridResizable = ({ children }) => {
  const [width, setWidth] = useState(500);
  const [dragging, setDragging] = useState(false);
  return (
    <>
      <Grid
        templateColumns={`${width}px 1fr`}
        h="100%"
        onMouseUp={() => setDragging(false)}
        onMouseMove={({ clientX }) => {
          if (dragging) setWidth(clientX);
        }}
      >
        {children}
      </Grid>
      <Box
        position="absolute"
        top="50%"
        left={`${width}px`}
        w="20px"
        h="40px"
        ml="-10px"
        backgroundColor="white"
        border="1px solid #999"
        borderRadius="4px"
        _after={{
          content: '"|"',
          width: '100%',
          textAlign: 'center',
          display: 'block',
          color: '#999',
          marginTop: '6px',
        }}
        onMouseDown={() => setDragging(true)}
        onMouseUp={() => setDragging(false)}
      />
    </>
  );
};

GridResizable.propTypes = {
  children: PropTypes.arrayOf(PropTypes.element),
};

GridResizable.defaultProps = {
  children: null,
};

export default GridResizable;
