import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/dist/client/router';
import { Steps } from 'intro.js-react';

import getSteps from './steps';

import { useImages } from '../../providers/ImageContext';

const Intro = () => {
  const [{ showIntro }, dispatch] = useImages();
  const { locale } = useRouter();
  const [steps, setSteps] = useState([]);

  useEffect(() => setSteps(getSteps(locale)), [showIntro]);

  return (
    <>
      {showIntro && (
        <Steps
          enabled
          steps={steps}
          initialStep={0}
          onExit={() => dispatch(['SET_SHOW_INTRO', false])}
        />
      )}
    </>
  );
};

export default Intro;
