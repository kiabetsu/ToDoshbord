import React from 'react';
import { useDropzone } from 'react-dropzone';
import styles from './style.module.scss';
import { ArrowUpFromLine, X, ImagePlus } from 'lucide-react';
import { AddNewFiles, formatDate } from '../../redux/taskSlice';
import { useDispatch, useSelector } from 'react-redux';
import fileSVG from '../../asset/blank-file.svg';

export function DropFileInput({ fileList, setFileList, newFiles, setNewFiles }) {
  const dispatch = useDispatch();
  // const { newFiles } = useSelector((state) => state.tasks);

  const getDate = (date) => {
    return `${date.getDate(date)}.${date.getMonth(date) + 1}.${date.getFullYear(
      date,
    )} ${date.getHours(date)}:${date.getMinutes(date)}`;
  };

  function transliterate(text) {
    const rus = 'щ ш ч ц ю я ё ж ъ ы э а б в г д е з и й к л м н о п р с т у ф х ь'.split(/ +/g);
    const eng =
      "shh sh ch cz yu ya yo zh `` y' e` a b v g d e z i j k l m n o p r s t u f x `".split(/ +/g);

    for (let i = 0; i < rus.length; i++) {
      text = text.replace(new RegExp(rus[i], 'g'), eng[i]);
    }

    return text;
  }

  const onDrop = React.useCallback((acceptedFiles) => {
    // const newFile = acceptedFiles[0];
    const today = new Date();
    const newFile = new File([acceptedFiles[0]], transliterate(acceptedFiles[0].name), {
      ...acceptedFiles[0],
      path: transliterate(acceptedFiles[0].path),
      type: acceptedFiles[0].type,
    });
    console.log('newFile before transform', newFile);
    // newFile['name'] = transliterate(acceptedFiles[0].name);
    // newFile['path'] = transliterate(acceptedFiles[0].path);
    newFile['uploaded_at'] = today.toISOString();
    newFile['attachment_id'] = newFiles.length > 0 ? newFiles.at(-1).attachment_id + 1 : 0;
    newFile['file_name'] = transliterate(newFile.name);
    delete newFile.name;
    const file = new FileReader();
    file.readAsDataURL(acceptedFiles[0]);
    file.onload = function () {
      console.log('upload file', newFile);
      // console.log('newFile.type', newFile.type, 'type of newFiles.type', typeof newFile.type);
      newFile['url'] = file.result;
      if (newFile) {
        const updatedList = [...newFiles, newFile];
        console.log('full updateList', updatedList);
        // dispatch(AddNewFiles({ newFiles: updatedList }));
        setNewFiles(updatedList);
        console.log('newFILES after update', newFiles);
      }
    };
  });

  const fileRemove = (id, type) => {
    const selectedList = type === 'old' ? fileList : newFiles;
    const updateList = selectedList.filter((file) => {
      return file.attachment_id !== id;
    });
    type === 'old' ? setFileList(updateList) : dispatch(AddNewFiles({ newFiles: updateList }));
  };

  const attachBlock = (item, index, type) => {
    // console.log('key value', `${index + type}`);
    return (
      <div key={`${index + type}`} className={styles.previewBlock}>
        <div
          style={{
            width: '120px',
            height: '70px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}>
          <img src={item.type.includes('image') ? item.url : fileSVG} alt="" />
          {!item.type.includes('image') && (
            <span className={styles.fileType}>.{item.type.split(`/`)[1]}</span>
          )}
        </div>
        <div className={styles.previewInfo}>
          <span className={styles.previewName}>{nameCat(item.file_name)}</span>
          <span className={styles.MoreInfo}>
            Upload at {formatDate(item.uploaded_at).date_format} •{' '}
            {item.size && fileSize(item.size)}
          </span>
        </div>
        <span
          className={styles.previewDelete}
          onClick={(e) => {
            e.stopPropagation();
            fileRemove(item.attachment_id, type);
          }}>
          <X size={24} />
        </span>
      </div>
    );
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
      {fileList.length + newFiles.length > 0 ? (
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
                <div>{attachBlock(item, index, 'old')}</div>
              ))}
              {newFiles.map((item, index) => (
                <div>{attachBlock(item, index, 'new')}</div>
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

export const ImgUpload = ({ image, setImage }) => {
  const onDrop = React.useCallback((acceptedFiles, e) => {
    // const newImg = acceptedFiles[0];
    const newImg = new File([acceptedFiles[0]], transliterate(acceptedFiles[0].name), {
      ...acceptedFiles[0],
      path: transliterate(acceptedFiles[0].path),
      type: acceptedFiles[0].type,
    });
    const file = new FileReader();
    file.readAsDataURL(acceptedFiles[0]);
    file.onload = function () {
      newImg['preview'] = file.result;
      if (newImg) {
        setImage(newImg);
      }
    };
  });

  function transliterate(text) {
    const rus = 'щ ш ч ц ю я ё ж ъ ы э а б в г д е з и й к л м н о п р с т у ф х ь'.split(/ +/g);
    const eng =
      "shh sh ch cz yu ya yo zh `` y' e` a b v g d e z i j k l m n o p r s t u f x `".split(/ +/g);

    for (let i = 0; i < rus.length; i++) {
      text = text.replace(new RegExp(rus[i], 'g'), eng[i]);
    }

    return text;
  }

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
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
        {image && <img src={typeof image === 'string' ? image : image.preview} alt="Picture" />}
        <div
          className={styles.changeImg}
          onMouseOver={() => setIsShow(1)}
          onMouseLeave={() => setIsShow(0)}
          style={{ opacity: `${setOpacityChanger(image)}` }}>
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
