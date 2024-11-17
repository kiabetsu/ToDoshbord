import React from 'react';
import { CalendarDays, Paperclip } from 'lucide-react';
import { useDispatch, useSelector } from 'react-redux';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';

import styles from './style.module.scss';
import pic from '../../asset/Image.png';
import ava from '../../asset/Profile 01.png';
import emj1 from '../../asset/Emoji reaction.svg';
import emj2 from '../../asset/Emoji reaction (1).svg';
import { setIdDraggingComponent, setModal, setOrderIndex, setStatus } from '../../redux/taskSlice';

export const TaskBlock = ({
  image,
  summery,
  description,
  due_date,
  status,
  id,
  order_index,
  attachments,
}) => {
  const ref = React.useRef(null);

  const dispatch = useDispatch();

  let currentDate = new Date();
  currentDate = currentDate.toISOString();

  const openModalWindow = (e) => {
    e.stopPropagation();
    dispatch(setModal({ isOpen: true, id: id }));
  };

  const { setNodeRef, attributes, listeners, transform, transition, isDragging } = useSortable({
    id: id,
    data: {
      type: 'task',
      summery,
      description,
      due_date,
      status,
      order_index,
    },
    disabled: openModalWindow,
  });

  const style = {
    transition,
    transform: CSS.Translate.toString(transform),
  };

  if (isDragging) {
    return <div ref={setNodeRef} style={style} className={styles.draggingSkeleton}></div>;
  }

  return (
    <div
      ref={setNodeRef}
      style={style}
      {...attributes}
      {...listeners}
      // className={isDragging ? styles.draggingSkeleton : styles.task}
      className={styles.task}
      onClick={(e) => {
        openModalWindow(e);
      }}>
      <div className={styles.img}>
        <img src={image} alt="Picture" />
      </div>
      <div className={styles.title}>
        <div className={styles.taskTitle}>
          <h4>{summery}</h4>
        </div>
        <p className={styles.emoji}>
          {due_date.date > currentDate || status === 2 ? <img src={emj1} /> : <img src={emj2} />}
        </p>
      </div>
      <div className={styles.description}>{description}</div>
      <div className={styles.info}>
        <div className={styles.leftInfo}>
          <div className={styles.dueDate}>
            <CalendarDays />
            <p>{due_date.date_format}</p>
          </div>
          {attachments.length > 0 && (
            <div className={styles.attachmentsBlock}>
              <Paperclip />
              <p className={styles.attachments}>
                {attachments.length} attachment{attachments.length > 1 && 's'}{' '}
              </p>
            </div>
          )}
        </div>
        <div className={styles.assignTo}>
          <img src={ava} alt="Assign to" />
        </div>
      </div>

      <div
        className={styles.progressBar}
        style={{
          width: `${(100 / 3) * (status + 1)}%`,
          borderRadius: `${status === 2 ? '3px' : '3px 0 0 3px'}`,
        }}></div>
    </div>
  );
};
