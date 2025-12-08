import { render, screen, fireEvent } from '@testing-library/react'
import Counter from './Counter'

describe('Counter', () => {
  test('renders with initial count 0', () => {
    render(<Counter />)
    const button = screen.getByRole('button', { name: /count is 0/i })
    expect(button).toBeInTheDocument()
  })

  test('increments count when clicked', () => {
    render(<Counter />)
    const button = screen.getByRole('button', { name: /count is 0/i })
    
    fireEvent.click(button)
    expect(button).toHaveTextContent('count is 1')
    
    fireEvent.click(button)
    expect(button).toHaveTextContent('count is 2')
  })

test('shows edit instruction', () => {
  render(<Counter />)
  // Ищем элемент <p> который содержит и Edit и save to test HMR
  const instruction = screen.getByText((content, element) => {
    return element?.tagName.toLowerCase() === 'p' && 
           content.includes('Edit') && 
           content.includes('save to test HMR')
  })
  expect(instruction).toBeInTheDocument()
})
})