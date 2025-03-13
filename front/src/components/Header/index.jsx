import React from 'react';
import styles from './style.module.scss';
import { Columns3, ChevronDown } from 'lucide-react';
import { useDispatch, useSelector } from 'react-redux';

import ava from '../../asset/Profile 01.png';
import { setLogin, setModal } from '../../redux/taskSlice';
import { Filter } from '../Filter';
import { LoginModal } from '../LoginModal';

export const Header = () => {
  const { modal } = useSelector((state) => state.tasks);
  const dispatch = useDispatch();

  const openLoginModal = () => {
    dispatch(setLogin({ isOpen: true, tab: 'login' }));
  };
  return (
    <>
      <LoginModal />
      <div className={styles.header}>
        <div className={styles.headerField}>
          <div className={styles.leftSide}>
            <div className={styles.logo}>
              <span>ToDoshboard</span>
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
                  dispatch(setModal({ isOpen: true, id: null, isCreating: true }));
                }}>
                <span>Create</span>
              </div>
            </div>
          </div>
          <div className={styles.rightSide}>
            <Filter />

            <div className={styles.profile}>
              {/* <img src={ava} alt="Profile " /> */}
              <button className={styles.login} onClick={() => openLoginModal()}>
                Log in
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};
