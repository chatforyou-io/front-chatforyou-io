# ChatForYou.io - 화상 채팅 서비스

## 프로젝트 개요

ChatForYou.io는 실시간 화상 채팅 서비스를 제공하는 웹 애플리케이션입니다. 이 서비스는 Next.js, React, OpenVidu를 기반으로 구축되었으며, 사용자들이 쉽게 화상 채팅방을 만들고 참여할 수 있는 기능을 제공합니다.

## 주요 기능

- 실시간 화상 채팅
- 채팅방 생성 및 참여
- 사용자 인증 (Next-Auth 사용)
- 반응형 디자인

## 기술 스택

- Frontend: Next.js, React
- 화상 통화: OpenVidu
- 인증: Next-Auth
- 스타일링: Tailwind CSS
- 상태 관리: React Hooks
- 테스팅: Jest, React Testing Library

## 설치 및 실행

1. 저장소 클론:
   ```
   git clone https://github.com/chatforyou-io/front-chatforyou-io
   ```

2. 의존성 설치:
   ```
   npm install
   ```

3. 개발 서버 실행:
   ```
   npm run dev
   ```

4. 프로덕션 빌드:
   ```
   npm run build
   ```

5. 프로덕션 서버 실행:
   ```
   npm run start:prod
   ```

## 환경 설정

프로젝트 실행을 위해 다음 환경 변수를 설정해야 합니다:

- `NEXT_PUBLIC_OPENVIDU_URL`: OpenVidu 서버 URL
- `NEXT_PUBLIC_OPENVIDU_SECRET`: OpenVidu 비밀키
- `NEXTAUTH_URL`: Next-Auth 콜백 URL
- `NEXTAUTH_SECRET`: Next-Auth 비밀키

## 테스팅

Jest와 React Testing Library를 사용하여 단위 테스트를 실행할 수 있습니다:

```
npm run test
```
