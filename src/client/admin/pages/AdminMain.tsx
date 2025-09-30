import { useState, useEffect } from 'react';
import type { StudentInfo, AbiturientInfo } from "../../../shared/models";
import CardEditor from './CardEditor'; 


function stripHtml(html: string): string {
  return html.replace(/<[^>]*>/g, '');
}

function AdminMain() {
  const [abiturientCards, setAbiturientCards] = useState<AbiturientInfo[]>([]);
  const [studentCards, setStudentCards] = useState<StudentInfo[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingCard, setEditingCard] = useState<AbiturientInfo | StudentInfo | null>(null);
  const [editingCardType, setEditingCardType] = useState<'abiturient' | 'student'>('abiturient');
  const [showEditor, setShowEditor] = useState(false);

  useEffect(() => {
    Promise.all([
      fetch('/api/abiturient-info').then(res => res.json()),
      fetch('/api/student-info').then(res => res.json())
    ])
      .then(([abitData, studData]) => {
        setAbiturientCards(abitData);
        setStudentCards(studData);
        setLoading(false);
      })
      .catch(err => {
        console.error(err);
        setLoading(false);
      });
  }, []);


  const openEditor = (card: AbiturientInfo | StudentInfo, cardType: 'abiturient' | 'student') => {
    setEditingCard(card);
    setEditingCardType(cardType);
    setShowEditor(true);
  };

  const handleAddCard = (cardType: 'abiturient' | 'student') => {
    const newCard = {
      id: "", 
      title: "",
      subtitle: "",
      content: "",
      image: ""
    };
    setEditingCard(newCard);
    setEditingCardType(cardType);
    setShowEditor(true);
  }
  
  const handleSave = async (updatedCard: AbiturientInfo | StudentInfo) => {
    const isOriginallyNew = !editingCard?.id || editingCard.id === '';
    
    console.log('Оригінальна картка (editingCard):', editingCard);
    console.log('Оновлена картка (updatedCard):', updatedCard);
    console.log('isOriginallyNew:', isOriginallyNew);
    
    const method = isOriginallyNew ? 'POST' : 'PUT';
    const apiPath = editingCardType === 'abiturient' ? 'abiturient-info' : 'student-info';
    const endpoint = isOriginallyNew
        ? `/api/${apiPath}`
        : `/api/${apiPath}/${updatedCard.id}`;

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

        if (editingCardType === 'abiturient') {
          if (isOriginallyNew) {
              setAbiturientCards(prevCards => [...prevCards, finalCard]);
              console.log("Картку абітурієнта створено");
          } else {
              setAbiturientCards(prevCards =>
                  prevCards.map(c => (c.id === finalCard.id ? finalCard : c))
              );
              console.log("Картку абітурієнта оновлено");
          }
        } else {
          if (isOriginallyNew) {
              setStudentCards(prevCards => [...prevCards, finalCard]);
              console.log("Картку студента створено");
          } else {
              setStudentCards(prevCards =>
                  prevCards.map(c => (c.id === finalCard.id ? finalCard : c))
              );
              console.log("Картку студента оновлено");
          }
        }
    } catch (error: any) {
        console.error("Помилка збереження", error);
        alert(`Помилка збереження: ${error.message}`);
    } finally {
        setShowEditor(false);
        setEditingCard(null);
    }
  };

  const handleDelete = async (card: AbiturientInfo | StudentInfo, cardType: 'abiturient' | 'student') => {
    if (!confirm(`Ви впевнені, що хочете видалити картку з ID: ${card.id}?`)) {
        return;
    }

    const apiPath = cardType === 'abiturient' ? 'abiturient-info' : 'student-info';

    try {
        const response = await fetch(`/api/${apiPath}/${card.id}`, {
            method: 'DELETE',
        });

        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.error || `Помилка видалення: ${response.status}`);
        }

        if (cardType === 'abiturient') {
          setAbiturientCards(prevCards => prevCards.filter(c => c.id !== card.id));
          console.log("Картку абітурієнта видалено");
        } else {
          setStudentCards(prevCards => prevCards.filter(c => c.id !== card.id));
          console.log("Картку студента видалено");
        }
        
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
    return (
      <CardEditor 
        card={editingCard} 
        cardType={editingCardType}
        onSave={handleSave} 
        onCancel={handleCancel} 
      />
    );
  }

  return (
    <div>
      <h1>Головна сторінка адміністратора</h1>
      <p>Використовуйте навігацію для доступу до різних розділів адміністративної панелі.</p>
      
      <h2>Карточки абітурієнтів</h2>
      <button 
          onClick={() => handleAddCard('abiturient')} 
          style={{ marginBottom: '20px', padding: '10px 20px', fontSize: '16px' }}
      >
          + Додати картку абітурієнта
      </button>
      <table style={{width: '100%', marginTop: '20px', marginBottom: '40px'}}>
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
          {abiturientCards.map(card => (
            <tr key={card.id}>
              <td>{card.id}</td>
              <td>{card.title}</td>
              <td>{card.subtitle}</td>
              <td>{card.content ? stripHtml(card.content).substring(0, 100) + '...' : 'Немає'}</td>
              <td style={{ whiteSpace: 'nowrap' }}>
                  <button 
                      onClick={() => openEditor(card, 'abiturient')}
                      style={{ marginRight: '10px' }}
                  >
                      Редагувати
                  </button>
                  <button 
                      onClick={() => handleDelete(card, 'abiturient')}
                      style={{ backgroundColor: '#dc3545', color: 'white' }}
                  >
                      Видалити
                  </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      <h2>Карточки студентів</h2>
      <button 
          onClick={() => handleAddCard('student')} 
          style={{ marginBottom: '20px', padding: '10px 20px', fontSize: '16px' }}
      >
          + Додати картку студента
      </button>
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
          {studentCards.map(card => (
            <tr key={card.id}>
              <td>{card.id}</td>
              <td>{card.title}</td>
              <td>{card.subtitle}</td>
              <td>{card.content ? stripHtml(card.content).substring(0, 100) + '...' : 'Немає'}</td>
              <td style={{ whiteSpace: 'nowrap' }}>
                  <button 
                      onClick={() => openEditor(card, 'student')}
                      style={{ marginRight: '10px' }}
                  >
                      Редагувати
                  </button>
                  <button 
                      onClick={() => handleDelete(card, 'student')}
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