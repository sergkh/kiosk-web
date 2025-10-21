import { useCallback, useState } from 'react';
import type { Info } from "../../../shared/models";
import { useLoaderData, useNavigate } from 'react-router';
import {useDropzone} from 'react-dropzone';
import toast, { Toaster } from 'react-hot-toast';
import './CardEditorPage.css';
import Editor from 'react-simple-wysiwyg';

export enum EditCardType {
  Abiturient = 'abiturient',
  Student = 'student'
}

type PreviewFile = {
  preview: string;
}

async function updateInfo(id: string, title: string, subtitle: string, content: string, imageFile: File | null, create: boolean, url: string): Promise<boolean> {
  const formData = new FormData();
  formData.append('title', title);
  formData.append('subtitle', subtitle);
  formData.append('content', content);

  if (imageFile) {
    formData.append('image', imageFile);
  }

  const method = create ? 'POST' : 'PUT';
  const urlWithId = create ? url : `${url}/${id}`;
  const resp = await fetch(urlWithId, { method: method, body: formData});

  if (!resp.ok) {
    const error = await resp.json();
    toast.error(`Помилка: ${error.error || 'Невідома помилка'}`);
    return false;
  } else {
    toast.success(`Інформацію ${create ? 'створено' : 'оновлено'} успішно!`);
    return true;
  }    
}

function CardEditorPage({type, create}: { type?: EditCardType, create?: boolean }) {
  const navigate = useNavigate();
  const card = useLoaderData() as Info;
  const url = type === EditCardType.Abiturient ? '/api/abiturient-info' : '/api/student-info';

  const [title, setTitle] = useState(card.title);
  const [subtitle, setSubtitle] = useState(card.subtitle);
  const [content, setContent] = useState(card.content);
  const [image, setImage] = useState(card.image);
  const [imageFile, setImageFile] = useState<File & PreviewFile | null>(null);

  const {
    acceptedFiles,
    fileRejections,
    getRootProps,
    getInputProps
  } = useDropzone({
    multiple: false,
    accept: { 'image/png': ['.png'] },
    onDrop: (files) => { setImageFile(Object.assign(files[0], { preview: URL.createObjectURL(files[0])})) }
  });

  const [previewFileData, setPreviewFileData] = useState(
    {} as {
      previewType: string;
      previewUrl: string | ArrayBuffer | null;
      previewName: string;
      isDragging: boolean;
    }
  );

  const handleSave = () => {
    updateInfo(card.id, title, subtitle, content, imageFile, create || false, url).then((success) => {
      if (success) {
        navigate(-1);
      }
    });
  }

  // just navigate back
  const handleCancel = () => { navigate(-1); }

  const handleFileUploading = async (file: { name: "" }) => {
    await new Promise((resolve) => setTimeout(resolve, 2000));
    setPreviewFileData({
      previewType: "image",
      previewUrl: "https://picsum.photos/300/224",
      previewName: file.name,
      isDragging: false,
    });
  };

  return (
    <div className="card-editor-page">
      <h3>Редагування інформації для { type == EditCardType.Abiturient ? 'абітурієнтів' : 'студентів' } </h3>
      <Toaster position="top-center"/>
      <div>
        <div>
          <label>Назва:</label>
          <input 
            value={title} 
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Введіть назву"
          />
        </div>

        <div>
          <label>Підзаголовок:</label>
          <input 
            value={subtitle} 
            onChange={(e) => setSubtitle(e.target.value)}
            placeholder="Введіть підзаголовок"
          />
        </div>

        <div>
          <Editor value={content} onChange={evt => setContent(evt.target.value)} />
        </div>
      </div>

      <div className="image-upload">
        { imageFile ? <img
            src={imageFile.preview}
            // Revoke data uri after image is loaded
            onLoad={() => { URL.revokeObjectURL(imageFile.preview) }}
          /> : image && (
            <div style={{ marginBottom: '10px' }}>
              <img 
                src={image} 
                alt="Preview" 
                style={{ maxWidth: '100%', maxHeight: '200px', objectFit: 'contain' }}
                onError={(e) => {
                  (e.target as HTMLImageElement).style.display = 'none';
                }}
              />
            </div>
          )
        }

        <div>
          <div className="dropzone" {...getRootProps()}>
            <input {...getInputProps()} />
            <p>Перетягніть зображення або натисніть щоб обрати файл (тільки PNG)</p>
          </div>
        </div>

      </div>

      <div className="action-buttons">
        <button onClick={handleSave}>{create ? 'Створити' : 'Зберегти'}</button>
        <button onClick={handleCancel}>Скасувати</button>
      </div>
    </div>
  );
}

export default CardEditorPage;




