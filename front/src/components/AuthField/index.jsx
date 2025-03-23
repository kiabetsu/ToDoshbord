import React from 'react';
import { TriangleAlert, Eye, EyeOff } from 'lucide-react';

import styles from './styles.module.scss';

export const AuthField = React.forwardRef(
  (
    { name, description, warningText, warningCondition, onChange, nextTarget, pressButton },
    ref,
  ) => {
    const [isTouched, setIsTouched] = React.useState(false);
    const [passwordIsHidden, setPasswordIsHidden] = React.useState(true);

    const handleBlur = () => {
      setIsTouched(true);
    };

    const handleKeyDown = (event) => {
      if (event.key === 'Enter') {
        event.preventDefault();
        //костльное решение поскольку не смог придумать адекватного
        if (pressButton) {
          nextTarget.current.click();
        }
        if (nextTarget && nextTarget.current) {
          nextTarget.current.focus();
        }
      }
    };

    return (
      <div className={styles.floatingGroup}>
        <input
          ref={ref}
          type={
            (name === 'Password' || name === 'Repeat password') && passwordIsHidden
              ? 'password'
              : 'text'
          }
          className={`${styles.inputText} ${isTouched && warningCondition && styles.warningInput}`}
          onChange={(e) => onChange(e.target.value)}
          onBlur={handleBlur}
          onKeyDown={(e) => handleKeyDown(e)}
          required
        />
        <span
          className={`${styles.floatingLabel} ${
            isTouched && warningCondition && styles.warningText
          }`}>
          {name}
        </span>
        <span className={styles.inputInfo}>{description}</span>
        {isTouched && warningCondition && (
          <span className={styles.warning}>
            <TriangleAlert />
            &nbsp;
            {warningText
              ? `${warningText}`
              : `The ${name.toLowerCase()} does not meet the requirements`}
          </span>
        )}
        {(name === 'Password' || name === 'Repeat password') && (
          <span
            className={styles.hidePassword}
            onClick={() => setPasswordIsHidden(!passwordIsHidden)}>
            {passwordIsHidden ? <Eye size={16} /> : <EyeOff size={16} />}&nbsp;
            {passwordIsHidden ? 'Show' : 'Hide'}
          </span>
        )}
      </div>
    );
  },
);
