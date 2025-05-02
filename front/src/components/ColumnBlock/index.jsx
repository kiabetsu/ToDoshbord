import React from 'react';
import { useSelector } from 'react-redux';

import styles from './style.module.scss';
import { TaskBlock } from '../TaskBlock';

export const ColumnBlock = ({ title, status }) => {
  const tasks = useSelector((state) => state.tasks.tasks.filter((obj) => obj.status === status));

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
      <div className={styles.tasksContainer}>{children}</div>
    </div>
  );
};
