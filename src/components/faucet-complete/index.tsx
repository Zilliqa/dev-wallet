import React from 'react';
import { EXPLORER_URL } from '../../constants';

const FaucetComplete: React.SFC<{ txId: string }> = (txId) => (
  <div>
    <p className="pt-4 text-secondary">
      <span className="text-primary">{'Transaction In Process'}</span>
      <br />
      <br />
      <small>{'Your transaction is pending blockchain confirmation.'}</small>
      <br />
      <small>{'Please check after a few minutes.'}</small>
    </p>
    {txId ? (
      <u>
        <a target="_blank" href={`${EXPLORER_URL}/transactions/${txId}`} rel="noreferrer">
          {'View Your Transaction'}
        </a>
      </u>
    ) : null}
  </div>
);

export default FaucetComplete;
