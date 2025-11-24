import './VideoManagementPage.css'
import { Link } from 'react-router-dom';
import { useState, useEffect } from 'react';
import type { Video } from '../../../shared/models';
import { videosApi } from '../../api/video';

export function VideoManagementPage() {
  const [videos, setVideos] = useState<Video[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    loadVideos();
  }, []);

  const loadVideos = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await videosApi.getAll(); 
      setVideos(data);
    } catch (err) {
      setError('Не вдалося завантажити відео');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Ви впевнені, що хочете видалити це відео?')) return;
    
    try {
      await videosApi.delete(id);
      setVideos(videos.filter(v => v.id !== id));
    } catch (err) {
      alert('Не вдалося видалити відео');
      console.error(err);
    }
  };

    return (
    <div className="vm-page">
      <div className="vm-content">
        <div className="vm-header">
          <h1>Управління відео</h1>
          <Link to="/admin/categories/videos/new" className="vm-btn-add">
            + Додати відео
          </Link>
        </div>

        {loading && <div className="vm-status">Завантаження...</div>}
        
        {error && <div className="vm-error">{error}</div>}

        {!loading && !error && (
          <div className="vm-table-wrapper">
            <table className="vm-table">
              <thead>
                <tr>
                  <th style={{ width: '120px' }}>Прев'ю</th>
                  <th>Назва</th>
                  <th className="center">Категорія</th>
                  <th className="right">Дії</th>
                </tr>
              </thead>
              <tbody>
                {videos.length === 0 ? (
                  <tr>
                    <td colSpan={4} className="vm-status">
                      Відео ще немає. Додайте перше відео!
                    </td>
                  </tr>
                ) : (
                  videos.map(video => (
                    <tr key={video.id}>
                      <td>
                        {video.image || video.preview ? (
                          <img 
                            src={video.preview || video.image || ''} 
                            alt={video.title} 
                            className="vm-thumb" 
                          />
                        ) : (
                          <div className="vm-thumb-placeholder">📹</div>
                        )}
                      </td>
                      <td>
                        <strong>{video.title}</strong>
                      </td>
                      <td className="center">
                        {video.category}
                      </td>
                      <td className="right">
                        <div className="vm-actions">
                          <Link 
                            to={`/admin/categories/videos/${video.id}/edit`} 
                            className="vm-btn-action vm-btn-edit"
                          >
                            Редагувати
                          </Link>
                          <button 
                            onClick={() => handleDelete(video.id)} 
                            className="vm-btn-action vm-btn-delete"
                          >
                            Видалити
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
);
}

export default VideoManagementPage;