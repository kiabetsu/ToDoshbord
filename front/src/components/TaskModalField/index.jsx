import React from 'react';
import styles from './styles.module.scss';

export const TaskModalField = ({ icon, name, style, children }) => {
  return (
    <div className={styles.taskField} style={style}>
      <span className={styles.icon}>{icon}</span>
      <span className={styles.fieldName}>{name}</span>
      <div className={styles.fieldContent}>{children}</div>
    </div>
  );
};
