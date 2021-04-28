import React from 'react';
import PropTypes from 'prop-types';
import dynamic from 'next/dynamic';

import ImageRow from './ImageRow';
import ImageRowSmall from './ImageRowSmall';

const FixedSizeList = dynamic(() => import('react-window').then(mod => mod.FixedSizeList), {
  ssr: false,
});

const ImageList = ({ size, activeImages, height, collection }) => {
  const itemSize = size === 'full' ? 210 : 90;

  const RowLayout = props =>
    size === 'full' ? <ImageRow {...props} /> : <ImageRowSmall {...props} />;
  const Row = ({ index, style }) => (
    <RowLayout {...activeImages[index]} style={style} collection={collection} />
  );
  Row.propTypes = {
    index: PropTypes.number.isRequired,
    style: PropTypes.shape().isRequired,
  };

  return (
    <FixedSizeList
      key="large"
      itemCount={activeImages.length}
      itemSize={itemSize}
      height={height - 360}
      width="100%"
    >
      {Row}
    </FixedSizeList>
  );
};

ImageList.propTypes = {
  size: PropTypes.oneOf(['full', 'small']).isRequired,
  activeImages: PropTypes.arrayOf(PropTypes.shape()).isRequired,
  height: PropTypes.number.isRequired,
  collection: PropTypes.string.isRequired,
};

export default ImageList;
