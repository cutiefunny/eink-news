# 📰 E-ink News

> E-ink 디바이스에 최적화된 뉴스 리더 웹 애플리케이션입니다.

**E-ink News**는 SolidJS와 Vite를 기반으로 구축되었으며, PWA(Progressive Web App) 및 Android TWA(Trusted Web Activity)를 지원하여 웹과 모바일 환경 모두에서 쾌적한 사용 경험을 제공합니다.

🔗 **Live Demo:** [https://eink-news.vercel.app](https://eink-news.vercel.app)

<br/>

## ✨ 주요 기능 (Features)

* **⚡ 초고속 성능:** SolidJS와 Vite를 사용하여 빠르고 가벼운 렌더링 속도를 자랑합니다.
* **📱 PWA 지원:** 설치형 웹 앱으로 동작하며, 오프라인 지원 및 홈 화면 추가가 가능합니다.
* **🤖 Android TWA:** Bubblewrap을 통해 생성된 TWA로, 안드로이드 앱처럼 설치 및 실행할 수 있습니다.
* **👁️ E-ink 최적화:** 전자잉크 디스플레이에서도 가독성이 뛰어난 UI를 제공합니다.

<br/>

## 🛠️ 기술 스택 (Tech Stack)

* **Framework:** [SolidJS](https://solidjs.com)
* **Build Tool:** [Vite](https://vitejs.dev)
* **PWA:** [vite-plugin-pwa](https://github.com/vite-pwa/vite-plugin-pwa)
* **Android TWA:** [Bubblewrap](https://github.com/GoogleChromeLabs/bubblewrap)

<br/>

## 🚀 시작하기 (Getting Started)

프로젝트를 로컬 환경에서 실행하려면 다음 단계를 따르세요.

### 사전 요구 사항 (Prerequisites)

* Node.js (v14 이상 권장)
* npm, pnpm 또는 yarn

### 설치 (Installation)

```bash
# 레포지토리 클론
$ git clone [https://github.com/your-username/eink-news.git](https://github.com/your-username/eink-news.git)

# 프로젝트 폴더로 이동
$ cd eink-news

# 패키지 설치
$ npm install
# or
$ pnpm install
# or
$ yarn install
💻 사용 방법 (Usage)
개발 서버 실행 (Development)
로컬 개발 서버를 시작합니다. 브라우저에서 http://localhost:5173으로 접속하여 확인하세요.

Bash

$ npm run dev
프로덕션 빌드 (Build)
배포를 위한 최적화된 빌드 파일을 dist 폴더에 생성합니다.

Bash

$ npm run build
미리보기 (Preview)
빌드된 결과물을 로컬에서 미리 확인합니다.

Bash

$ npm run preview
📱 안드로이드 TWA 설정 (Android TWA)
이 프로젝트는 Android TWA(Trusted Web Activity)로 패키징할 수 있도록 설정되어 있습니다. 관련 설정은 twa-manifest.json 파일에서 확인할 수 있습니다.

App Name: E-ink News

Package ID: app.vercel.eink_news.twa

Host: eink-news.vercel.app

🤝 기여하기 (Contributing)
버그 리포트, 기능 제안, PR은 언제나 환영합니다! 기여에 대한 자세한 내용은 이슈 탭을 확인해주세요.

이 프로젝트를 Fork 합니다.

새로운 Feature 브랜치를 생성합니다. (git checkout -b feature/AmazingFeature)

변경 사항을 Commit 합니다. (git commit -m 'Add some AmazingFeature')

브랜치에 Push 합니다. (git push origin feature/AmazingFeature)

Pull Request를 요청합니다.

📝 라이선스 (License)
이 프로젝트는 MIT License에 따라 배포됩니다.