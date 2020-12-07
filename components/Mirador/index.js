import React, { Component } from 'react';
import PropTypes from 'prop-types';
import mirador from 'mirador';

class Mirador extends Component {
  componentDidMount() {
    const { config, plugins } = this.props;
    mirador.viewer(config, plugins);
  }

  render() {
    const { config } = this.props;
    return (
      <div
        id={config.id}
        style={{ position: 'relative', width: '100%', minHeight: 500, height: '40vh' }}
      />
    );
  }
}

Mirador.propTypes = {
  config: PropTypes.shape().isRequired,
  plugins: PropTypes.arrayOf(PropTypes.shape()),
};

Mirador.defaultProps = {
  plugins: [],
};

export default Mirador;
