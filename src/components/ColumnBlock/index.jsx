import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useDrop } from 'react-dnd';

import styles from './style.module.scss';
import { TaskBlock } from '../TaskBlock';
import { setStatus } from '../../redux/taskSlice';

export const ColumnBlock = ({ title, status }) => {
  const tasks = useSelector((state) => state.tasks.tasks.filter((obj) => obj.status === status));
  const { idDraggingComponent } = useSelector((state) => state.tasks);

  const dispatch = useDispatch();

  console.log('barbariki', title, tasks);

  const changeStatus = (id, status) => {
    const data = { id: id, status: status };
    dispatch(setStatus(data));
  };

  const [{ isOver }, drop] = useDrop(
    () => ({
      accept: 'task',
      drop: (item) => changeStatus(item.id, status),
      collect: (monitor) => ({
        isOver: !!monitor.isOver(),
      }),
    }),
    [status],
  );

  return (
    <div ref={drop} className={styles.column} style={{}}>
      <div className={styles.columnTitle}>
        <h2>{title}</h2>
      </div>
      <div className={styles.tasksList}>
        {tasks.map((obj) => (
          <TaskBlock key={obj.id} {...obj} />
        ))}
      </div>
    </div>
  );
};
