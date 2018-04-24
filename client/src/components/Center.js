import React from 'react';

const Center = ({className, children}) => (
  <div
    className={className}
    style={{display: 'flex', justifyContent: 'center', flexDirection: 'row'}}
  >
    {children}
  </div>
);

export default Center;
