import { useState, useEffect } from 'react';

type Post = {
  id: number;
  title: string;
  body: string;
};

export default function PostsTable() {
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const postsPerPage = 10;

  const fetchPosts = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch('https://jsonplaceholder.typicode.com/posts');
      if (!response.ok) {
        throw new Error(`Ошибка HTTP! Статус: ${response.status}`);
      }
      const data: Post[] = await response.json();
      setPosts(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Ошибка при загрузке');
    } finally {
      setLoading(false);
    }
  };

  // Автозагрузка при монтировании
  useEffect(() => {
    fetchPosts();
  }, []);

  // Пагинация
  const indexOfLastPost = currentPage * postsPerPage;
  const indexOfFirstPost = indexOfLastPost - postsPerPage;
  const currentPosts = posts.slice(indexOfFirstPost, indexOfLastPost);
  const totalPages = Math.ceil(posts.length / postsPerPage);

  const nextPage = () => {
    if (currentPage < totalPages) {
      setCurrentPage(currentPage + 1);
    }
  };

  const prevPage = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
  };

  // Обрезаем текст до 30 символов
  const truncateText = (text: string, maxLength: number = 30) => {
    if (text.length > maxLength) {
      return text.substring(0, maxLength) + '...';
    }
    return text;
  };

  return (
    <div className="posts-table-container" style={{ marginTop: '2rem' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
        <h2>Посты с пагинацией</h2>
        <button 
          onClick={fetchPosts} 
          disabled={loading}
          style={{
            padding: '10px 20px',
            fontSize: '16px',
            cursor: loading ? 'not-allowed' : 'pointer',
            backgroundColor: '#646cff',
            color: 'white',
            border: 'none',
            borderRadius: '8px'
          }}
        >
          {loading ? 'Обновление...' : 'Обновить посты'}
        </button>
      </div>

      {error && <p style={{ color: 'red', marginTop: '10px' }}>Ошибка: {error}</p>}

      {loading && posts.length === 0 ? (
        <p>Загрузка постов...</p>
      ) : (
        <>
          {/* Информация о пагинации */}
          <div style={{ marginBottom: '15px', color: '#666' }}>
            <p>
              Страница {currentPage} из {totalPages} | 
              Показаны посты {indexOfFirstPost + 1}-{Math.min(indexOfLastPost, posts.length)} из {posts.length}
            </p>
          </div>

          {/* Таблица */}
          {currentPosts.length > 0 && (
            <table
              style={{ 
                marginTop: '10px', 
                borderCollapse: 'collapse', 
                width: '100%',
                border: '1px solid #ddd'
              }}
            >
              <thead>
                <tr style={{ backgroundColor: '#f2f2f2' }}>
                  <th style={{ padding: '12px', border: '1px solid #ddd', width: '10%' }}>ID</th>
                  <th style={{ padding: '12px', border: '1px solid #ddd', width: '30%' }}>Заголовок</th>
                  <th style={{ padding: '12px', border: '1px solid #ddd', width: '60%' }}>Содержание (до 30 символов)</th>
                </tr>
              </thead>
              <tbody>
                {currentPosts.map((post) => (
                  <tr key={post.id}>
                    <td style={{ padding: '12px', border: '1px solid #ddd', textAlign: 'center' }}>{post.id}</td>
                    <td style={{ padding: '12px', border: '1px solid #ddd' }}>{post.title}</td>
                    <td style={{ padding: '12px', border: '1px solid #ddd' }}>{truncateText(post.body, 30)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}

          {/* Пагинация */}
          <div style={{ marginTop: '20px', display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '10px' }}>
            <button 
              onClick={prevPage} 
              disabled={currentPage === 1}
              style={{
                padding: '8px 16px',
                fontSize: '14px',
                cursor: currentPage === 1 ? 'not-allowed' : 'pointer',
                backgroundColor: currentPage === 1 ? '#ccc' : '#646cff',
                color: 'white',
                border: 'none',
                borderRadius: '4px'
              }}
            >
              Назад
            </button>

            <span>Страница {currentPage} из {totalPages}</span>

            <button 
              onClick={nextPage} 
              disabled={currentPage === totalPages}
              style={{
                padding: '8px 16px',
                fontSize: '14px',
                cursor: currentPage === totalPages ? 'not-allowed' : 'pointer',
                backgroundColor: currentPage === totalPages ? '#ccc' : '#646cff',
                color: 'white',
                border: 'none',
                borderRadius: '4px'
              }}
            >
              Вперед
            </button>
          </div>
        </>
      )}
    </div>
  );
}