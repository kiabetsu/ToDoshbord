import React, { useEffect, useState } from 'react';
import styles from './styles.module.scss';
import { TriangleAlert, Check, X } from 'lucide-react';
import { useSelector } from 'react-redux';

export const Alert = ({ status, massage, isLast }) => {
  const [deleteAlert, setDeleteAlert] = useState(false);

  useEffect(() => {
    if (!isLast) {
      setTimeout(() => {
        setDeleteAlert(true);
      }, 100000);
    }
  }, [isLast]);
  return (
    <div
      className={`${styles.alert}`}
      style={{
        color: `${status === 'error' ? '#f95668' : '#09c97f'}`,
        backgroundColor: `${status === 'error' ? '#ffdbdb' : '#c9ffe5'}`,
        borderColor: `${status === 'error' ? '#f95668' : '#09c97f'}`,
        transform: `translate(${deleteAlert ? '400px' : '0'}, ${isLast ? '200px' : '0'})`,
      }}>
      {status === 'success' && <Check size={30} />}
      {status === 'error' && <TriangleAlert size={30} />}
      <p className={styles.alertText}>{massage}</p>
      <div className={styles.deleteAlert}>
        <X size={16} onClick={() => setDeleteAlert(true)} />
      </div>
    </div>
  );
};

export const AlertList = () => {
  const { alertList } = useSelector((state) => state.tasks);
  return (
    <div className={styles.alertList}>
      {alertList.map((alert, i) => (
        <div key={i}>
          <Alert
            status={alert.status}
            massage={alert.massage}
            isLast={i === alertList.length - 1 ? true : false}
          />
        </div>
      ))}
    </div>
  );
};
