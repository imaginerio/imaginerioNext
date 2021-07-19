import React, { useEffect } from 'react';
import PropTypes from 'prop-types';
import mirador from 'mirador';

const Mirador = props => {
  const { config, plugins, style } = props;

  useEffect(() => {
    mirador.viewer(config, plugins);
  });

  return <div key={config.id} id={config.id} style={style} />;
};

Mirador.propTypes = {
  config: PropTypes.shape().isRequired,
  plugins: PropTypes.arrayOf(PropTypes.shape()),
  style: PropTypes.shape(),
};

Mirador.defaultProps = {
  plugins: [],
  style: null,
};

export default Mirador;
