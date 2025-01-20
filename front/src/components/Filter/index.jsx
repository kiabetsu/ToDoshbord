import React from 'react';
import { ListFilter } from 'lucide-react';

import styles from './styles.module.scss';
import { setTasksFilter } from '../../redux/taskSlice';
import { useDispatch } from 'react-redux';

export const Filter = (props) => {
  const dispatch = useDispatch();
  return (
    <>
      <div className={styles.filterButton}>
        <ListFilter size={20} />
      </div>
      <div className={styles.popupFilter} size={90}>
        <input
          type="text"
          placeholder="Search"
          className={styles.inputFilter}
          onInput={(e) => {
            dispatch(setTasksFilter({ filter: e.currentTarget.value }));
          }}
        />
      </div>
    </>
  );
};
