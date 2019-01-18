import React from 'react';
import './style.css';

interface IProps {
  loading: boolean;
}

const SpinnerWithCheckMark: React.SFC<IProps> = ({ loading }) => {
  return (
    <div className={`circle-loader ${loading ? '' : 'load-complete'}`}>
      <div className="checkmark draw" />
    </div>
  );
};

export default SpinnerWithCheckMark;
