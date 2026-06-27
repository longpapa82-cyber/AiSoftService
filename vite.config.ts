import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// AI Soft 통합 랜딩. 배포 위치 미정이므로 base는 상대 경로로 둔다.
export default defineConfig({
  plugins: [react()],
  base: './',
  build: {
    target: 'es2020',
    cssCodeSplit: false,
  },
});
