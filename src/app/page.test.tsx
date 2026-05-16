import { render, screen } from '@testing-library/react'
import Home from '@/app/page'
import { expect, test } from 'vitest'

test('Home page renders successfully', () => {
  render(<Home />)
  // Just a basic check to see if it renders something from the default Next.js template
  // If it's a fresh Next.js app, it might have "Get started" or similar
})