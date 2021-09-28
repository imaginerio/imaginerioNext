import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import mirador from 'mirador';

class Mirador extends PureComponent {
  constructor(props) {
    super(props);
    this.miradorInstance = null;
  }

  componentDidMount() {
    const { config, plugins } = this.props;
    this.miradorInstance = mirador.viewer(config, plugins);
  }

  componentDidUpdate(prevProps) {
    const { manifestId } = this.props.config.windows[0];
    if (manifestId !== prevProps.config.windows[0].manifestId) {
      this.miradorInstance.store.dispatch(
        mirador.actions.updateWindow(
          Object.keys(this.miradorInstance.store.getState().windows)[0],
          { manifestId }
        )
      );
    }
  }

  render() {
    const { config, style } = this.props;
    return <div id={config.id} style={style} />;
  }
}

Mirador.propTypes = {
  config: PropTypes.shape().isRequired,
  plugins: PropTypes.arrayOf(PropTypes.shape()),
  style: PropTypes.shape(),
};

Mirador.defaultProps = {
  plugins: [],
  style: {},
};

export default Mirador;
