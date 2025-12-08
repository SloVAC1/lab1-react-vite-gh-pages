import { useState, useEffect } from 'react'
import './App.css'

interface Post {
  id: number
  title: string
  body: string
}

function App() {
  const [count, setCount] = useState(0)
  const [posts, setPosts] = useState<Post[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [currentPage, setCurrentPage] = useState(1)
  const postsPerPage = 10

  useEffect(() => {
    fetchPosts()
  }, [currentPage])

  const fetchPosts = async () => {
    try {
      setLoading(true)
      const response = await fetch(
        `https://jsonplaceholder.typicode.com/posts?_page=${currentPage}&_limit=${postsPerPage}`
      )
      
      if (!response.ok) {
        throw new Error(`Ошибка HTTP! Статус: ${response.status}`)
      }
      
      const data = await response.json()
      setPosts(data)
      setError(null)
    } catch (err: any) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  const handleNextPage = () => {
    setCurrentPage(prev => prev + 1)
  }

  const handlePrevPage = () => {
    if (currentPage > 1) {
      setCurrentPage(prev => prev - 1)
    }
  }

  const truncateText = (text: string, maxLength: number) => {
    return text.length > maxLength ? text.substring(0, maxLength) + '...' : text
  }

  return (
    <>
      <div className="logo-container">
        <a href="https://vitejs.dev" target="_blank">
          <img src="vite.svg" className="logo" alt="Vite logo" />
          <div className="logo-label">Vite logo</div>
        </a>
        <a href="https://react.dev" target="_blank">
          <img src="react.svg" className="logo react" alt="React logo" />
          <div className="logo-label">React logo</div>
        </a>
      </div>
      
      <h1>Vite + React</h1>
    

        <div className="card">
         <button onClick={() => setCount((count) => count + 1)}>
           Count is {count}
            </button>
                </div>

      
      <hr className="divider" />
      
      <div className="lab-section">
        <h2>Лабораторная работа: Посты с пагинацией (Вариант 4)</h2>
        <h3>Загрузка постов с пагинацией</h3>
        
        {error && (
          <div className="error">
            Ошибка: {error}
          </div>
        )}
        
        {loading ? (
          <div className="loading">Загрузка постов...</div>
        ) : (
          <>
            <div className="table-container">
              <table>
                <thead>
                  <tr>
                    <th>ID</th>
                    <th>Title</th>
                    <th>Body (до 30 символов)</th>
                  </tr>
                </thead>
                <tbody>
                  {posts.map((post) => (
                    <tr key={post.id}>
                      <td className="post-id">{post.id}</td>
                      <td className="post-title">{truncateText(post.title, 50)}</td>
                      <td className="post-body">{truncateText(post.body, 30)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            
            <div className="pagination">
              <button 
                onClick={handlePrevPage}
                disabled={currentPage === 1}
                className="pagination-button"
              >
                Назад
              </button>
              
              <span className="page-info">
                Страница {currentPage}
              </span>
              
              <button 
                onClick={handleNextPage}
                className="pagination-button"
              >
                Вперед
              </button>
            </div>
            
            <div className="post-count">
              Показано {posts.length} постов (с {(currentPage - 1) * postsPerPage + 1} по {currentPage * postsPerPage})
            </div>
          </>
        )}
      </div>
      
      <p className="read-the-docs">
        Click on the Vite and React logos to learn more
      </p>
    </>
  )
}

export default App