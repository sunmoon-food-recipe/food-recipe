// js/config.js

// 예시: 개발 환경과 프로덕션 환경에 따라 URL을 구분하는 방법
const dev = {
    API_BASE_URL: 'http://61.103.70.127:3000'
  };
  
  const prod = {
    API_BASE_URL: 'https://api.mydomain.com'
  };
  
  // 간단한 조건으로 환경을 선택 (실제 환경에서는 build 시 환경 변수를 주입하는 방식을 사용)
  // 여기서는 window.location.hostname으로 개발 환경을 판단하는 예시입니다.
  export const API_BASE_URL = window.location.hostname === 'localhost' ? dev.API_BASE_URL : prod.API_BASE_URL;
  