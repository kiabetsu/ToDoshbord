import React from 'react';
import { useDropzone } from 'react-dropzone';
import styles from './style.module.scss';
import { ArrowUpFromLine, X, ImagePlus } from 'lucide-react';
import { upload } from '@testing-library/user-event/dist/upload';
import { useSelector, useDispatch } from 'react-redux';
import { setRemoveAttachment, setUploadAttachment } from '../../redux/taskSlice';
import pic from '../../asset/Image.png';

export function DropFileInput({ id, fileList, setFileList }) {
  // const [fileList, setFileList] = React.useState([]);
  const [shouldUpdate, isShouldUploaded] = React.useState(false);
  const [preview, setPreview] = React.useState([]);
  // const { data } = useSelector((state) => state.task);
  const dispatch = useDispatch();

  const getDate = (date) => {
    return `${date.getDate(date)}.${date.getMonth(date) + 1}.${date.getFullYear(
      date,
    )} ${date.getHours(date)}:${date.getMinutes(date)}`;
  };

  const onDrop = React.useCallback((acceptedFiles) => {
    // const testTransform = new FileReader(acceptedFiles[0]);

    // dispatch(setUploadAttachment({ id: id, acceptedFiles: acceptedFiles }));
    const newFile = acceptedFiles[0];
    newFile['uploadTime'] = { dateFormat: Date(Date.now()), stringFormat: getDate(new Date()) };
    newFile['id'] = fileList.length > 0 ? fileList.at(-1).id + 1 : 0;
    const file = new FileReader();
    file.readAsDataURL(acceptedFiles[0]);
    file.onload = function () {
      newFile['preview'] = file.result;
      if (newFile) {
        const updatedList = [...fileList, newFile];
        setFileList(updatedList);
      }
    };
  });

  // console.log('fileList', fileList);

  const fileRemove = (item) => {
    const uploadFileList = fileList.filter((file) => {
      return file.id !== item.id;
    });
    setFileList(uploadFileList);
    // dispatch(setRemoveAttachment({ id: id, item: item }));
  };

  const nameCat = (name) => {
    const dote = name.lastIndexOf('.');
    const nameWithoutDote = name.substring(0, 10);
    const nameWithDote = name.substring(dote - 10);
    return (
      <>
        {name.length > 20 ? (
          <>
            <span className={styles.name}>{nameWithoutDote}...</span>
            <span>{nameWithDote}</span>
          </>
        ) : (
          <span>{name}</span>
        )}
      </>
    );
  };

  const fileSize = (size) => {
    if (size < 1024 * 8) {
      return size + ' B';
    } else if (size < 1024 * 1024 * 8) {
      return (size / 1024).toFixed(2) + ' KB';
    } else if (size < 1024 * 1024 * 1024 * 8) {
      return (size / 1024 / 1024).toFixed(2) + ' MB';
    }
  };

  const { getRootProps, getInputProps, isDragActive, isDragAccept } = useDropzone({ onDrop });

  return (
    <>
      {fileList.length > 0 ? (
        <>
          <div className={styles.lime} {...getRootProps()}>
            <input {...getInputProps()} />
            <span>Drag 'n' drop some files here, or click to select files</span> &nbsp;
            <ArrowUpFromLine className={styles.uploadIcon} />
          </div>
          <div className={styles.preview}>
            <div className={styles.dropFilePreview}>
              {isDragAccept ? (
                <div className={styles.dropZone}>
                  <span>Drag 'n' drop some files here, or click to select files</span> &nbsp;
                  <ArrowUpFromLine className={styles.uploadIcon} />
                </div>
              ) : null}
              <span className={styles.previewTitle}>Files</span>
              {fileList.map((item, index) => (
                <div key={index} className={styles.previewBlock}>
                  <img src={item.preview} alt="" />
                  <div className={styles.previewInfo}>
                    <span className={styles.previewName}>{nameCat(item.name)}</span>
                    <span className={styles.MoreInfo}>
                      Upload at {item.uploadTime.stringFormat} • {fileSize(item.size)}
                    </span>
                  </div>
                  <span
                    className={styles.previewDelete}
                    onClick={(e) => {
                      e.stopPropagation();
                      fileRemove(item);
                    }}>
                    <X size={24} />
                  </span>
                </div>
              ))}
            </div>
          </div>
        </>
      ) : (
        <div className={styles.dropZone} {...getRootProps()}>
          <input {...getInputProps()} />
          <p>
            <ArrowUpFromLine className={styles.uploadIcon} size={64} />
          </p>
          {isDragActive ? (
            <span>Drop the files here ...</span>
          ) : (
            <span>Drag 'n' drop some files here, or click to select files</span>
          )}
        </div>
      )}
    </>
  );
}

export const ImgUpload = ({ id, image, setImage }) => {
  // const [image, setImage] = React.useState();

  const onDrop = React.useCallback((acceptedFiles, e) => {
    // const testTransform = new FileReader(acceptedFiles[0]);

    const img = new Image();
    const obj = URL.createObjectURL(acceptedFiles[0]);

    console.log(acceptedFiles[0]);

    const file = new FileReader();
    file.readAsDataURL(acceptedFiles[0]);
    // console.log('read as data', file.readAsDataURL(acceptedFiles[0]));
    file.onload = function () {
      const newImg = file.result;
      if (newImg) {
        setImage(newImg);
      }
    };
  });

  const { getRootProps, getInputProps, isDragActive, isDragAccept } = useDropzone({
    onDrop,
    accept: { 'image/png': ['.png', '.jpg', '.gif', '.web'] },
  });

  const [isShow, setIsShow] = React.useState(0);

  const setOpacityChanger = (image) => {
    if (!image) {
      return 1;
    }
    if (isShow === 1 || isDragActive) {
      return 1;
    }
    return 0;
  };

  return (
    <>
      <div {...getRootProps()}>
        <input {...getInputProps()} />
        {image && <img src={image} alt="Picture" />}
        <div
          className={styles.changeImg}
          onMouseOver={() => setIsShow(1)}
          onMouseLeave={() => setIsShow(0)}
          style={{ opacity: `${setOpacityChanger(image)}` }}
          {...getRootProps()}>
          <div className={styles.iconBorder}>
            <ImagePlus size={64} />
          </div>
          {isDragActive ? (
            <span>Drop the image here ...</span>
          ) : (
            <span>Drag 'n' drop some image here, or click to select</span>
          )}
        </div>
      </div>
    </>
  );
};
