import React from 'react';

import styles from './styles.module.scss';
import { login, registration } from '../../redux/authSlice';
import { useDispatch, useSelector } from 'react-redux';
import { AuthField } from '../AuthField';

export const LoginModal = (props) => {
  const [isLogin, setIsLogin] = React.useState(true);

  const [username, setUsername] = React.useState('');
  const [password, setPassword] = React.useState('');

  const [reg_username, setReg_username] = React.useState('');
  const [reg_email, setReg_email] = React.useState('');
  const [reg_password, setReg_password] = React.useState('');
  const [reg_passwordConfirm, setReg_passwordConfirm] = React.useState('');

  const usernameRef = React.useRef(null);
  const passwordRef = React.useRef(null);
  const loginButtonRef = React.useRef(null);
  const regUsernameRef = React.useRef(null);
  const regEmailRef = React.useRef(null);
  const regPasswordRef = React.useRef(null);
  const regPasswordConfirmRef = React.useRef(null);
  const regButtonRef = React.useRef(null);

  const dispatch = useDispatch();
  const { isAuth, status } = useSelector((state) => state.auth);

  const handelBackToStart = (e, next) => {
    if (e.key === 'Tab') {
      e.preventDefault();
      next.current.focus();
    }
  };

  const clearLoginState = () => {
    usernameRef.current.value = '';
    passwordRef.current.value = '';
  };

  const clearRegState = () => {
    regUsernameRef.current.value = '';
    regEmailRef.current.value = '';
    regPasswordRef.current.value = '';
    regPasswordConfirmRef.current.value = '';
  };

  return (
    <div
      className={styles.wrapper}
      style={{
        opacity: `${isAuth ? '0' : '1'}`,
        pointerEvents: `${isAuth ? 'none' : 'initial'}`,
      }}>
      <div className={styles.centered}>
        <div className={styles.contentBox} style={{ height: `${isLogin ? '500px' : '650px'}` }}>
          <div
            className={styles.carousel}
            style={{ transform: `${isLogin ? 'translateX(0)' : 'translateX(-728px)'}` }}>
            <div className={styles.inputBox}>
              <h1>Sign in</h1>
              <AuthField
                ref={usernameRef}
                name={'Username'}
                onChange={setUsername}
                nextTarget={passwordRef}
                warningCondition={!username}
                warningText={'Enter your username'}
              />
              <AuthField
                ref={passwordRef}
                name={'Password'}
                onChange={setPassword}
                nextTarget={loginButtonRef}
                pressButton={true}
                warningCondition={!password}
                warningText={'Enter your password'}
              />
              <div className={styles.loginButtonAndAgree}>
                <label className={styles.rememberCheckbox}>
                  <input type="checkbox" name="rememberMe" id="" />
                  <span className={styles.checkmark}></span>
                  <span>Remember me</span>
                </label>
                <button
                  ref={loginButtonRef}
                  className={`${
                    username && password ? `${styles.loginButton} ` : `${styles.inactiveButton}`
                  } ${status === 'error' && styles.shake}`}
                  disabled={username && password ? false : true}
                  onClick={() => {
                    dispatch(login({ username: username, password: password }));
                    clearLoginState();
                  }}>
                  {' '}
                  Log in {status === 'padding' && <div className={styles.spinner}></div>}
                </button>
                <span>
                  By creating an account, you agree to the &nbsp;
                  <a href="#"> Terms of use </a>
                  &nbsp; and &nbsp;
                  <a rel="stylesheet" href="#">
                    Privacy Policy
                  </a>
                  .
                </span>
                <div className={styles.rowFlex}>
                  <div>
                    <a href="#">Other issue with sign in</a>
                  </div>
                  <div>
                    <a href="#" onKeyDown={(e) => handelBackToStart(e, usernameRef)}>
                      Forget your password
                    </a>
                  </div>
                </div>
              </div>
            </div>

            <div className={styles.inputBox}>
              <h1>Sign up</h1>
              <AuthField
                ref={regUsernameRef}
                name={'Username'}
                description={'Username may only contain alphanumeric characters or single hyphens.'}
                onChange={setReg_username}
                warningCondition={reg_username.length < 8}
                nextTarget={regEmailRef}
              />
              <AuthField
                ref={regEmailRef}
                name={'Email'}
                onChange={setReg_email}
                warningCondition={!reg_email.includes('@')}
                warningText={'Incorrect email'}
                nextTarget={regPasswordRef}
              />
              <AuthField
                ref={regPasswordRef}
                name={'Password'}
                description={'Password should be at least 8 characters.'}
                onChange={setReg_password}
                warningCondition={reg_password.length < 8}
                nextTarget={regPasswordConfirmRef}
              />
              <AuthField
                ref={regPasswordConfirmRef}
                name={'Repeat password'}
                onChange={setReg_passwordConfirm}
                warningCondition={reg_passwordConfirm !== reg_password}
                warningText={'Password failed'}
                nextTarget={regButtonRef}
                pressButton={true}
              />
              <div className={styles.loginButtonAndAgree}>
                <button
                  ref={regButtonRef}
                  className={`${
                    reg_username.length >= 8 &&
                    reg_email.includes('@') &&
                    reg_password.length >= 8 &&
                    reg_passwordConfirm === reg_password
                      ? `${styles.loginButton}`
                      : `${styles.inactiveButton}`
                  } ${status === 'error' && styles.shake}`}
                  disabled={
                    reg_username.length >= 8 &&
                    reg_email.includes('@') &&
                    reg_password.length >= 8 &&
                    reg_passwordConfirm === reg_password
                      ? false
                      : true
                  }
                  onClick={() => {
                    dispatch(
                      registration({
                        username: reg_username,
                        email: reg_email,
                        password: reg_password,
                      }),
                    );
                    clearRegState();
                  }}>
                  Sign up {status === 'padding' && <div className={styles.spinner}></div>}
                </button>
                <span>
                  By creating an account, you agree to the &nbsp;
                  <a href="#"> Terms of use </a>
                  &nbsp; and &nbsp;
                  <a
                    rel="stylesheet"
                    href="#"
                    onKeyDown={(e) => handelBackToStart(e, regUsernameRef)}>
                    Privacy Policy
                  </a>
                  .
                </span>
              </div>
            </div>
          </div>
        </div>
        <div className={styles.dividingLine}>
          <div className={styles.textOverDividingLine}>
            {isLogin ? 'New to our community' : 'Already have account?'}
          </div>
        </div>
        <button className={styles.signupButton} onClick={() => setIsLogin(!isLogin)}>
          {isLogin ? 'Create an account' : 'Log in'}
        </button>
      </div>
    </div>
  );
};
