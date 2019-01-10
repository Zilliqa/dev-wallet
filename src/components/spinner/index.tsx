import React from 'react';
import styles from './style.module.css';

// Renders spinner to visualize loading status
const Spinner: React.SFC = () => <div data-test-id="spinner" className={styles.spinner} />;

export default Spinner;
