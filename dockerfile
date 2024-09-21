# 다단계 빌드를 사용하여 이미지 크기 최적화

# 1단계: Next.js 앱 빌드
FROM node:20-alpine AS builder
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
RUN npm run build

# 2단계: 빌드된 파일로 실행
FROM node:20-alpine
WORKDIR /app
COPY --from=builder /app ./
RUN npm install --production

# 포트 노출
EXPOSE 3000

# 프로덕션 모드로 Next.js 앱 실행
CMD ["npm", "run", "start:prod"]