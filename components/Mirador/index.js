import React, { Component } from 'react';
import PropTypes from 'prop-types';
import mirador from 'mirador';

class Mirador extends Component {
  componentDidMount() {
    const { config, plugins, style } = this.props;
    mirador.viewer(config, plugins);
  }

  render() {
    const { config } = this.props;
    return <div id={config.id} />;
  }
}

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
