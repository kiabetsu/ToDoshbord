import React from 'react';
import styles from './styles.module.scss';
import { TriangleAlert, Check } from 'lucide-react';

export const Alert = (props) => {
  return (
    <div className={styles.alert}>
      {/* <div className={styles.alertSvg}> */}
      <TriangleAlert size={40} />
      {props.status === 'success' && <Check />}
      {props.status === 'error' && <TriangleAlert />}
      {/* </div> */}
      <p className={styles.alertText}>Lorem ipsum dolor sit amet,</p>
    </div>
  );
};
