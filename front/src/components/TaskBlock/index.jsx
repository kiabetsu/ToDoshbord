import React from 'react';
import { CalendarDays, Paperclip } from 'lucide-react';
import { useDispatch } from 'react-redux';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import TextareaAutosize from 'react-textarea-autosize';

import styles from './style.module.scss';
import ava from '../../asset/Profile 01.png';
import emj1 from '../../asset/Emoji reaction.svg';
import emj2 from '../../asset/Emoji reaction (1).svg';
import { setModal } from '../../redux/taskSlice';

export const TaskBlock = ({
  picture,
  summary,
  description,
  due_date,
  status,
  id,
  order_index,
  attachments,
}) => {
  const dispatch = useDispatch();

  let currentDate = new Date();
  currentDate = currentDate.toISOString();

  const openModalWindow = (e) => {
    e.stopPropagation();
    dispatch(setModal({ isOpen: true, id: id }));
  };

  const { setNodeRef, attributes, listeners, transform, transition } = useSortable({
    id: id,
    data: {
      type: 'task',
    },
  });

  const style = {
    transition,
    transform: CSS.Translate.toString(transform),
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      {...attributes}
      {...listeners}
      className={styles.task}
      onClick={(e) => {
        openModalWindow(e);
      }}>
      <div className={styles.img}>
        {typeof picture?.url !== 'undefined' && <img src={picture.url} alt="Picture" />}
      </div>
      <div className={styles.title}>
        <div className={styles.taskTitle}>
          <h4>{summary}</h4>
        </div>
        <p className={styles.emoji}>
          {due_date.date > currentDate || status === 2 ? <img src={emj1} /> : <img src={emj2} />}
        </p>
      </div>
      <TextareaAutosize
        className={styles.description}
        value={description}
        readOnly
        minRows={1}
        maxRows={3}
      />
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
                {attachments.length} attachment{attachments.length > 1 && 's'}
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
