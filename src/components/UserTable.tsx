import { useState } from 'react';

type User = {
  id: number;
  name: string;
  email: string;
  phone: string;
  website: string;
};

export default function UserTable() {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchUsers = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch('https://jsonplaceholder.typicode.com/users');
      if (!response.ok) {
        throw new Error(`Ошибка HTTP! Статус: ${response.status}`);
      }
      const data: User[] = await response.json();
      setUsers(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Ошибка при загрузке');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="user-table-container" style={{ marginTop: '2rem' }}>
      <button 
        onClick={fetchUsers} 
        disabled={loading}
        data-testid="load-users-button"
        style={{
          padding: '10px 20px',
          fontSize: '16px',
          cursor: loading ? 'not-allowed' : 'pointer'
        }}
      >
        {loading ? 'Загрузка...' : 'Загрузить пользователей'}
      </button>

      {error && <p style={{ color: 'red', marginTop: '10px' }} data-testid="error-message">{error}</p>}

      {users.length > 0 && (
        <table
          border={1}
          data-testid="users-table"
          style={{ 
            marginTop: '20px', 
            borderCollapse: 'collapse', 
            width: '100%',
            border: '1px solid #ddd'
          }}
        >
          <thead>
            <tr style={{ backgroundColor: '#f2f2f2' }}>
              <th style={{ padding: '10px', border: '1px solid #ddd' }}>Имя</th>
              <th style={{ padding: '10px', border: '1px solid #ddd' }}>Email</th>
              <th style={{ padding: '10px', border: '1px solid #ddd' }}>Телефон</th>
              <th style={{ padding: '10px', border: '1px solid #ddd' }}>Сайт</th>
            </tr>
          </thead>
          <tbody>
            {users.map((user) => (
              <tr key={user.id}>
                <td style={{ padding: '10px', border: '1px solid #ddd' }}>{user.name}</td>
                <td style={{ padding: '10px', border: '1px solid #ddd' }}>{user.email}</td>
                <td style={{ padding: '10px', border: '1px solid #ddd' }}>{user.phone}</td>
                <td style={{ padding: '10px', border: '1px solid #ddd' }}>
                  <a 
                    href={`http://${user.website}`} 
                    target="_blank" 
                    rel="noopener noreferrer"
                  >
                    {user.website}
                  </a>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}