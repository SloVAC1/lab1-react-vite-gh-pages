import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'
import Counter from './components/Counter'
import UserTable from './components/UserTable'
import PostsTable from './components/PostsTable' // ✅ Добавляем новый компонент

function App() {
  const [count, setCount] = useState(0)

  return (
    <>
      <div>
        <a href="https://vite.dev" target="_blank">
          <img src={viteLogo} className="logo" alt="Vite logo" />
        </a>
        <a href="https://react.dev" target="_blank">
          <img src={reactLogo} className="logo react" alt="React logo" />
        </a>
      </div>
      <h1>Vite + React</h1>
      <Counter />
      
      {/* Лабораторная 1: UserTable */}
      <div style={{ marginTop: '40px', padding: '20px', borderTop: '2px solid #ccc' }}>
        <h2>Лабораторная работа: Загрузка пользователей</h2>
        <UserTable />
      </div>
      
      {/* Лабораторная 2: PostsTable с пагинацией (Вариант 4) */}
      <div style={{ marginTop: '40px', padding: '20px', borderTop: '2px solid #ccc' }}>
        <h2>Лабораторная работа: Посты с пагинацией (Вариант 4)</h2>
        <PostsTable />
      </div>
      
      <p className="read-the-docs">
        Click on the Vite and React logos to learn more
      </p>
    </>
  )
}

export default App