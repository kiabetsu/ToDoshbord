import React from 'react';
import {
  Baseline,
  Plus,
  Pencil,
  Trash2,
  Paperclip,
  CalendarDays,
  AlignLeft,
  X,
} from 'lucide-react';
import TextareaAutosize from 'react-textarea-autosize';
import 'react-date-picker/dist/DatePicker.css';
import 'react-calendar/dist/Calendar.css';

import { ModalRefactored } from '../Modal';
import { ConfirmModal } from '../ConfirmModal';
import { ImgUpload, DropFileInput } from '../DropFileInput';
import styles from './styles.module.scss';
import { useDispatch, useSelector } from 'react-redux';
import { setModal, setConfirm, addTask, updateTask, addAlert } from '../../redux/taskSlice';

import { TaskModalField } from '../TaskModalField';

export const TaskModal = () => {
  const { modal, tasks, confirm } = useSelector((state) => state.tasks);
  const dispatch = useDispatch();

  const data = modal.id !== null && modal.isOpen && tasks.find((task) => task.id === modal.id);

  const today = new Date();
  const currentDate =
    today.getFullYear() +
    '-' +
    String(today.getMonth() + 1).padStart(2, '0') +
    '-' +
    String(today.getDate()).padStart(2, '0');

  const [editedPic, setEditedPic] = React.useState(data ? data.picture.url : null);
  const [isLoaded, setLoaded] = React.useState(false);
  const [editedSummary, setEditedSummary] = React.useState(data ? data.summary : '');
  const [editedDescription, setEditedDescription] = React.useState(data ? data.description : '');
  const [editedDueDate, setEditedDueDate] = React.useState(data ? data.due_date.date : '');
  const [oldAttachments, setOldAttachments] = React.useState(data ? data.attachments : []);
  const [newAttachments, setNewAttachments] = React.useState([]);
  const [isRequiredFiled, setRequiredField] = React.useState(false);

  React.useEffect(() => {
    if ((data || modal.isCreating) && !isLoaded) {
      setEditedPic(data ? data.picture.url : null);
      setEditedSummary(data ? data.summary : '');
      setEditedDescription(data ? data.description : '');
      setEditedDueDate(data ? data.due_date.date : currentDate);
      setOldAttachments(data ? data.attachments : []);
      setLoaded(true);
    }
  }, [modal]);

  const modalRef = React.useRef();

  const closeModal = (e, event) => {
    e.stopPropagation();

    if (
      (editedPic !== data.picture?.url ||
        editedSummary !== data.summary ||
        editedDescription !== data.description ||
        editedDueDate !== data.due_date.date ||
        oldAttachments !== data.attachments ||
        event === 'remove') &&
      !modal.isCreating
    ) {
      openConfirm(event);
    } else {
      dispatch(setModal({ isOpen: false, id: null, isCreating: false }));
    }
    setLoaded(false);
  };

  const openConfirm = (event) => {
    dispatch(setConfirm({ isOpen: true, event: event }));
  };

  React.useEffect(() => {
    const handleClick = (e) => {
      if (modal.isOpen === false || confirm.isOpen) return;
      // if (e.target.className.includes('rejectButton')) return;
      if (!modalRef.current.contains(e.target)) {
        closeModal(e, 'close');
      }
    };
    document.addEventListener('click', handleClick);
    return () => {
      document.removeEventListener('click', handleClick);
    };
  });

  const onCreateTask = (summary, description, due_date, oldAttachments, newAttachments, pic) => {
    dispatch(
      addTask({
        summary: summary,
        description: description,
        due_date: due_date,
        oldAttachments: oldAttachments,
        newAttachments: newAttachments,
        image: pic,
      }),
    );
    dispatch(setModal({ isOpen: false, id: null, isCreating: false }));
    setNewAttachments([]);
  };

  const onConfirm = (id, summary, description, due_date, oldAttachments, newAttachments, pic) => {
    if (summary) {
      dispatch(
        updateTask({
          id: id,
          summary: summary,
          description: description,
          due_date: due_date,
          oldAttachments: oldAttachments,
          newAttachments: newAttachments,
          image: pic,
        }),
      );
      dispatch(setModal({ isOpen: false, id: null, isCreating: false }));
      setLoaded(false);
      dispatch(addAlert({ status: 'success', message: 'The task was update success' }));
    } else {
      setRequiredField(true);
      dispatch(addAlert({ status: 'error', message: 'Enter summary' }));
    }
    setNewAttachments([]);
  };

  const onRemoveTask = (e, id) => {
    closeModal(e, 'remove');
    // dispatch(deleteTask({ id: id }));
  };

  const buttonRow = modal.isCreating ? (
    <button
      className={styles.createButton}
      onClick={() =>
        onCreateTask(
          editedSummary,
          editedDescription,
          editedDueDate,
          oldAttachments,
          newAttachments,
          editedPic,
        )
      }>
      <Plus size={20} />
      &nbsp;Create
    </button>
  ) : (
    <>
      <button
        className={styles.editButton}
        onClick={() =>
          onConfirm(
            data.id,
            editedSummary,
            editedDescription,
            editedDueDate,
            oldAttachments,
            newAttachments,
            editedPic,
          )
        }>
        <Pencil size={20} />
        &nbsp;Confirm
      </button>
      <button className={styles.removeButton} onClick={(e) => onRemoveTask(e, data.id)}>
        <Trash2 size={20} />
        &nbsp;Remove
      </button>
    </>
  );

  return (
    <ModalRefactored modalType="task">
      <ConfirmModal id={data?.id} />
      <span className={styles.exit}>
        <X size={24} onClick={(e) => closeModal(e, 'close')} />
      </span>
      <div ref={modalRef} className={styles.modal}>
        <div className={styles.taskImg}>
          <ImgUpload image={editedPic} setImage={setEditedPic} />
        </div>
        <div className={styles.content}>
          <TaskModalField icon={<Baseline />} name="Summary*" style={{ position: 'relative' }}>
            <div className={styles.buttonRow}>{buttonRow}</div>
            <input
              type="text"
              className={styles.summaryInput}
              style={{ border: `${isRequiredFiled ? '1px solid red' : ''}` }}
              value={editedSummary}
              placeholder="Briefly describe your task..."
              onChange={(e) => {
                setRequiredField(false);
                setEditedSummary(e.target.value);
              }}
            />
          </TaskModalField>
          <TaskModalField icon={<AlignLeft />} name="Description">
            <TextareaAutosize
              className={styles.textarea}
              onChange={(e) => setEditedDescription(e.target.value)}
              value={editedDescription}
              placeholder="Enter a description for your task..."
              minRows={3}
            />
          </TaskModalField>
          <TaskModalField icon={<CalendarDays />} name="Due date">
            <input
              type="date"
              className={styles.dateInput}
              value={editedDueDate === '' ? currentDate : editedDueDate}
              onChange={(e) => setEditedDueDate(e.target.value)}
            />
          </TaskModalField>
          <TaskModalField icon={<Paperclip />} name="Attachments">
            <DropFileInput
              fileList={oldAttachments}
              setFileList={setOldAttachments}
              newFiles={newAttachments}
              setNewFiles={setNewAttachments}
            />
          </TaskModalField>
        </div>
      </div>
    </ModalRefactored>
  );
};
