import { render, screen } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import Sidebar from '../components/Sidebar'

const wrap = (ui, path = '/') =>
  render(<MemoryRouter initialEntries={[path]}>{ui}</MemoryRouter>)

describe('Sidebar', () => {
  it('renders all 4 nav items', () => {
    wrap(<Sidebar pendingCount={0} />)
    expect(screen.getByText('Escalation')).toBeInTheDocument()
    expect(screen.getByText('Storico')).toBeInTheDocument()
    expect(screen.getByText('Analytics')).toBeInTheDocument()
    expect(screen.getByText('Impostazioni')).toBeInTheDocument()
  })

  it('shows badge when pendingCount > 0', () => {
    wrap(<Sidebar pendingCount={3} />)
    expect(screen.getByTestId('escalation-badge')).toHaveTextContent('3')
  })

  it('hides badge when pendingCount is 0', () => {
    wrap(<Sidebar pendingCount={0} />)
    expect(screen.queryByTestId('escalation-badge')).not.toBeInTheDocument()
  })

  it('escalation nav link points to /', () => {
    wrap(<Sidebar pendingCount={0} />)
    expect(screen.getByRole('link', { name: /escalation/i })).toHaveAttribute('href', '/')
  })

  it('storico nav link points to /storico', () => {
    wrap(<Sidebar pendingCount={0} />)
    expect(screen.getByRole('link', { name: /storico/i })).toHaveAttribute('href', '/storico')
  })
})
