import { render, screen, fireEvent, waitFor, act } from '@testing-library/react';
import PostsTable from './PostsTable';

const mockPosts = Array.from({ length: 100 }, (_, i) => ({
  id: i + 1,
  title: `Post ${i + 1}`,
  body: `Body for post ${i + 1} with some longer text to test truncation.`,
}));

describe('PostsTable', () => {
  beforeEach(() => {
    (global.fetch as jest.Mock).mockClear();
    (global.fetch as jest.Mock).mockResolvedValue({
      ok: true,
      json: async () => mockPosts,
    });
  });

  test('renders component and loads posts automatically', async () => {
    await act(async () => {
      render(<PostsTable />);
    });
    
    // Проверяем заголовок
    expect(screen.getByText(/посты с пагинацией/i)).toBeInTheDocument();
    
    // Ждем загрузки данных
    await waitFor(() => {
      expect(screen.getByText(/^Post 1$/i)).toBeInTheDocument();
    }, { timeout: 3000 });
    
    // Проверяем таблицу
    expect(screen.getByRole('table')).toBeInTheDocument();
  });

  test('displays first 10 posts initially', async () => {
    await act(async () => {
      render(<PostsTable />);
    });
    
    await waitFor(() => {
      expect(screen.getByText(/^Post 1$/i)).toBeInTheDocument();
      expect(screen.getByText(/^Post 10$/i)).toBeInTheDocument();
    }, { timeout: 3000 });
    
    expect(screen.queryByText(/^Post 11$/i)).not.toBeInTheDocument();
  });

  test('navigates to next page when clicking "Вперед"', async () => {
    await act(async () => {
      render(<PostsTable />);
    });
    
    await waitFor(() => {
      expect(screen.getByText(/^Post 1$/i)).toBeInTheDocument();
    }, { timeout: 3000 });
    
    const forwardButton = screen.getByRole('button', { name: /вперед/i });
    
    await act(async () => {
      fireEvent.click(forwardButton);
    });
    
    await waitFor(() => {
      expect(screen.getByText(/^Post 11$/i)).toBeInTheDocument();
      expect(screen.getByText(/^Post 20$/i)).toBeInTheDocument();
    }, { timeout: 3000 });
    
    expect(screen.queryByText(/^Post 1$/i)).not.toBeInTheDocument();
  });

  test('navigates to previous page when clicking "Назад"', async () => {
    await act(async () => {
      render(<PostsTable />);
    });
    
    await waitFor(() => {
      expect(screen.getByText(/^Post 1$/i)).toBeInTheDocument();
    }, { timeout: 3000 });
    
    const forwardButton = screen.getByRole('button', { name: /вперед/i });
    
    await act(async () => {
      fireEvent.click(forwardButton);
    });
    
    await waitFor(() => {
      expect(screen.getByText(/^Post 11$/i)).toBeInTheDocument();
    }, { timeout: 3000 });
    
    const backButton = screen.getByRole('button', { name: /назад/i });
    
    await act(async () => {
      fireEvent.click(backButton);
    });
    
    await waitFor(() => {
      expect(screen.getByText(/^Post 1$/i)).toBeInTheDocument();
    }, { timeout: 3000 });
    
    expect(screen.queryByText(/^Post 11$/i)).not.toBeInTheDocument();
  });

  test('truncates long text in body column', async () => {
    await act(async () => {
      render(<PostsTable />);
    });
    
    await waitFor(() => {
      expect(screen.getByText(/^Post 1$/i)).toBeInTheDocument();
    }, { timeout: 3000 });
    
    const bodyTextElements = screen.getAllByText(/\.\.\.$/);
    expect(bodyTextElements.length).toBeGreaterThan(0);
  });

  test('shows error when fetch fails', async () => {
    (global.fetch as jest.Mock).mockRejectedValueOnce(new Error('Network error'));
    
    await act(async () => {
      render(<PostsTable />);
    });
    
    await waitFor(() => {
      expect(screen.getByText(/ошибка/i)).toBeInTheDocument();
    }, { timeout: 3000 });
  });

  test('displays posts 11-20 after clicking "Вперед" (специфика варианта 4)', async () => {
    await act(async () => {
      render(<PostsTable />);
    });
    
    await waitFor(() => {
      expect(screen.getByText(/^Post 1$/i)).toBeInTheDocument();
    }, { timeout: 3000 });
    
    const forwardButton = screen.getByRole('button', { name: /вперед/i });
    
    await act(async () => {
      fireEvent.click(forwardButton);
    });
    
    await waitFor(() => {
      expect(screen.getByText(/^Post 11$/i)).toBeInTheDocument();
      expect(screen.getByText(/^Post 12$/i)).toBeInTheDocument();
      expect(screen.getByText(/^Post 20$/i)).toBeInTheDocument();
    }, { timeout: 3000 });
    
    expect(screen.queryByText(/^Post 1$/i)).not.toBeInTheDocument();
    expect(screen.queryByText(/^Post 10$/i)).not.toBeInTheDocument();
  });
});