import React from 'react';

const FaucetPending: React.SFC = () => (
  <div className="text-center py-4">
    <p className="text-secondary text-fade-in">
      {'Running Faucet'}
      <br />
      <small>{'Please kindly wait. It might take a while.'}</small>
    </p>
  </div>
);

export default FaucetPending;
