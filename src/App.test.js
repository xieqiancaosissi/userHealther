import { render, screen } from '@testing-library/react';
import App from './App';
console.log('1111');
console.log('3333');
test('renders learn react link', () => {
  render(<App />);
  const linkElement = screen.getByText(/learn react/i);
  expect(linkElement).toBeInTheDocument();
});
