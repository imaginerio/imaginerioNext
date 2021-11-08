import React, { useEffect, useRef } from 'react';
import PropTypes from 'prop-types';
import dynamic from 'next/dynamic';

import ImageRow from './ImageRow';
import ImageRowSmall from './ImageRowSmall';

import { useImages } from '../../providers/ImageContext';

const FixedSizeList = dynamic(() => import('react-window').then(mod => mod.FixedSizeList), {
  ssr: false,
});

const ImageList = ({ size, activeImages, height, width }) => {
  const [{ lastImagePos }] = useImages();
  const listRef = useRef(null);
  const itemSize = size === 'full' ? 160 : 90;

  const RowLayout = props =>
    size === 'full' ? <ImageRow {...props} rowWidth={width} /> : <ImageRowSmall {...props} />;

  const Row = ({ index, style }) => (
    <RowLayout {...activeImages[index]} style={style} key={activeImages[index].ssid} />
  );
  Row.propTypes = {
    index: PropTypes.number.isRequired,
    style: PropTypes.shape().isRequired,
  };

  useEffect(() => {
    if (listRef.current) {
      listRef.current.scrollTo(0, lastImagePos * itemSize);
    }
  }, [lastImagePos]);

  return (
    <FixedSizeList
      outerRef={listRef}
      key="large"
      itemCount={activeImages.length}
      itemSize={itemSize}
      height={height}
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
  width: PropTypes.number.isRequired,
};

export default ImageList;
