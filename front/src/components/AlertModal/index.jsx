import React from 'react';
import { useDispatch, useSelector } from 'react-redux';

import styles from './styles.module.scss';
import { ModalRefactored } from '../Modal';
import { deleteTask, setAlert, setModal, setRemoveTask } from '../../redux/taskSlice';

export const AlertModal = ({ id }) => {
  const { alert } = useSelector((state) => state.tasks);
  const dispatch = useDispatch();

  const alertRef = React.useRef();

  const closeAlert = () => {
    dispatch(setAlert({ isOpen: false, event: null }));
  };

  const closeModal = () => {
    dispatch(setModal({ isOpen: false, id: null, isCreating: false }));
  };

  const RemoveTask = () => {
    dispatch(deleteTask({ id: id }));
  };

  const confirmCloseModal = () => {
    closeAlert();
    closeModal();
  };

  const confirmRemoveTask = () => {
    RemoveTask(id);
    closeAlert();
    closeModal();
  };

  React.useEffect(() => {
    const handleClick = (e) => {
      if (!alert.isOpen) return;
      if (!alertRef.current.contains(e.target)) {
        closeAlert();
      }
    };
    document.addEventListener('click', handleClick);
    return () => {
      document.removeEventListener('click', handleClick);
    };
  });

  let massage;
  let acceptButton;

  switch (alert.event) {
    case 'close':
      massage = 'If you close the window, the changes will not be saved. Close?';
      acceptButton = 'Close';
      break;

    case 'remove':
      massage = 'Are you sure you want to delete the note?';
      acceptButton = 'Remove';
      break;
    default:
      break;
  }

  return (
    <ModalRefactored modalType="alert">
      <div ref={alertRef} className={styles.alert}>
        <span className={styles.alertText}>{massage}</span>
        <div className={styles.buttonLine}>
          {alert.event === 'close' && (
            <button className={styles.acceptButton} onClick={() => confirmCloseModal()}>
              {acceptButton}
            </button>
          )}
          {alert.event === 'remove' && (
            <button className={styles.acceptButton} onClick={() => confirmRemoveTask()}>
              {acceptButton}
            </button>
          )}
          <button className={styles.rejectButton} onClick={() => closeAlert()}>
            Cancel
          </button>
        </div>
      </div>
    </ModalRefactored>
  );
};
