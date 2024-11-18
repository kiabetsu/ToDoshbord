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

  const data = tasks.find((task) => task.id === id);

  console.log('data', data);

  const today = new Date();
  const currentDate =
    today.getFullYear() +
    '-' +
    String(today.getMonth() + 1).padStart(2, '0') +
    '-' +
    String(today.getDate()).padStart(2, '0');

  const [editedPic, setEditedPic] = React.useState(data && data.image);
  const [editedSummery, setEditedSummery] = React.useState(data && data.summery);
  const [editedDescription, setEditedDescription] = React.useState(data && data.description);
  const [editedDueDate, setEditedDueDate] = React.useState(data ? data.due_date.date : currentDate);
  const [editedAttachments, setEditedAttachments] = React.useState(data ? data.attachments : []);
  console.log('editedSummery', editedSummery);

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

  const onCreateTask = (summery, description, due_date, attachments, pic) => {
    dispatch(
      createTask({
        summery: summery,
        description: description,
        due_date: due_date,
        attachments: attachments,
        pic: pic,
      }),
      closeModal(),
    );
  };

  const onConfirm = (summery, description, due_date, attachments, pic) => {
    console.log('pered otpravkoky', attachments);
    dispatch(
      setData({
        id: data.id,
        summery: summery,
        description: description,
        due_date: due_date,
        attachments: attachments,
        pic: pic,
      }),
      closeModal(),
    );
  };

  const onRemoveTask = (id) => {
    dispatch(setRemoveTask({ id: id }));
    closeModal();
  };

  return (
    <>
      <div className={styles.backGround}></div>
      <div className={styles.centered}>
        <div ref={modalRef} className={styles.modal}>
          <span className={styles.exit} onClick={() => closeModal()}>
            <X size={24} onClick={() => closeModal()} />
          </span>
          <div className={styles.taskImg}>
            <ImgUpload id={id} image={editedPic} setImage={setEditedPic} />

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
              <span className={styles.fieldName}>Summery</span>
              {modal.isCreating ? (
                <button
                  className={styles.createButton}
                  onClick={() =>
                    onCreateTask(
                      editedSummery,
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
                        editedSummery,
                        editedDescription,
                        editedDueDate,
                        editedAttachments,
                        editedPic,
                      )
                    }>
                    <Pencil size={20} />
                    &nbsp;Confirm
                  </button>
                  <button className={styles.removeButton} onClick={() => onRemoveTask(id)}>
                    <Trash2 size={20} />
                    &nbsp;Remove
                  </button>
                </>
              )}
              <div className={styles.fieldContent}>
                <div
                  className={styles.summery}
                  contentEditable={true}
                  suppressContentEditableWarning={true}
                  value={editedSummery}
                  onInput={(e) => {
                    console.log(e.currentTarget.textContent);
                    setEditedSummery(e.currentTarget.textContent);
                  }}>
                  <span className={styles.contentText} value={editedSummery}></span>
                  {/* <div>{editedSummery}</div> */}
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
                  className={styles.summery}
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
                <DropFileInput
                  id={id}
                  fileList={editedAttachments}
                  setFileList={setEditedAttachments}
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};
