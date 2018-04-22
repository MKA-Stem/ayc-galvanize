import React from 'react';

const DecryptPage = ({match}) => (
  <div>
    <h1>Decrypt something</h1>
    <pre>{match.params.slug}</pre>
  </div>
);

export default DecryptPage;
