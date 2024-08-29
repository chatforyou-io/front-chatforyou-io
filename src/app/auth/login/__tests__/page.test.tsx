import '@testing-library/jest-dom';
import { render, screen, fireEvent, waitFor, act } from '@testing-library/react';
import { useRouter } from 'next/navigation';
import { signIn } from 'next-auth/react';
import Page from '../page';

// Next.js의 Image 컴포넌트를 모방(mock)합니다.
jest.mock('next/image', () => ({
  __esModule: true,
  default: (props: any) => {
    // eslint-disable-next-line @next/next/no-img-element
    return <img {...props} alt='' priority={undefined} />
  },
}));

// next-auth의 signIn 함수를 모방(mock)합니다.
jest.mock('next-auth/react', () => ({
  signIn: jest.fn(),
}));

// next/navigation의 useRouter 함수를 모방(mock)합니다.
jest.mock('next/navigation', () => ({
  useRouter: () => ({
    push: jest.fn(),
    refresh: jest.fn(),
  }),
}));

describe('Page', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    (signIn as jest.Mock).mockClear();
  });

  it('renders form elements', () => {
    render(<Page />);
    expect(screen.getByPlaceholderText('이메일 주소')).toBeInTheDocument();
    expect(screen.getByPlaceholderText('비밀번호')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: '로그인' })).toBeInTheDocument();
  });

  it('handles Kakao button click', () => {
    render(<Page />);
    const kakaoButton = screen.getByRole('button', { name: 'Kakao 로그인' });
    expect(kakaoButton).toBeInTheDocument();

    fireEvent.click(kakaoButton);

    expect(signIn).toHaveBeenCalledWith('kakao', { callbackUrl: '/' });
  });

  it('handles Naver button click', () => {
    render(<Page />);
    const naverButton = screen.getByRole('button', { name: 'Naver 로그인' });
    expect(naverButton).toBeInTheDocument();

    fireEvent.click(naverButton);

    expect(signIn).toHaveBeenCalledWith('naver', { callbackUrl: '/' });
  });

  it('handles Google button click', () => {
    render(<Page />);
    const googleButton = screen.getByRole('button', { name: 'Google 로그인' });
    expect(googleButton).toBeInTheDocument();

    fireEvent.click(googleButton);

    expect(signIn).toHaveBeenCalledWith('google', { callbackUrl: '/' });
  });
});