import "@testing-library/jest-dom";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { signIn } from "next-auth/react";
import Page from "../page";

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

// Page 컴포넌트에 대한 테스트 케이스를 작성합니다.
describe("Page", () => {
  // 테스트 케이스 실행 전에 jest.spyOn을 사용하여 모든 mock 함수를 초기화합니다.
  beforeEach(() => {
    jest.clearAllMocks();
  });

  // 각 소셜 로그인 버튼을 클릭했을 때 signIn 함수가 호출되는지 확인합니다.
  const testCases = [
    { provider: "kakao", buttonLabel: "kakao login button" },
    { provider: "naver", buttonLabel: "naver login button" },
    { provider: "google", buttonLabel: "google login button" },
  ];

  test.each(testCases)("handles provider button click", async ({ provider, buttonLabel }) => {
    render(<Page />);
    await userEvent.click(screen.getByLabelText(buttonLabel));
    expect(signIn).toHaveBeenCalledWith(provider, { redirect: false });
  });
});