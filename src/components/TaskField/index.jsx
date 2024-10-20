import React from 'react';
import DatePicker from 'react-datepicker';
import { Reorder } from 'framer-motion';

import styles from './style.module.scss';
// import 'react-datepicker/dist/react-datepicker.css';
import { DropFileInput } from '../DropFileInput/index';
import { useDispatch, useSelector } from 'react-redux';

import { setData } from '../../redux/taskSlice';

export const TaskField = ({ name, content, icon, contentEditable }) => {
  const fieldRef = React.useRef();
  const [editing, setEditing] = React.useState(false);
  const [startDate, setStartDate] = React.useState(name === 'Due date' ? content : new Date());

  const dispatch = useDispatch();
  const { tasks } = useSelector((state) => state.tasks);

  const useOutsideClick = (callback) => {
    const ref = React.useRef();

    React.useEffect(() => {
      const handleClick = (event) => {
        if (ref.current && !ref.current.contains(event.target)) {
          callback();
        }
      };

      document.addEventListener('click', handleClick);

      return () => {
        document.removeEventListener('click', handleClick);
      };
    }, [ref]);

    return ref;
  };

  const chooseContent = (name) => {
    switch (name) {
      case 'Due date':
        return (
          <input
            type="date"
            onChange={(e) => setStartDate(e.target.value)}
            className={styles.dateInput}
            value={startDate}
          />
        );

      case 'Attachment':
        return <DropFileInput />;

      default:
        return (
          <span onChange={() => console.log()} className={styles.contentText}>
            {content}
          </span>
        );
    }
  };

  const handleClickOutside = () => {
    setEditing(false);
  };

  const ref = useOutsideClick(handleClickOutside);

  const onChangeValue = (value) => {
    for (let i = 0; i < tasks.length; i++) {
      if (tasks[i].name === value) {
        dispatch(setData([...tasks, (tasks[i] = [...tasks[i], (tasks[i].name = value)])]));
      }
    }
  };

  return (
    <div className={styles.taskField}>
      <span className={styles.icon}>{icon}</span>
      <span className={styles.fieldName}>{name}</span>
      <div
        ref={ref}
        className={styles.filedContent}
        contentEditable={contentEditable}
        suppressContentEditableWarning={true}
        onChange={(e) => onChangeValue(e.target.value)}>
        {chooseContent(name)}
      </div>
    </div>
  );
};
