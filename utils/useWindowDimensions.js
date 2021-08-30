import { useState, useEffect } from 'react';

function getWindowDimensions() {
  const { clientWidth, clientHeight, outerWidth, outerHeight } = window;
  const width = Math.min(clientWidth || Infinity, outerWidth || Infinity);
  const height = Math.min(clientHeight || Infinity, outerHeight || Infinity);
  return {
    width,
    height,
  };
}

export default function useWindowDimensions() {
  const [windowDimensions, setWindowDimensions] = useState(getWindowDimensions());

  useEffect(() => {
    function handleResize() {
      setWindowDimensions(getWindowDimensions());
    }

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  return windowDimensions;
}
