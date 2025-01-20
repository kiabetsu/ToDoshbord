import React, { useState } from 'react';
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
import DatePicker from 'react-date-picker';
import 'react-date-picker/dist/DatePicker.css';
import 'react-calendar/dist/Calendar.css';

import { ModalRefactored } from '../Modal';
import { AlertModal } from '../AlertModal';
import { ImgUpload, DropFileInput } from '../DropFileInput';
import styles from './styles.module.scss';
import { useDispatch, useSelector } from 'react-redux';
import {
  setDueDate,
  setModal,
  setDataTextContent,
  setData,
  setRemoveTask,
  createTask,
  setAlert,
} from '../../redux/taskSlice';
import { Tiptap } from '../Tiptap';
import { TaskModalField } from '../TaskModalField';
import AutoWidthInput from '../AutoWidthInput';

export const TaskModal = () => {
  const { modal, tasks, alert } = useSelector((state) => state.tasks);
  const dispatch = useDispatch();

  const data = modal.id !== null && modal.isOpen && tasks.find((task) => task.id === modal.id);

  const today = new Date();
  const currentDate =
    today.getFullYear() +
    '-' +
    String(today.getMonth() + 1).padStart(2, '0') +
    '-' +
    String(today.getDate()).padStart(2, '0');

  const [editedPic, setEditedPic] = React.useState(data ? data.image : null);
  const [isLoaded, setLoaded] = React.useState(false);
  const [editedSummary, setEditedSummary] = React.useState(data ? data.summary : '');
  const [editedDescription, setEditedDescription] = React.useState(data ? data.description : '');
  const [editedDueDate, setEditedDueDate] = React.useState(data ? data.due_date.date : '');
  const [editedAttachments, setEditedAttachments] = React.useState(data ? data.attachments : []);
  const editableDescriptionRef = React.useRef(null);
  const summaryInputRef = React.useRef(null);
  const summarySpanRef = React.useRef(null);

  React.useEffect(() => {
    if ((data || modal.isCreating) && !isLoaded) {
      setEditedPic(data ? data.image : null);
      setEditedSummary(data ? data.summary : '');
      setEditedDescription(data ? data.description : '');
      setEditedDueDate(data ? data.due_date.date : '');
      setEditedAttachments(data ? data.attachments : []);
      setLoaded(true);
    }
  }, [modal]);

  // React.useEffect(() => {
  //   if (isLoaded) {
  //     editableDescriptionRef.current.textContent = editedDescription;
  //   }
  // }, [editedDescription]);

  const modalRef = React.useRef();

  const closeModal = (e, event) => {
    e.stopPropagation();

    if (
      editedPic !== data.image ||
      editedSummary !== data.summary ||
      editedDescription !== data.description ||
      editedDueDate !== data.due_date.date ||
      editedAttachments !== data.attachments ||
      event === 'remove'
    ) {
      openConfirm(event);
    } else {
      dispatch(setModal({ isOpen: false, id: null, isCreating: false }));
    }
    setLoaded(false);
  };

  const openConfirm = (event) => {
    dispatch(setAlert({ isOpen: true, event: event }));
  };

  React.useEffect(() => {
    const handleClick = (e) => {
      if (modal.isOpen === false || alert.isOpen) return;
      if (e.target.className.includes('rejectButton')) return;
      if (!modalRef.current.contains(e.target)) {
        closeModal(e, 'close');
      }
    };
    document.addEventListener('click', handleClick);
    return () => {
      document.removeEventListener('click', handleClick);
    };
  });

  const onCreateTask = (summary, description, due_date, attachments, pic) => {
    dispatch(
      createTask({
        summary: summary,
        description: description,
        due_date: due_date,
        attachments: attachments,
        pic: pic,
      }),
      dispatch(setModal({ isOpen: false, id: null, isCreating: false })),
    );
  };

  const onConfirm = (summary, description, due_date, attachments, pic) => {
    dispatch(
      setData({
        id: data.id,
        summary: summary,
        description: description,
        due_date: due_date,
        attachments: attachments,
        pic: pic,
      }),
      dispatch(setModal({ isOpen: false, id: null, isCreating: false })),
    );
    setLoaded(false);
  };

  const onRemoveTask = (e) => {
    closeModal(e, 'remove');
  };

  const buttonRow = modal.isCreating ? (
    <button
      className={styles.createButton}
      onClick={() =>
        onCreateTask(editedSummary, editedDescription, editedDueDate, editedAttachments, editedPic)
      }>
      <Plus size={20} />
      &nbsp;Create
    </button>
  ) : (
    <>
      <button
        className={styles.editButton}
        onClick={() =>
          onConfirm(editedSummary, editedDescription, editedDueDate, editedAttachments, editedPic)
        }>
        <Pencil size={20} />
        &nbsp;Confirm
      </button>
      <button className={styles.removeButton} onClick={(e) => onRemoveTask(e)}>
        <Trash2 size={20} />
        &nbsp;Remove
      </button>
    </>
  );

  const handleKeyDown = (event) => {
    // Обработка нажатия клавиши Enter
    if (event.key === 'Enter') {
      event.preventDefault(); // Предотвращаем переход на новую строку
      const selection = window.getSelection();
      const range = selection.getRangeAt(0);
      const newLine = document.createElement('div'); // Создаем новый div для новой строки
      newLine.innerHTML = '<br>'; // Добавляем перенос строки
      range.insertNode(newLine); // Вставляем новый div в текущее положение курсора
      range.setStartAfter(newLine); // Устанавливаем курсор после нового div
      range.collapse(true);
      selection.removeAllRanges();
      selection.addRange(range);
    }
  };

  return (
    <ModalRefactored modalType="task">
      <AlertModal id={data.id} />
      <span className={styles.exit}>
        <X size={24} onClick={(e) => closeModal(e, 'close')} />
      </span>
      <div ref={modalRef} className={styles.modal}>
        <div className={styles.taskImg}>
          <ImgUpload image={editedPic} setImage={setEditedPic} />
        </div>
        <div className={styles.content}>
          <TaskModalField icon={<Baseline />} name="Summary" style={{ position: 'relative' }}>
            <div className={styles.buttonRow}>{buttonRow}</div>
            <AutoWidthInput value={editedSummary} setValue={setEditedSummary} />
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
              value={editedDueDate === null ? currentDate : editedDueDate}
              onChange={(e) => setEditedDueDate(e.target.value)}
            />
          </TaskModalField>
          <TaskModalField icon={<Paperclip />} name="Attachments">
            <DropFileInput fileList={editedAttachments} setFileList={setEditedAttachments} />
          </TaskModalField>
        </div>
      </div>
    </ModalRefactored>
  );
};
