import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { SortableContext } from '@dnd-kit/sortable';

import styles from './style.module.scss';
import { TaskBlock } from '../TaskBlock';
import { setStatus } from '../../redux/taskSlice';

export const ColumnBlock = ({ title, status }) => {
  const tasks = useSelector((state) => state.tasks.tasks.filter((obj) => obj.status === status));
  const { idDraggingComponent } = useSelector((state) => state.tasks);

  const dispatch = useDispatch();

  const changeStatus = (id, status) => {
    const data = { id: id, status: status };
    dispatch(setStatus(data));
  };

  return (
    <div className={styles.column} style={{}}>
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

export const ColumnBlockRefactor = ({ statusTitle, children }) => {
  return (
    <div className={styles.column}>
      <div className={styles.columnTitle}>
        <h2>{statusTitle}</h2>
      </div>
      {children}
    </div>
  );
};
