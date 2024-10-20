import React from 'react';
import { Pencil, AlignLeft, Paperclip, CalendarDays, Baseline, X } from 'lucide-react';

import { TaskField } from '../TaskField';
import styles from './style.module.scss';
import pic from '../../asset/Image.png';
import { useSelector, useDispatch } from 'react-redux';
import { setModal } from '../../redux/taskSlice';

const AlignLeftIcon = <AlignLeft />;
const BaselineIcon = <Baseline />;
const CalendarDaysIcon = <CalendarDays />;
const PaperclipIcon = <Paperclip />;

// const data = {
//   summery: 'Read books',
//   description:
//     'According to research by the University of Michigan, it is reading fiction that helps activate new areas of the brain and develop imagination. However, while playing on a computer, these same areas of the brain remain unused.',
//   due_date: '2024-12-31',
// };

export const Modal = ({ id }) => {
  const { tasks, modal } = useSelector((state) => state.tasks);
  const dispatch = useDispatch();

  const data = tasks.find((task) => {
    return task.id === id;
  });

  const modalRef = React.useRef();

  const closeModal = () => {
    dispatch(setModal({ isOpen: false, id: null }));
  };

  React.useEffect(() => {
    const handleClick = (e) => {
      if (modal.isOpen === false) return;
      if (!modalRef.current.contains(e.target)) {
        closeModal();
        console.log('i zakrivau');
      }
    };
    document.addEventListener('click', handleClick);
    return () => {
      document.removeEventListener('click', handleClick);
    };
  });

  return (
    <>
      <div className={styles.backGround}></div>
      <div className={styles.centered}>
        <div ref={modalRef} className={styles.modal}>
          <span className={styles.exit} onClick={() => closeModal()}>
            <X size={24} onClick={() => closeModal()} />
          </span>
          <div className={styles.taskField}>
            <img src={pic} alt="Picture" />
          </div>
          <div className={styles.content}>
            <TaskField
              name="Summery"
              content={data.summery}
              icon={BaselineIcon}
              id={id}
              contentEditable={true}
            />
            <TaskField
              name="Description"
              content={data.description}
              icon={AlignLeftIcon}
              contentEditable={true}
            />
            <TaskField
              name="Due date"
              content={data.due_date}
              icon={CalendarDaysIcon}
              contentEditable={false}
            />
            <TaskField name="Attachment" icon={PaperclipIcon} contentEditable={false} />
          </div>
        </div>
      </div>
    </>
  );
};
