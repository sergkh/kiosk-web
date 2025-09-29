import { useState } from 'react';
import type {StudentInfo, AbiturientInfo } from "../../../shared/models";

interface CardEditorProps {
  card: AbiturientInfo; 
  onSave: (updatedCard: AbiturientInfo) => void;
  onCancel: () => void;
}

function CardEditor({ card, onSave, onCancel }: CardEditorProps) {
  const [id, setId] = useState(card.id);
  const [title, setTitle] = useState(card.title);
  const [subtitle, setSubtitle] = useState(card.subtitle);
  const [content, setContent] = useState(card.content);
  const [image, setImage] = useState(card.image);

  const handleSave = () => {
    onSave({
      ...card,
      id,
      title,
      subtitle,
      content,
      image
    });
  };

  return (
    <div style={{ display: 'flex', gap: '20px', height: '80vh' }}>
      <div style={{ flex: 1 }}>
        <h3>Редагування карточки</h3>
        <div>
          <label>ID картки (унікальний ключ):</label>
          <input 
            value={id} 
            onChange={(e) => setId(e.target.value)}
            disabled={card.id.length > 0} 
            style={{ width: '100%', marginBottom: '10px', backgroundColor: card.id.length > 0 ? '#606461ff' : '#606461ff' }}
          />
        </div>
        <div>
          <label>Назва:</label>
          <input 
            value={title} 
            onChange={(e) => setTitle(e.target.value)}
            style={{ width: '100%', marginBottom: '10px' }}
          />
        </div>
        <div>
          <label>Підзаголовок:</label>
          <input 
            value={subtitle} 
            onChange={(e) => setSubtitle(e.target.value)}
            style={{ width: '100%', marginBottom: '10px' }}
          />
        </div>
        <div>
          <label>Зображення (URL):</label>
          <input 
            value={image} 
            onChange={(e) => setImage(e.target.value)}
            style={{ width: '100%', marginBottom: '10px' }}
          />
        </div>
        <div>
          <label>HTML контент:</label>
          <textarea 
            value={content}
            onChange={(e) => setContent(e.target.value)}
            rows={15}
            style={{ width: '100%', fontFamily: 'monospace' }}
          />
        </div>
        <div style={{ marginTop: '10px' }}>
          <button onClick={handleSave} style={{ marginRight: '10px' }}>
            Зберегти
          </button>
          <button onClick={onCancel}>
            Скасувати
          </button>
        </div>
      </div>
      
      <div style={{ flex: 1 }}>
        <h3>Превью</h3>
        <div 
          dangerouslySetInnerHTML={{ __html: content }}
          style={{ 
            border: '1px solid #ccc', 
            padding: '10px',
            height: '400px',
            overflow: 'auto',
            backgroundColor: '#151111ff'
          }}
        />
      </div>
    </div>
  );
}

export default CardEditor;