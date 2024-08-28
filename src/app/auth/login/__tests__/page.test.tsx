import '@testing-library/jest-dom';
import { render, screen, fireEvent } from '@testing-library/react';
import { useRouter } from 'next/navigation';
import { signIn } from 'next-auth/react';
import Page from '../page';

// next-auth의 signIn 함수를 모방(mock)합니다.
jest.mock('next-auth/react', () => ({
  signIn: jest.fn().mockRejectedValueOnce,
}));

describe('Page', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders the login form', () => {
    render(<Page />);
    expect(screen.getByLabelText('Username')).toBeInTheDocument();
    expect(screen.getByLabelText('Password')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Log In' })).toBeInTheDocument();
  });

  it('handles form submission', async () => {
    render(<Page />);
    const usernameInput = screen.getByLabelText('Username');
    const passwordInput = screen.getByLabelText('Password');
    const submitButton = screen.getByRole('button', { name: 'Log In' });

    fireEvent.change(usernameInput, { target: { value: 'testuser' } });
    fireEvent.change(passwordInput, { target: { value: 'testpassword' } });
    fireEvent.click(submitButton);

    expect(signIn).toHaveBeenCalledWith('credentials', {
      redirect: false,
      username: 'testuser',
      password: 'dGVzdHBhc3N3b3Jk', // Base64 encoded value of 'testpassword'
    });
    expect(useRouter().push).toHaveBeenCalledWith('/');
    expect(useRouter().refresh).toHaveBeenCalled();
  });

  it('handles form submission error', async () => {
    render(<Page />);
    const errorMessage = 'Invalid username or password';
    // signIn.mockRejectedValueOnce(new Error(errorMessage));

    const usernameInput = screen.getByLabelText('Username');
    const passwordInput = screen.getByLabelText('Password');
    const submitButton = screen.getByRole('button', { name: 'Log In' });

    fireEvent.change(usernameInput, { target: { value: 'testuser' } });
    fireEvent.change(passwordInput, { target: { value: 'testpassword' } });
    fireEvent.click(submitButton);

    expect(signIn).toHaveBeenCalledWith('credentials', {
      redirect: false,
      username: 'testuser',
      password: 'dGVzdHBhc3N3b3Jk', // Base64 encoded value of 'testpassword'
    });
    expect(useRouter().push).not.toHaveBeenCalled();
    expect(useRouter().refresh).not.toHaveBeenCalled();
    expect(window.alert).toHaveBeenCalledWith(errorMessage);
  });

  it('handles Kakao button click', () => {
    render(<Page />);
    const kakaoButton = screen.getByRole('button', { name: 'Kakao' });

    fireEvent.click(kakaoButton);

    expect(signIn).toHaveBeenCalledWith('kakao', { callbackUrl: '/' });
  });

  it('handles Naver button click', () => {
    render(<Page />);
    const naverButton = screen.getByRole('button', { name: 'Naver' });

    fireEvent.click(naverButton);

    expect(signIn).toHaveBeenCalledWith('naver', { callbackUrl: '/' });
  });

  it('handles Google button click', () => {
    render(<Page />);
    const googleButton = screen.getByRole('button', { name: 'Google' });

    fireEvent.click(googleButton);

    expect(signIn).toHaveBeenCalledWith('google', { callbackUrl: '/' });
  });
});