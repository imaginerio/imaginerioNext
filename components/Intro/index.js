import React, { useState, useEffect } from 'react';
import cookieCutter from 'cookie-cutter';
import { useRouter } from 'next/dist/client/router';
import { Steps } from 'intro.js-react';
import { IconButton } from '@chakra-ui/react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faQuestion } from '@fortawesome/pro-solid-svg-icons';

import getSteps from './steps';

import { useImages } from '../../providers/ImageContext';

const Intro = () => {
  const [{ showIntro }, dispatch] = useImages();
  const { locale } = useRouter();
  const [steps, setSteps] = useState([]);
  const [introCookie, setIntroCookie] = useState(false);

  useEffect(() => setIntroCookie(Boolean(cookieCutter.get('intro'))), []);

  useEffect(() => {
    setSteps(getSteps(locale));
  }, [showIntro]);

  return (
    <>
      {showIntro && !introCookie ? (
        <Steps
          enabled
          steps={steps}
          initialStep={0}
          onExit={stepIndex => {
            dispatch(['SET_SHOW_INTRO', false]);
            if (stepIndex === steps.length - 1) {
              cookieCutter.set('intro', true);
            }
          }}
        />
      ) : (
        <IconButton
          isRound
          pos="fixed"
          bottom={15}
          right={15}
          zIndex={9}
          size="sm"
          boxShadow="lg"
          color="gray.600"
          icon={<FontAwesomeIcon icon={faQuestion} />}
          onClick={() => {
            dispatch(['SET_SHOW_INTRO', true]);
            setIntroCookie(false);
          }}
        />
      )}
    </>
  );
};

export default Intro;
