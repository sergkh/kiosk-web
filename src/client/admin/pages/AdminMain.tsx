import { useState, useEffect } from 'react';
import type {StudentInfo, AbiturientInfo } from "../../../shared/models";
import CardEditor from './CardEditor'; 


function stripHtml(html: string): string {
  return html.replace(/<[^>]*>/g, '');
}

function AdminMain() {
  const [cards, setCards] = useState<AbiturientInfo[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingCard, setEditingCard] = useState<AbiturientInfo | null>(null);
  const [showEditor, setShowEditor] = useState(false);

  useEffect(() => {
    fetch('/api/abiturient-info')
      .then(res => res.json())
      .then(data => {
        setCards(data);
        setLoading(false);
      })
      .catch(err => {
        console.error(err);
        setLoading(false);
      });
  }, []);


  const openEditor = (card: AbiturientInfo) => {
    setEditingCard(card);
    setShowEditor(true);
  };

  const handleAddCard = () => {
    const newCard: AbiturientInfo = {
      id: "", 
      title: "",
      subtitle: "",
      content: "",
      image: ""
  };
    setEditingCard(newCard);
    setShowEditor(true);
  }
  
const handleSave = async (updatedCard: AbiturientInfo) => {
    const isOriginallyNew = !editingCard?.id || editingCard.id === '';
    
    console.log('Оригінальна картка (editingCard):', editingCard);
    console.log('Оновлена картка (updatedCard):', updatedCard);
    console.log('isOriginallyNew:', isOriginallyNew);
    
    const method = isOriginallyNew ? 'POST' : 'PUT';
    const endpoint = isOriginallyNew
        ? `/api/abiturient-info`
        : `/api/abiturient-info/${updatedCard.id}`;

    try {      
        const response = await fetch(endpoint, {
            method: method,
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(updatedCard),
        });

        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(`Помилка сервера: ${response.status} ${response.statusText}`);
        }
        
        const finalCard = await response.json();

        if (isOriginallyNew) {
            setCards(prevCards => 
                prevCards.map(c => c === editingCard ? finalCard : c)
            );
            console.log("Картку створено");
        } else {
            setCards(prevCards =>
                prevCards.map(c => (c.id === finalCard.id ? finalCard : c))
            );
            console.log("Картку оновлено");
        }
    } catch (error: any) {
        console.error("Помилка збереження", error);
    } finally {
        setShowEditor(false);
        setEditingCard(null);
    }
};

    const handleDelete = async (card: AbiturientInfo) => {
    if (!confirm(`Ви впевнені, що хочете видалити картку з ID: ${card.id}?`)) {
        return;
    }

    try {
        const response = await fetch(`/api/abiturient-info/${card.id}`, {
            method: 'DELETE',
        });

        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.error || `Помилка видалення: ${response.status}`);
        }

        setCards(prevCards => prevCards.filter(c => c.id !== card.id));
        console.log("Картку видалено");
        
    } catch (error: any) {
        console.error("Помилка видалення", error);
        alert(`Помилка видалення: ${error.message}`);
    }
};

    const handleCancel = () => {
      setShowEditor(false);
      setEditingCard(null);
    };

  if (loading) return <div>Завантаження...</div>;

  if (showEditor && editingCard) {
    return <CardEditor card={editingCard} onSave={handleSave} onCancel={handleCancel} />;
}

  return (
    <div>
      <h1>Головна сторінка адміністратора</h1>
      <p>Використовуйте навігацію для доступу до різних розділів адміністративної панелі.</p>
      <button 
          onClick={handleAddCard} 
          style={{ marginBottom: '20px', padding: '10px 20px', fontSize: '16px' }}
      >
          + Додати нову картку
      </button>
      <h2>Карточки абітурієнтів</h2>
      <table style={{width: '100%', marginTop: '20px'}}>
        <thead>
          <tr>
            <th>ID</th>
            <th>Назва</th>
            <th>Підзаголовок</th>
            <th>Контент</th>
            <th>Дії</th>
          </tr>
        </thead>
        <tbody>
          {cards.map(card => (
            <tr key={card.id}>
              <td>{card.id}</td>
              <td>{card.title}</td>
              <td>{card.subtitle}</td>
              <td>{card.content ? stripHtml(card.content).substring(0, 100) + '...' : 'Немає'}</td>
              <td style={{ whiteSpace: 'nowrap' }}>
                  <button 
                      onClick={() => openEditor(card)}
                      style={{ marginRight: '10px' }}
                  >
                      Редагувати
                  </button>
                  <button 
                      onClick={() => handleDelete(card)}
                      style={{ backgroundColor: '#dc3545', color: 'white' }}
                  >
                      Видалити
                  </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      
    </div>
  )
}

export default AdminMain;