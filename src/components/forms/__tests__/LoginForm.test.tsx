import "@testing-library/jest-dom";
import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { signIn } from "next-auth/react";
import LoginForm from "../LoginForm";

// next-auth/react 모듈을 mock 함수로 만들어줍니다.
jest.mock("next-auth/react", () => ({
  signIn: jest.fn(),
}));

// next/navigation 모듈을 mock 함수로 만들어줍니다.
jest.mock("next/navigation", () => ({
  useRouter: () => ({
    push: jest.fn(),
    refresh: jest.fn(),
  }),
}));

// LoginForm 컴포넌트에 대한 테스트 케이스를 작성합니다.
describe("LoginForm", () => {
  // 테스트 케이스 실행 전에 jest.spyOn을 사용하여 모든 mock 함수를 초기화합니다.
  beforeEach(() => {
    jest.clearAllMocks();
  });

  // 로그인 버튼을 클릭했을 때 signIn 함수가 호출되는지 확인합니다.
  test("should call handleSubmit when submit button is clicked", async () => {
    // LoginForm 컴포넌트를 렌더링합니다.
    render(<LoginForm />);

    // 이메일 주소와 비밀번호를 입력합니다.
    const usernameInput = screen.getByLabelText("이메일 주소");
    const passwordInput = screen.getByLabelText("비밀번호");
    await userEvent.type(usernameInput, process.env.LOGIN_FORM_TEST_USERNAME || '');
    await userEvent.type(passwordInput, process.env.LOGIN_FORM_TEST_PASSWORD || '');

    // 로그인 버튼을 클릭합니다.
    const submitButton = screen.getByRole("button", { name: "로그인" });
    await userEvent.click(submitButton);

    // signIn 함수가 호출되었는지 확인합니다.
    expect(signIn).toHaveBeenCalledWith(
      "credentials",
      {
        redirect: false,
        username: process.env.LOGIN_FORM_TEST_USERNAME || '',
        password: process.env.LOGIN_FORM_TEST_PASSWORD || '',
      }
    );
  });
});