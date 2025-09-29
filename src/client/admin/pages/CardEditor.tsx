import { useState } from 'react';
import type { StudentInfo, AbiturientInfo } from "../../../shared/models";

interface CardEditorProps {
  card: AbiturientInfo | StudentInfo;
  cardType: 'abiturient' | 'student';
  onSave: (updatedCard: AbiturientInfo | StudentInfo) => void;
  onCancel: () => void;
}

function CardEditor({ 
  card, 
  cardType,
  onSave, 
  onCancel 
}: CardEditorProps) {
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

  const isNewCard = !card.id || card.id === '';

  return (
    <div style={{ display: 'flex', gap: '20px', height: '80vh' }}>
      <div style={{ flex: 1 }}>
        <h3>Редагування картки {cardType === 'abiturient' ? 'абітурієнта' : 'студента'}</h3>
        
        <div>
          <label>ID картки (унікальний ключ):</label>
          <input 
            value={id} 
            onChange={(e) => setId(e.target.value)}
            disabled={!isNewCard}
            placeholder={isNewCard ? "Введіть унікальний ID" : ""}
            style={{ 
              width: '100%', 
              marginBottom: '10px', 
              backgroundColor: isNewCard ? '#746e6eff' : '#746e6eff',
              cursor: isNewCard ? 'text' : 'not-allowed'
            }}
          />
          {isNewCard && (
            <small style={{ color: '#666' }}>
              ID обов'язковий для нової картки
            </small>
          )}
        </div>

        <div>
          <label>Назва:</label>
          <input 
            value={title} 
            onChange={(e) => setTitle(e.target.value)}
            style={{ width: '100%', marginBottom: '10px' }}
            placeholder="Введіть назву"
          />
        </div>

        <div>
          <label>Підзаголовок:</label>
          <input 
            value={subtitle} 
            onChange={(e) => setSubtitle(e.target.value)}
            style={{ width: '100%', marginBottom: '10px' }}
            placeholder="Введіть підзаголовок"
          />
        </div>

        <div>
          <label>Зображення (URL):</label>
          <input 
            value={image} 
            onChange={(e) => setImage(e.target.value)}
            style={{ width: '100%', marginBottom: '10px' }}
            placeholder="https://example.com/image.jpg"
          />
        </div>

        <div>
          <label>HTML контент:</label>
          <textarea 
            value={content}
            onChange={(e) => setContent(e.target.value)}
            rows={15}
            style={{ 
              width: '100%', 
              fontFamily: 'monospace',
              padding: '10px'
            }}
            placeholder="Введіть HTML контент"
          />
        </div>

        <div style={{ marginTop: '10px' }}>
          <button 
            onClick={handleSave} 
            style={{ marginRight: '10px', padding: '8px 16px' }}
            disabled={isNewCard && !id.trim()}
          >
            {isNewCard ? 'Створити' : 'Зберегти'}
          </button>
          <button 
            onClick={onCancel}
            style={{ padding: '8px 16px' }}
          >
            Скасувати
          </button>
        </div>
      </div>
      
      <div style={{ flex: 1 }}>
        <h3>Превью</h3>
        {image && (
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
        )}
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