import { render, screen } from '@testing-library/react'
import KpiBar from '../components/KpiBar'

describe('KpiBar', () => {
  it('renders the logo', () => {
    render(<KpiBar kpis={[]} />)
    expect(screen.getByText('FiltroCappa')).toBeInTheDocument()
  })

  it('renders 4 KPI pills with their labels', () => {
    const kpis = [
      { label: 'In attesa',      value: '--', dotColor: 'var(--status-waiting)'  },
      { label: 'Richieste oggi', value: '--', dotColor: 'var(--status-ai)'       },
      { label: 'Gestite AI',     value: '--', dotColor: 'var(--status-resolved)' },
      { label: 'Tempo medio',    value: '--', dotColor: 'var(--status-progress)' },
    ]
    render(<KpiBar kpis={kpis} />)
    expect(screen.getByText('In attesa')).toBeInTheDocument()
    expect(screen.getByText('Richieste oggi')).toBeInTheDocument()
    expect(screen.getByText('Gestite AI')).toBeInTheDocument()
    expect(screen.getByText('Tempo medio')).toBeInTheDocument()
  })

  it('renders the avatar button', () => {
    render(<KpiBar kpis={[]} />)
    expect(screen.getByRole('button', { name: /avatar/i })).toBeInTheDocument()
  })
})
