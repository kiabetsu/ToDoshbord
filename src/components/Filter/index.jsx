import React from 'react';
import { ListFilter } from 'lucide-react';

import styles from './styles.module.scss';

export const Filter = (props) => {
  return (
    <>
      <div className={styles.filterButton}>
        <ListFilter size={20} />
      </div>
      <div className={styles.popupFilter} size={90}>
        <input type="text" placeholder="Search" className={styles.inputFilter} />
      </div>
    </>
  );
};
