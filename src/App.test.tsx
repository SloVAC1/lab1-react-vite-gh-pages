import { render, screen, act } from '@testing-library/react';
import App from './App';

// Мокаем импорт CSS
jest.mock('./App.css', () => ({}));

describe('App', () => {
  test('renders without crashing', async () => {
    await act(async () => {
      render(<App />);
    });
    
    expect(screen.getByText(/vite \+ react/i)).toBeInTheDocument();
  });
});