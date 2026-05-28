import { render, screen } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import App from '../App'

const renderAt = (path) =>
  render(<MemoryRouter initialEntries={[path]}><App /></MemoryRouter>)

describe('App routing', () => {
  it('renders Escalation page at /', () => {
    renderAt('/')
    expect(screen.getByText(/escalation.*costruzione/i)).toBeInTheDocument()
  })

  it('renders Storico page at /storico', () => {
    renderAt('/storico')
    expect(screen.getByText(/storico.*costruzione/i)).toBeInTheDocument()
  })

  it('renders Analytics page at /analytics', () => {
    renderAt('/analytics')
    expect(screen.getByText(/analytics.*costruzione/i)).toBeInTheDocument()
  })

  it('renders Impostazioni page at /impostazioni', () => {
    renderAt('/impostazioni')
    expect(screen.getByText(/impostazioni.*costruzione/i)).toBeInTheDocument()
  })

  it('renders KpiBar logo on every route', () => {
    renderAt('/storico')
    expect(screen.getByText('FiltroCappa')).toBeInTheDocument()
  })

  it('renders all 4 sidebar nav items on every route', () => {
    renderAt('/analytics')
    expect(screen.getByText('Escalation')).toBeInTheDocument()
    expect(screen.getByText('Analytics')).toBeInTheDocument()
  })
})
