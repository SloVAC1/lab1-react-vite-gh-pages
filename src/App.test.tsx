import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import App from './App'

// Мок для fetch
global.fetch = jest.fn()

describe('App - Лабораторная работа вариант 4', () => {
  beforeEach(() => {
    (fetch as jest.Mock).mockClear()
  })

  test('отображает заголовок лабораторной работы', () => {
    render(<App />)
    expect(screen.getByText(/Лабораторная работа: Посты с пагинацией/i)).toBeInTheDocument()
  })

  test('отображает кнопку Count', () => {
    render(<App />)
    expect(screen.getByText(/Count is/i)).toBeInTheDocument()
  })

  test('после клика "Вперед" отображаются посты с 11 по 20', async () => {
    // Первая загрузка - посты 1-10
    const firstPagePosts = Array.from({ length: 10 }, (_, i) => ({
      id: i + 1,
      title: `Post ${i + 1}`,
      body: `Body content ${i + 1}`
    }))

    // Вторая загрузка - посты 11-20
    const secondPagePosts = Array.from({ length: 10 }, (_, i) => ({
      id: i + 11,
      title: `Post ${i + 11}`,
      body: `Body content ${i + 11}`
    }))

    ;(fetch as jest.Mock)
      .mockResolvedValueOnce({
        ok: true,
        json: async () => firstPagePosts
      })
      .mockResolvedValueOnce({
        ok: true,
        json: async () => secondPagePosts
      })

    render(<App />)

    // Ждем загрузки первой страницы
    await waitFor(() => {
      expect(screen.getByText(/Post 1/i)).toBeInTheDocument()
      expect(screen.getByText(/Post 10/i)).toBeInTheDocument()
    })

    // Нажимаем кнопку "Вперед"
    const nextButton = screen.getByText('Вперед')
    fireEvent.click(nextButton)

    // Проверяем что fetch вызвался для второй страницы
    expect(fetch).toHaveBeenLastCalledWith(
      'https://jsonplaceholder.typicode.com/posts?_page=2&_limit=10'
    )

    // Ждем загрузки второй страницы
    await waitFor(() => {
      expect(screen.getByText(/Post 11/i)).toBeInTheDocument()
      expect(screen.getByText(/Post 20/i)).toBeInTheDocument()
      expect(screen.queryByText(/Post 1/i)).not.toBeInTheDocument()
    })
  })

  test('кнопка "Назад" становится активной на второй странице', async () => {
    const mockPosts = Array.from({ length: 10 }, (_, i) => ({
      id: i + 1,
      title: `Post ${i + 1}`,
      body: `Body ${i + 1}`
    }))

    ;(fetch as jest.Mock).mockResolvedValue({
      ok: true,
      json: async () => mockPosts
    })

    render(<App />)

    // Переходим на вторую страницу
    await waitFor(() => {
      const nextButton = screen.getByText('Вперед')
      fireEvent.click(nextButton)
    })

    // Кнопка "Назад" должна быть активной
    const prevButton = screen.getByText('Назад')
    expect(prevButton).not.toBeDisabled()
  })
})