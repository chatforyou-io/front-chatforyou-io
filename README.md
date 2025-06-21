# ChatForYou.io - 화상 채팅 서비스

## 프로젝트 개요

ChatForYou.io는 실시간 화상 채팅 서비스를 제공하는 웹 애플리케이션입니다. 이 서비스는 Next.js, React, OpenVidu를 기반으로 구축되었으며, 사용자들이 쉽게 화상 채팅방을 만들고 참여할 수 있는 기능을 제공합니다.

## 프로젝트 구조

```
front-chatforyou-io/
├── app/
│   ├── api/                   # API Route 핸들러
│   │   └── auth/              # 소셜 로그인, 로그인, 로그아웃, 사용자 정보 등
│   │   └── me/
│   │   └── signin/
│   │   └── signout/
│   ├── auth/                  # 로그인 및 회원가입 UI
│   ├── chatroom/              # 채팅방 UI
│   │   └── view/[sessionId]/  # 세션별 채팅방
│   ├── layout.tsx            # 전역 레이아웃
│   ├── page.tsx              # 메인 페이지
├── components/               # 공통 UI 컴포넌트
├── contexts/                 # 전역 상태 관리 (OpenVidu, Session 등)
├── libs/
│   ├── sses/                 # SSE 관련 로직
│   ├── utils/                # axios 기반 API 유틸
├── mocks/                    # 테스트용 mock 데이터
├── schemas/                  # zod 기반 유효성 스키마
├── types/                    # 공용 타입 정의
├── globals.css               # 전역 스타일
```

## 주요 기능

1. 인증 기능 (auth.ts)

- 이메일/비밀번호 로그인
- 소셜 로그인 (provider 방식)
- 이메일 유효성 검사
- 액세스/리프레시 토큰 관리
- 로그아웃, 토큰 갱신 기능

2. 사용자 기능 (user.ts)

- 회원가입
- 정보 수정/삭제
- 닉네임 중복 체크
- 사용자 리스트 및 현재 접속자 조회

3. 채팅방 기능 (chatroom.ts)

- 채팅방 생성
- 목록 조회, 상세 정보
- OpenVidu 토큰 발급 및 세션 참여

## 기술 스택

- **Frontend**: Next.js 14 기반 CSR/SSR 병행 구조
- **UI 라이브러리 및 스타일링**: Tailwind CSS, clsx
- **인증**: Firebase Authentication (소셜 및 이메일/비밀번호 로그인 지원)
- **API 통신**: Axios 기반 RESTful 통신 구조
- **폼 및 유효성 검사**: React Hook Form + Zod
- **화상 통화**: OpenVidu WebRTC 세션 기반 구조
- **상태 관리**: React Context API (OpenViduContext, SessionContext 등)
- **테스트**: Jest, React Testing Library (유닛 및 컴포넌트 테스트 중심)

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

- **NEXT_PUBLIC_DOMAIN**: 프론트엔드 앱의 도메인 주소
- **NEXT_PUBLIC_API_DOMAIN**: 백엔드 API 서버의 도메인 주소
- **JWT_SECRET**: JWT 토큰 서명 및 검증을 위한 비밀 키
- **KAKAO_CLIENT_SECRET**: 카카오 보안 강화를 위한 Secret 키 
- **KAKAO_CLIENT_ID**: 카카오 개발자 콘솔에서 발급받은 REST API 키
- **KAKAO_REDIRECT_URI**: 카카오 로그인 성공 후 리디렉션될 URI
- **KAKAO_STATE**: CSRF 방지를 위한 임의 문자열
- **NAVER_CLIENT_SECRET**: 네이버 보안 강화를 위한 Secret 키 
- **NAVER_CLIENT_ID**: 네이버 개발자 콘솔에서 발급받은 REST API 키
- **NAVER_REDIRECT_URI**: 네이버 로그인 성공 후 리디렉션될 URI
- **NAVER_STATE**: CSRF 방지를 위한 임의 문자열
- **GOOGLE_CLIENT_SECRET**: 구글 보안 강화를 위한 Secret 키 
- **GOOGLE_CLIENT_ID**: 구글 개발자 콘솔에서 발급받은 REST API 키
- **GOOGLE_REDIRECT_URI**: 구글 로그인 성공 후 리디렉션될 URI
- **GOOGLE_STATE**: CSRF 방지를 위한 임의 문자열

## 테스팅

Jest와 React Testing Library를 사용하여 단위 테스트를 실행할 수 있습니다:

```
npm run test
```
