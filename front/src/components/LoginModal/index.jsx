import React from 'react';
import { Eye, EyeOff, TriangleAlert } from 'lucide-react';

import styles from './styles.module.scss';
import { login, registration } from '../../redux/authSlice';
import { useDispatch, useSelector } from 'react-redux';
import { AuthField } from '../AuthField';

export const LoginModal = (props) => {
  const [passwordIsHidden, setPasswordIsHidden] = React.useState(true);
  const [isLogin, setIsLogin] = React.useState(true);

  const [username, setUsername] = React.useState('');
  const [password, setPassword] = React.useState('');

  const [reg_username, setReg_username] = React.useState('');
  const [reg_email, setReg_email] = React.useState('');
  const [reg_password, setReg_password] = React.useState('');
  const [reg_passwordConfirm, setReg_passwordConfirm] = React.useState('');

  const dispatch = useDispatch();
  const { isAuth, status } = useSelector((state) => state.auth);

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
              <AuthField name={'Login'} onChange={setUsername} />
              <AuthField name={'Password'} onChange={setPassword} />
              <div className={styles.loginButtonAndAgree}>
                <label className={styles.rememberCheckbox}>
                  <input type="checkbox" name="rememberMe" id="" />
                  <span className={styles.checkmark}></span>
                  <span>Remember me</span>
                </label>
                <button
                  className={`${
                    username && password ? `${styles.loginButton} ` : `${styles.inactiveButton}`
                  } ${status === 'error' && styles.shake}`}
                  disabled={username && password ? false : true}
                  onClick={() => dispatch(login({ username: username, password: password }))}>
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
                    <a href="#">Forget your password</a>
                  </div>
                </div>
              </div>
            </div>

            <div className={styles.inputBox}>
              <h1>Sign up</h1>
              <AuthField
                name={'Login'}
                description={'Username may only contain alphanumeric characters or single hyphens.'}
                onChange={setReg_username}
                warningCondition={reg_username.length < 8}
              />
              <AuthField
                name={'Email'}
                onChange={setReg_email}
                warningCondition={!reg_email.includes('@')}
                warningText={'Incorrect email'}
              />
              <AuthField
                name={'Password'}
                description={'Password should be at least 8 characters.'}
                onChange={setReg_password}
                warningCondition={reg_password.length < 8}
              />
              <AuthField
                name={'Repeat password'}
                onChange={setReg_passwordConfirm}
                warningCondition={reg_passwordConfirm !== reg_password}
                warningText={'Password failed'}
              />
              <div className={styles.loginButtonAndAgree}>
                <button
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
                  onClick={() =>
                    dispatch(
                      registration({
                        username: reg_username,
                        email: reg_email,
                        password: reg_password,
                      }),
                    )
                  }>
                  Sign up {status === 'padding' && <div className={styles.spinner}></div>}
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
