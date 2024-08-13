/** @type {import('postcss-load-config').Config} */
const config = {
  plugins: {
    tailwindcss: {},
    'postcss-rem-to-pixel': {
      rootValue: 16, // 기본 폰트 크기 설정
      propList: ['*'], // 변환할 CSS 속성 목록
    },
  },
};

export default config;
