import React, { useEffect, useState } from 'react';
import cookieCutter from 'cookie-cutter';
import { Steps } from 'intro.js-react';
import { IconButton } from '@chakra-ui/react';
import { FiHelpCircle } from 'react-icons/fi';

import getSteps from './steps';

import { useImages } from '../../providers/ImageContext';
import { useLocale } from '../../hooks/useLocale';

const Intro = () => {
  const [{ showIntro }, dispatch] = useImages();
  const { locale } = useLocale();
  const [steps, setSteps] = useState([]);
  const [introCookie, setIntroCookie] = useState(false);

  useEffect(() => setIntroCookie(Boolean(cookieCutter.get('intro'))), []);

  useEffect(() => {
    setSteps(getSteps(locale));
  }, [showIntro, locale]);

  return (
    <>
      {showIntro && !introCookie ? (
        <Steps
          enabled
          steps={steps}
          initialStep={0}
          options={{
            doneLabel: 'Done',
          }}
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
          icon={<FiHelpCircle />}
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
