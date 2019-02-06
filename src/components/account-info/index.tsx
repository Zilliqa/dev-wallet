import React from 'react';
import Jazzicon, { jsNumberForAddress } from 'react-jazzicon';
import Button from '../button';
import { MdRefresh } from 'react-icons/md';

interface IProps {
  address: string;
  balance: string;
  getBalance: () => void;
  isUpdatingBalance: boolean;
}

export const AccountInfo: React.SFC<IProps> = (props) => {
  const { isUpdatingBalance, balance, address } = props;
  return (
    <div>
      <div className="px-4">
        <h5>
          <b>{'Account Info'}</b>
        </h5>
        <div className="d-flex">
          <div className="py-2">
            {address ? <Jazzicon diameter={100} seed={jsNumberForAddress(address)} /> : null}
          </div>
          <div className="px-4 text-left text-secondary">
            <small>
              <b>{'Address'}</b>
              <p className="pt-1">{address}</p>
              <b>
                {'Balance'}
                <Button
                  type="tertiary"
                  text={''}
                  before={<MdRefresh />}
                  onClick={props.getBalance}
                  disabled={isUpdatingBalance}
                  ariaLabel={'Update Balance'}
                  className="mb-1 py-0 px-1"
                />
              </b>
              <p>{isUpdatingBalance ? 'loading...' : `${balance} ZIL`}</p>
            </small>
          </div>
        </div>
      </div>
    </div>
  );
};
