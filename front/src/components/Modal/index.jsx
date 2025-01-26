import React from 'react';

import styles from './style.module.scss';
import { useSelector } from 'react-redux';

export const ModalRefactored = ({ modalType, children }) => {
  const { modal, alert, login } = useSelector((state) => state.tasks);

  let toggle;
  switch (modalType) {
    case 'task':
      toggle = modal.isOpen;
      break;
    case 'alert':
      toggle = alert.isOpen;
      break;
    case 'login':
      toggle = login.isOpen;
      break;
    default:
      break;
  }

  return (
    <>
      <div
        className={styles.backGround}
        style={{
          opacity: `${toggle ? 1 : 0}`,
          pointerEvents: `${toggle ? 'all' : 'none'}`,
          zIndex: `${modalType === 'alert' ? 11 : 0}`,
          top: `${modalType === 'alert' ? '134%' : '50%'}`,
        }}
      />
      <div
        className={styles.centered}
        style={{
          transform: `translate(-50%, -50%) ${toggle ? 'scale(1)' : 'scale(0)'}`,
          opacity: `${toggle ? 1 : 0}`,
          zIndex: `${modalType === 'alert' ? 12 : 0}`,
        }}>
        <div className={styles.modal}>{children}</div>
      </div>
    </>
  );
};
