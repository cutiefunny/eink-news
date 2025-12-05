/* @refresh reload */
import { render } from 'solid-js/web';
import App from './App';
import './index.css'; // 기본 스타일이 있다면 포함

const root = document.getElementById('root');

if (import.meta.env.PROD && 'serviceWorker' in navigator) {
  // 프로덕션 빌드 시 서비스 워커 등록 (PWA 구동)
  window.addEventListener('load', () => {
    navigator.serviceWorker.register('/sw.js');
  });
}

if (!(root instanceof HTMLElement)) {
  throw new Error(
    'Root element not found. Did you forget to add it to your index.html? Or maybe the id attribute got misspelled?',
  );
}

render(() => <App />, root);