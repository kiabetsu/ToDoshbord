import React from 'react';
import { useDispatch, useSelector } from 'react-redux';

import styles from './styles.module.scss';
import { ModalRefactored } from '../Modal';
import { deleteTask, setConfirm, setModal, setRemoveTask } from '../../redux/taskSlice';

export const ConfirmModal = ({ id }) => {
  const { confirm } = useSelector((state) => state.tasks);
  const dispatch = useDispatch();

  const ConfirmRef = React.useRef();

  const closeConfirm = () => {
    dispatch(setConfirm({ isOpen: false, event: null }));
  };

  const closeModal = () => {
    dispatch(setModal({ isOpen: false, id: null, isCreating: false }));
  };

  const RemoveTask = () => {
    dispatch(deleteTask({ id: id }));
  };

  const confirmCloseModal = () => {
    closeConfirm();
    closeModal();
  };

  const confirmRemoveTask = () => {
    RemoveTask(id);
    closeConfirm();
    closeModal();
  };

  React.useEffect(() => {
    const handleClick = (e) => {
      if (!confirm.isOpen) return;
      if (!ConfirmRef.current.contains(e.target)) {
        closeConfirm();
      }
    };
    document.addEventListener('click', handleClick);
    return () => {
      document.removeEventListener('click', handleClick);
    };
  });

  let massage;
  let acceptButton;

  switch (confirm.event) {
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
    <ModalRefactored modalType="confirm">
      <div ref={ConfirmRef} className={styles.confirm}>
        <span className={styles.confirmText}>{massage}</span>
        <div className={styles.buttonLine}>
          {confirm.event === 'close' && (
            <button className={styles.acceptButton} onClick={() => confirmCloseModal()}>
              {acceptButton}
            </button>
          )}
          {confirm.event === 'remove' && (
            <button className={styles.acceptButton} onClick={() => confirmRemoveTask()}>
              {acceptButton}
            </button>
          )}
          <button className={styles.rejectButton} onClick={() => closeConfirm()}>
            Cancel
          </button>
        </div>
      </div>
    </ModalRefactored>
  );
};
