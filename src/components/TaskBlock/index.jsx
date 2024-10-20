import React from 'react';
import { CalendarDays } from 'lucide-react';
import { useDispatch, useSelector } from 'react-redux';
import { useDrag } from 'react-dnd';

import styles from './style.module.scss';
import pic from '../../asset/Image.png';
import ava from '../../asset/Profile 01.png';
import emj1 from '../../asset/Emoji reaction.svg';
import emj2 from '../../asset/Emoji reaction (1).svg';
import { setIdDraggingComponent, setModal } from '../../redux/taskSlice';

export const TaskBlock = ({ summery, description, due_date, status, id }) => {
  // const [modalIsOpen, setModalIsOpen] = useState(false);

  const { modal, idDraggingComponent } = useSelector((state) => state.tasks);
  const dispatch = useDispatch();

  const [{ isDragging }, drag] = useDrag(() => ({
    type: 'task',
    item: { id },
    collect: (monitor) => ({
      isDragging: !!monitor.isDragging(),
    }),
  }));

  return (
    <>
      <div
        ref={drag}
        // onDragStart={() => dispatch(setIdDraggingComponent(id))}
        // onDragEnd={() => dispatch(setIdDraggingComponent(null))}
        className={styles.task}
        onClick={(e) => {
          e.stopPropagation();
          dispatch(setModal({ isOpen: true, id: id }));
        }}>
        <div className={styles.img}>
          <img src={pic} alt="Picture" />
        </div>
        <div className={styles.title}>
          <div className={styles.taskTitle}>
            <h4>{summery}</h4>
          </div>
          <p className={styles.emoji}>
            {due_date > Date.now && status !== 2 ? <img src={emj1} /> : <img src={emj2} />}
          </p>
        </div>
        <div className={styles.description}>{description}</div>
        <div className={styles.info}>
          <div className={styles.dueDate}>
            <CalendarDays /> &nbsp;
            <p>{due_date}</p>
          </div>
          <div className={styles.assignTo}>
            <img src={ava} alt="Assign to" />
          </div>
        </div>
        <div className={styles.progressBar}></div>
      </div>
    </>
  );
};
