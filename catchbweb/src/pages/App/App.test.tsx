import { render } from '@testing-library/react';

import App from './App';

jest.mock("@components/Header", () => ({
  Header: () => <div>Header</div>
}));
jest.mock("@components/NavBar", () => ({
  NavBar: () => <div>NavBar</div>
}));
jest.mock("@components/Footer", () => ({
  Footer: () => <div>Footer</div>
}));

describe('<App />', () => {
  it('renders without crashing', () => {
    render(<App />);
  });
});
