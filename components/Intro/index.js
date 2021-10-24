import React from 'react';
import { Steps } from 'intro.js-react';

import steps from './steps';

const Intro = () => {
  return <Steps enabled steps={steps} initialStep={0} onExit={() => null} />;
};

export default Intro;
