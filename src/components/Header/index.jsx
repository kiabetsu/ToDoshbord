import React from 'react';
import styles from './style.module.scss';
import { Columns3, ListFilter, ChevronDown } from 'lucide-react';
import ava from '../../asset/Profile 01.png';

export const Header = () => {
  return (
    <div className={styles.header}>
      <div className={styles.headerField}>
        <div className={styles.leftSide}>
          <div className={styles.logo}>
            <span>ToDoshbord</span>
          </div>
          <div className={styles.teg}>new</div>
          <div className={styles.func}>
            <div className={styles.representation}>
              <span>
                <Columns3 size={20} />
              </span>
              <span>Board</span>
              <span>
                <ChevronDown size={20} />
              </span>
              {/* <div className={styles.typeList}>
          <span>Representation</span>
          <ul>
            <li>Board</li>
            <li>Table</li>
            <li>Calendar</li>
          </ul>
        </div> */}
            </div>
            <div className={styles.create}>
              <span>Create</span>
            </div>
          </div>
        </div>
        <div className={styles.rightSide}>
          <div className={styles.filter}>
            <ListFilter size={20} />
          </div>
          <div className={styles.profile}>
            <img src={ava} alt="Profile " />
          </div>
        </div>
      </div>
    </div>
  );
};
