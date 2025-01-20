import React from 'react';
import { Eye, EyeOff } from 'lucide-react';

import styles from './styles.module.scss';

export const LoginModal = (props) => {
  const [passwordIsHidden, setPasswordIsHidden] = React.useState(true);
  const [isLogin, setIsLogin] = React.useState(true);

  return (
    <div className={styles.wrapper}>
      <div className={styles.centered}>
        <div className={styles.contentBox} style={{ height: `${isLogin ? '500px' : '620px'}` }}>
          <div
            className={styles.carousel}
            style={{ transform: `${isLogin ? 'translateX(0)' : 'translateX(-728px)'}` }}>
            <div className={styles.inputBox}>
              <h1>Sign in</h1>
              <div className={styles.floatingGroup}>
                <input type="text" className={styles.inputText} required />
                <span className={styles.floatingLabel}>Login</span>
              </div>
              <div className={styles.floatingGroup}>
                <input
                  type={passwordIsHidden ? 'password' : 'text'}
                  className={styles.inputText}
                  required
                />
                <span className={styles.floatingLabel}>Password</span>
                <span
                  className={styles.hidePassword}
                  onClick={() => setPasswordIsHidden(!passwordIsHidden)}>
                  {passwordIsHidden ? <Eye size={16} /> : <EyeOff size={16} />}&nbsp;
                  {passwordIsHidden ? 'Show' : 'Hide'}
                </span>
              </div>
              <div className={styles.loginButtonAndAgree}>
                <label className={styles.rememberCheckbox}>
                  <input type="checkbox" name="rememberMe" id="" />
                  <span className={styles.checkmark}></span>
                  <span>Remember me</span>
                </label>
                <button className={styles.loginButton}>Log in</button>
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
              <div className={styles.floatingGroup}>
                <input type="text" className={styles.inputText} required />
                <span className={styles.floatingLabel}>Login</span>
              </div>
              <div className={styles.floatingGroup}>
                <input type="email" className={styles.inputText} required />
                <span className={styles.floatingLabel}>Email</span>
              </div>
              <div className={styles.floatingGroup}>
                <input
                  type={passwordIsHidden ? 'password' : 'text'}
                  className={styles.inputText}
                  required
                />
                <span className={styles.floatingLabel}>Password</span>
                <span
                  className={styles.hidePassword}
                  onClick={() => setPasswordIsHidden(!passwordIsHidden)}>
                  {passwordIsHidden ? <Eye size={16} /> : <EyeOff size={16} />}&nbsp;
                  {passwordIsHidden ? 'Show' : 'Hide'}
                </span>
              </div>
              <div className={styles.floatingGroup}>
                <input
                  type={passwordIsHidden ? 'password' : 'text'}
                  className={styles.inputText}
                  required
                />
                <span className={styles.floatingLabel}>Repeat password</span>
                <span
                  className={styles.hidePassword}
                  onClick={() => setPasswordIsHidden(!passwordIsHidden)}>
                  {passwordIsHidden ? <Eye size={16} /> : <EyeOff size={16} />}&nbsp;
                  {passwordIsHidden ? 'Show' : 'Hide'}
                </span>
              </div>
              <div className={styles.loginButtonAndAgree}>
                <button className={styles.loginButton}>Sign up</button>
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
