import React from 'react';
import { TriangleAlert } from 'lucide-react';

import styles from './styles.module.scss';

export const AuthField = ({ name, description, warningText, warningCondition, onChange }) => {
  const [isTouched, setIsTouched] = React.useState(false);

  const handleBlur = () => {
    setIsTouched(true);
  };

  return (
    <div className={styles.floatingGroup}>
      <input
        type="text"
        className={`${styles.inputText} ${isTouched && warningCondition && styles.warningInput}`}
        onChange={(e) => onChange(e.target.value)}
        onBlur={handleBlur}
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
    </div>
  );
};
