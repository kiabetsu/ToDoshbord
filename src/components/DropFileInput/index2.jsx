import React, { useRef, useState } from 'react';
import PropTypes from 'prop-types';
import styles from './style.module.scss';
// import { ImageConfig } from '../../config/ImageConfig.js';
import ava from '../../asset/Profile 01.png';

const DropFileInput = (props) => {
  const wrapperRef = useRef(null);

  const [fileList, setFileList] = useState([]);

  const onDragEnter = () => wrapperRef.current.classList.add('dragover');

  const onDragLeave = () => wrapperRef.current.classList.remove('dragover');

  const onDrop = () => wrapperRef.current.classList.remove('dragover');

  const onFileChange = (files) => {
    console.log(files);
  };

  const onFileDrop = (e) => {
    const newFile = e.target.files[0];
    if (newFile) {
      const updatedList = [...fileList, newFile];
      setFileList(updatedList);
      onFileChange(updatedList);
    }
  };

  const fileRemove = (file) => {
    const updatedList = [...fileList];
    updatedList.splice(fileList.indexOf(file), 1);
    setFileList(updatedList);
    onFileChange(updatedList);
  };

  return (
    <>
      {console.log(wrapperRef, 'wrapperRef')}
      <div
        ref={wrapperRef}
        className={styles.dropFileInput}
        onDragEnter={onDragEnter}
        onDragLeave={onDragLeave}
        onDrop={onDrop}>
        <div className={styles.dropFileInputLabel}>
          <img
            src={'https://media.geeksforgeeks.org/wp-content/uploads/20240308113922/Drag-.png'}
            alt=""
          />
          <p>Drag & Drop your files here</p>
        </div>
        <input type="file" value="" onChange={onFileDrop} />
      </div>
      {fileList.length > 0 ? (
        <div className={styles.dropFilePreview}>
          <p className={styles.dropFilePreviewTitle}>Ready to upload</p>
          {fileList.map((item, index) => (
            <div key={index} className={styles.dropFilePreviewItem}>
              <img src={ava} alt="" />
              <div className={styles.dropFilePreviewItemInfo}>
                <p>{item.name}</p>
                <p>{item.size}B</p>
              </div>
              <span className={styles.dropFilePreviewItemDel} onClick={() => fileRemove(item)}>
                x
              </span>
            </div>
          ))}
        </div>
      ) : null}
    </>
  );
};

DropFileInput.propTypes = {
  onFileChange: PropTypes.func,
};

export default DropFileInput;
