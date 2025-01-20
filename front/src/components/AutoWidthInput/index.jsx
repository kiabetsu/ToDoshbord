import React, { useState, useRef, useEffect } from 'react';
import styles from './style.module.scss';

const AutoWidthInput = ({ value, setValue }) => {
  const spanRef = useRef(null);
  const inputRef = useRef(null);

  useEffect(() => {
    if (spanRef.current && inputRef.current) {
      // Устанавливаем ширину input на основе ширины span
      inputRef.current.style.width = `${spanRef.current.offsetWidth}px`;
    }
  }, [value]);

  return (
    <div className={styles.autoWidthDiv} style={{ display: 'inline-block', position: 'relative' }}>
      {/* Скрытый span для измерения ширины текста */}
      <span className={styles.autoWidthSpan} ref={spanRef}>
        {value}
      </span>
      {/* Сам input */}
      <input
        className={styles.autoWidthInput}
        ref={inputRef}
        type="text"
        value={value}
        onChange={(e) => setValue(e.target.value)}
      />
    </div>
  );
};

export default AutoWidthInput;
