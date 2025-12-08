import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import UserTable from './UserTable';

describe('UserTable', () => {
  beforeEach(() => {
    (global.fetch as jest.Mock).mockClear();
  });

  test('renders button and does not show table initially', () => {
    render(<UserTable />);
    expect(screen.getByText(/загрузить пользователей/i)).toBeInTheDocument();
    expect(screen.queryByRole('table')).not.toBeInTheDocument();
  });

  test('loads users and displays them when button is clicked', async () => {
    const mockUsers = [
      {
        id: 1,
        name: 'Иван Иванов',
        email: 'ivan@example.com',
        phone: '+7 (999) 123-45-67',
        website: 'example.com',
      },
      {
        id: 2,
        name: 'Мария Петрова',
        email: 'maria@example.com',
        phone: '+7 (999) 987-65-43',
        website: 'test.com',
      },
    ];

    (global.fetch as jest.Mock).mockResolvedValueOnce({
      ok: true,
      json: async () => mockUsers,
    });

    render(<UserTable />);
    fireEvent.click(screen.getByText(/загрузить пользователей/i));

    // Проверяем загрузку
    expect(await screen.findByText(/загрузка.../i)).toBeInTheDocument();

    // Ждем появления данных
    await waitFor(() => {
      expect(screen.getByText(/иван иванов/i)).toBeInTheDocument();
      expect(screen.getByText(/ivan@example.com/i)).toBeInTheDocument();
      expect(screen.getByText(/мария петрова/i)).toBeInTheDocument();
    });

    // Проверяем таблицу
    expect(screen.getByRole('table')).toBeInTheDocument();
  });

  test('shows error when fetch fails', async () => {
    (global.fetch as jest.Mock).mockRejectedValueOnce(new Error('Network error'));

    render(<UserTable />);
    fireEvent.click(screen.getByText(/загрузить пользователей/i));

    // Ищем по ТОЧНОМУ тексту ошибки который есть в компоненте
    expect(await screen.findByText('Network error')).toBeInTheDocument();
  });

  test('handles HTTP error response', async () => {
    (global.fetch as jest.Mock).mockResolvedValueOnce({
      ok: false,
      status: 500,
    });

    render(<UserTable />);
    fireEvent.click(screen.getByText(/загрузить пользователей/i));

    // Ищем по ТОЧНОМУ тексту который генерируется в компоненте
    expect(await screen.findByText('Ошибка HTTP! Статус: 500')).toBeInTheDocument();
  });
});