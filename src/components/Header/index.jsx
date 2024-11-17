import React from 'react';
import styles from './style.module.scss';
import { Columns3, ChevronDown } from 'lucide-react';
import { useDispatch } from 'react-redux';

import ava from '../../asset/Profile 01.png';
import { setModal } from '../../redux/taskSlice';
import { Filter } from '../Filter';

export const Header = () => {
  const dispatch = useDispatch();
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
            <div
              className={styles.create}
              onClick={(e) => {
                e.stopPropagation();
                dispatch(setModal({ isOpen: true, isCreating: true }));
              }}>
              <span>Create</span>
            </div>
          </div>
        </div>
        <div className={styles.rightSide}>
          <Filter />

          <div className={styles.profile}>
            <img src={ava} alt="Profile " />
          </div>
        </div>
      </div>
    </div>
  );
};
