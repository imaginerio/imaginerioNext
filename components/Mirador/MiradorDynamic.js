import React from 'react';
import dynamic from 'next/dynamic';

const Mirador = dynamic(() => import('./index'), { ssr: false });

const MiradorDynamic = props => (
  <div>
    <Mirador {...props} />
  </div>
);

export default MiradorDynamic;
