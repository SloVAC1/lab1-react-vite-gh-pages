import { render, screen } from '@testing-library/react'
import App from './App'

describe('App', () => {
  test('renders Vite and React logos', () => {
    render(<App />)
    
    const viteLogo = screen.getByAltText('Vite logo')
    const reactLogo = screen.getByAltText('React logo')
    
    expect(viteLogo).toBeInTheDocument()
    expect(reactLogo).toBeInTheDocument()
  })

  test('renders "Vite + React" heading', () => {
    render(<App />)
    const heading = screen.getByRole('heading', { name: /vite \+ react/i })
    expect(heading).toBeInTheDocument()
  })
})