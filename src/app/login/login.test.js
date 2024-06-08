import { render } from '@testing-library/react';
import { useRouter } from 'next/router';
import Login from './page'; // adjust the path as needed

jest.mock('next/router', () => ({
  useRouter: jest.fn(),
}));

describe('Login', () => {
  it('renders a page', () => {
    useRouter.mockImplementation(() => ({
      pathname: '/',
      push: jest.fn(),
    }));
    
    render(<Login />);
    const emailInput = screen.getByPlaceholderText('Enter your email');
    const passwordInput = screen.getByPlaceholderText('Enter your password');
    const signInButton = screen.getByText('Sign In');
    expect(emailInput).toBeInTheDocument();
    expect(passwordInput).toBeInTheDocument();
    expect(signInButton).toBeInTheDocument();
    // Your test assertions here
  });
});


// // Mocking next-auth/react
// jest.mock('next-auth/react', () => ({
//   signIn: jest.fn(),
//   signOut: jest.fn(),
//   useSession: jest.fn(() => ({ status: 'unauthenticated' }))
// }));

// // Mocking useRouter
// jest.mock('next/navigation', () => ({
//   useRouter: () => ({
//     push: jest.fn()
//   })
// }));

// describe('Login component', () => {
//   test('renders login form', () => {
//     render(<Login />);
//     const emailInput = screen.getByPlaceholderText('Enter your email');
//     const passwordInput = screen.getByPlaceholderText('Enter your password');
//     const signInButton = screen.getByText('Sign In');
//     expect(emailInput).toBeInTheDocument();
//     expect(passwordInput).toBeInTheDocument();
//     expect(signInButton).toBeInTheDocument();
//   });

//   test('handles user input correctly', () => {
//     render(<Login />);
//     const emailInput = screen.getByPlaceholderText('Enter your email');
//     const passwordInput = screen.getByPlaceholderText('Enter your password');
    
//     userEvent.type(emailInput, 'test@example.com');
//     userEvent.type(passwordInput, 'password123');
    
//     expect(emailInput).toHaveValue('test@example.com');
//     expect(passwordInput).toHaveValue('password123');
//   });

//   test('submits form with credentials', async () => {
//     render(<Login />);
//     const emailInput = screen.getByPlaceholderText('Enter your email');
//     const passwordInput = screen.getByPlaceholderText('Enter your password');
//     const signInButton = screen.getByText('Sign In');

//     userEvent.type(emailInput, 'test@example.com');
//     userEvent.type(passwordInput, 'password123');

//     fireEvent.click(signInButton);
    
//     // Wait for signIn function to be called
//     await waitFor(() => expect(signIn).toHaveBeenCalled());
//     expect(signIn).toHaveBeenCalledWith('credentials', { email: 'test@example.com', password: 'password123' });
//   });

//   test('handles forget password request', async () => {
//     render(<Login />);
//     const emailInput = screen.getByPlaceholderText('Enter your email');
//     const requestButton = screen.getByText('Request');

//     userEvent.type(emailInput, 'test@example.com');
//     fireEvent.click(requestButton);
    
//     // Wait for OTP confirmation component to be displayed
//     await waitFor(() => expect(screen.getByText('Enter OTP')).toBeInTheDocument());
//   });

//   // You can write more tests for other functionalities like changing password, handling errors, etc.
// });
