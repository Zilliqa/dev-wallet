import React from 'react';
import styles from './style.module.css';

interface IProps {
  size?: 'small' | 'medium' | 'large';
}
// Renders spinner to visualize loading status
const Spinner: React.SFC<IProps> = ({ size }) => {
  const SMALL = 15;
  const MEDIUM = 50;
  const LARGE = 80;

  let style = { width: MEDIUM, height: MEDIUM };
  if (size === 'small') {
    style = { width: SMALL, height: SMALL };
  } else if (size === 'large') {
    style = { width: LARGE, height: LARGE };
  }
  return <div data-test-id="spinner" className={styles.spinner} style={style} />;
};

export default Spinner;
