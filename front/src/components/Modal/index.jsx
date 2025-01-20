import React from 'react';
import {
  Pencil,
  AlignLeft,
  Paperclip,
  CalendarDays,
  Baseline,
  X,
  Plus,
  Trash2,
  ImagePlus,
} from 'lucide-react';

import styles from './style.module.scss';
// import pic from '../../asset/Image.png';
import { useSelector, useDispatch } from 'react-redux';
import {
  setDueDate,
  setModal,
  setDataTextContent,
  setData,
  setRemoveTask,
  createTask,
} from '../../redux/taskSlice';
import { DropFileInput, ImgUpload } from '../DropFileInput';

export const Modal = ({ id }) => {
  const { tasks, modal } = useSelector((state) => state.tasks);
  const dispatch = useDispatch();

  const data = modal.isOpen && tasks.find((task) => task.id === modal.id);

  console.log('data', data);

  const today = new Date();
  const currentDate =
    today.getFullYear() +
    '-' +
    String(today.getMonth() + 1).padStart(2, '0') +
    '-' +
    String(today.getDate()).padStart(2, '0');

  const [editedPic, setEditedPic] = React.useState(data && data.image);
  const [editedSummary, setEditedSummary] = React.useState(data && data.summary);
  const [editedDescription, setEditedDescription] = React.useState(data && data.description);
  const [editedDueDate, setEditedDueDate] = React.useState(data ? data.due_date.date : currentDate);
  const [editedAttachments, setEditedAttachments] = React.useState(data ? data.attachments : []);
  console.log('editedSummery', editedSummery);

  React.useEffect(() => {
    setEditedPic(data ? data.image : null);
    setEditedSummary(data ? data.summary : null);
    setEditedDescription(data ? data.description : null);
    setEditedDueDate(data ? data.due_date.date : currentDate);
    setEditedAttachments(data ? data.attachments : []);
  }, [modal]);

  const modalRef = React.useRef();

  const closeModal = () => {
    dispatch(setModal({ isOpen: false, id: null, isCreating: false }));
  };

  React.useEffect(() => {
    const handleClick = (e) => {
      if (modal.isOpen === false) return;
      if (!modalRef.current.contains(e.target)) {
        closeModal();
      }
    };
    document.addEventListener('click', handleClick);
    return () => {
      document.removeEventListener('click', handleClick);
    };
  });

<<<<<<< HEAD:front/src/components/Modal/index.jsx
  const [startDate, setStartDate] = React.useState(data ? data.due_date.date : null);

  const onCreateTask = (summary, description, due_date, attachments, pic) => {
=======
  const onCreateTask = (summery, description, due_date, attachments, pic) => {
>>>>>>> main:src/components/Modal/index.jsx
    dispatch(
      createTask({
        summary: summary,
        description: description,
        due_date: due_date,
        attachments: attachments,
        pic: pic,
      }),
      closeModal(),
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
      closeModal(),
    );
  };

  const onRemoveTask = () => {
    dispatch(setRemoveTask({ id: data.id }));
    closeModal();
  };

  return (
    <>
      <div
        className={styles.backGround}
        style={{
          opacity: `${modal.isOpen ? 1 : 0}`,
          pointerEvents: `${modal.isOpen ? 'all' : 'none'}`,
        }}></div>
      <div
        className={styles.centered}
        style={{
          transform: `translate(-50%, -50%) ${modal.isOpen ? 'scale(1)' : 'scale(0)'}`,
          opacity: `${modal.isOpen ? 1 : 0}`,
        }}>
        <div ref={modalRef} className={styles.modal}>
          <span className={styles.exit} onClick={() => closeModal()}>
            <X size={24} onClick={() => closeModal()} />
          </span>
          <div className={styles.taskImg}>
            <ImgUpload image={editedPic} setImage={setEditedPic} />

            {/* {modal.isCreating ? (
              // <div className={styles.changeImg}>
              //   <div className={styles.iconBorder}>
              //     <ImagePlus className={styles.uploadIcon} size={64} />
              //   </div>

              //   <span>Upload image for the task</span>
              // </div>
              <ImgUpload id={id} />
            ) : (
              <img src={pic} alt="Picture" />
            )} */}
          </div>
          <div className={styles.content}>
            <div className={styles.taskField}>
              <span className={styles.icon}>
                <Baseline />
              </span>
              <span className={styles.fieldName}>Summary</span>
              {modal.isCreating ? (
                <button
                  className={styles.createButton}
                  onClick={() =>
                    onCreateTask(
                      editedSummary,
                      editedDescription,
                      editedDueDate,
                      editedAttachments,
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
                        editedSummary,
                        editedDescription,
                        editedDueDate,
                        editedAttachments,
                        editedPic,
                      )
                    }>
                    <Pencil size={20} />
                    &nbsp;Confirm
                  </button>
                  <button className={styles.removeButton} onClick={() => onRemoveTask()}>
                    <Trash2 size={20} />
                    &nbsp;Remove
                  </button>
                </>
              )}
              <div className={styles.fieldContent}>
                <div
                  className={styles.summary}
                  contentEditable={true}
                  suppressContentEditableWarning={true}
                  value={editedSummery}
                  onInput={(e) => {
                    setEditedSummary(e.currentTarget.textContent);
                  }}>
<<<<<<< HEAD:front/src/components/Modal/index.jsx
                  <span className={styles.contentText} value={editedSummary} />
=======
                  <span className={styles.contentText} value={editedSummery}></span>
                  {/* <div>{editedSummery}</div> */}
>>>>>>> main:src/components/Modal/index.jsx
                </div>
              </div>
            </div>

            <div className={styles.taskField}>
              <span className={styles.icon}>
                <AlignLeft />
              </span>
              <span className={styles.fieldName}>Description</span>
              <div className={styles.fieldContent}>
                <div
                  className={styles.summary}
                  contentEditable={true}
                  suppressContentEditableWarning={true}
                  onInput={(e) => setEditedDescription(e.currentTarget.textContent)}>
                  <span className={styles.contentText} value={editedDescription} />
                </div>
              </div>
            </div>

            <div className={styles.taskField}>
              <span className={styles.icon}>
                <CalendarDays />
              </span>
              <span className={styles.fieldName}>Due date</span>
              <div className={styles.fieldContent}>
                <input
                  type="date"
                  className={styles.dateInput}
                  value={editedDueDate}
                  onChange={(e) => setEditedDueDate(e.target.value)}
                />
              </div>
            </div>

            <div className={styles.taskField}>
              <span className={styles.icon}>
                <Paperclip />
              </span>
              <span className={styles.fieldName}>Attachment</span>
              <div className={styles.fieldContent} style={{ width: '100%' }}>
                <DropFileInput fileList={editedAttachments} setFileList={setEditedAttachments} />
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

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
