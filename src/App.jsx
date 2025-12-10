import { createSignal, createResource, For, Show, onCleanup } from 'solid-js';

// E-ink 기기 판별 헬퍼 함수
// (완벽한 감지는 어렵지만, UserAgent나 화면 특성을 기반으로 커스텀 가능)
const isEinkDevice = () => {
  // 예: 특정 E-ink 단말기(Onyx, Boox 등)의 UserAgent 키워드 체크
  const ua = navigator.userAgent.toLowerCase();
  if (ua.includes('onyx') || ua.includes('e-ink') || ua.includes('kindle')) {
    return true;
  }
  // 예: 컬러 지원 여부로 느슨하게 체크 (E-ink는 보통 흑백)
  // 다만 최신 E-ink는 컬러도 있고, 모바일 크롬도 color-gamut을 지원하므로 주의 필요
  // 개발자님의 상황에 맞춰 'true'로 하드코딩하거나 조건을 추가하세요.
  return false; 
};

// 뉴스 데이터 API 호출
const fetchNews = async () => {
  try {
    const response = await fetch('https://musclecat.co.kr/getEinkNews', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ category: 'all', limit: 30 })
    });
    
    if (!response.ok) throw new Error('Network response was not ok');
    const json = await response.json();
    return json.data || [];
  } catch (error) {
    console.error("Fetch error:", error);
    throw error;
  }
};

// 서버 TTS API 호출 (고품질 음성)
const fetchTTS = async (text) => {
  try {
    // 실제 백엔드 구현에 맞춰 엔드포인트와 바디 수정 필요
    // OpenAI TTS 등을 백엔드에서 호출하고 오디오 파일(Blob)을 반환한다고 가정
    const response = await fetch('https://musclecat.co.kr/generate-tts', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ text: text })
    });

    if (!response.ok) throw new Error('TTS response was not ok');
    return await response.blob(); // 오디오 블롭 반환
  } catch (error) {
    console.error("TTS Fetch error:", error);
    return null;
  }
};

function App() {
  const [refetchIndex, setRefetchIndex] = createSignal(0);
  
  // 오디오 상태 관리
  const [isPlaying, setIsPlaying] = createSignal(false);
  const [currentAudio, setCurrentAudio] = createSignal(null); // 현재 재생 중인 Audio 객체
  const [readingIndex, setReadingIndex] = createSignal(-1); // 현재 읽고 있는 기사 인덱스

  const [newsData] = createResource(refetchIndex, fetchNews);

  // E-ink 기기 여부 확인
  const isEink = isEinkDevice();

  // 읽기 중단 및 초기화
  const stopReading = () => {
    if (currentAudio()) {
      currentAudio().pause();
      setCurrentAudio(null);
    }
    setIsPlaying(false);
    setReadingIndex(-1);
  };

  // 순차적 재생 로직 (재귀적 실행)
  const playSequence = async (index, data) => {
    // 범위를 벗어나거나 중단 요청 시 종료
    if (index >= data.length || !isPlaying()) {
      stopReading();
      return;
    }

    setReadingIndex(index);
    const item = data[index];
    const textToRead = `${item.title}. ${item.summary}`;

    // 서버에서 오디오 데이터(MP3 Blob) 가져오기
    const audioBlob = await fetchTTS(textToRead);
    
    // 가져오는 동안 중단되었을 수도 있으니 체크
    if (!audioBlob || !isPlaying()) return;

    const audioUrl = URL.createObjectURL(audioBlob);
    const audio = new Audio(audioUrl);
    
    setCurrentAudio(audio);

    audio.onended = () => {
      // 재생 끝나면 다음 인덱스 실행
      URL.revokeObjectURL(audioUrl); // 메모리 해제
      playSequence(index + 1, data);
    };

    audio.onerror = () => {
      console.error("Audio playback error");
      playSequence(index + 1, data); // 에러나면 다음으로 넘어감
    };

    audio.play().catch(e => console.error("Play failed", e));
  };

  const startReading = () => {
    const data = newsData();
    if (!data || data.length === 0) return;

    stopReading(); // 기존 재생 정리
    setIsPlaying(true);
    playSequence(0, data); // 0번부터 시작
  };

  const toggleReading = () => {
    if (isPlaying()) {
      stopReading();
    } else {
      startReading();
    }
  };

  const handleRefresh = () => {
    stopReading();
    setRefetchIndex((prev) => prev + 1);
  };

  onCleanup(() => {
    stopReading();
  });

  return (
    <div style={styles.container}>
      <header style={styles.header}>
        <h1 style={styles.title}>E-ink News</h1>
        <div style={styles.headerBtnGroup}>
          
          {/* 읽기 버튼 제거됨 */}
          
          <button style={styles.btn} onClick={handleRefresh}>
            {newsData.loading ? '로딩...' : '새로고침'}
          </button>
        </div>
      </header>

      <main style={styles.content}>
        <Show when={!newsData.loading} fallback={<div style={styles.statusMsg}>최신 뉴스를 가져오는 중...</div>}>
          <Show when={!newsData.error} fallback={<div style={styles.statusMsg}>불러오기 실패. 인터넷 연결을 확인하세요.</div>}>
            <Show when={newsData() && newsData().length > 0} fallback={<div style={styles.statusMsg}>등록된 뉴스가 없습니다.</div>}>
              
              <div style={styles.list}>
                <For each={newsData()}>
                  {(item, index) => (
                    <article style={{
                      ...styles.card,
                      // 현재 읽고 있는 기사 강조 (선택 사항)
                      "background-color": index() === readingIndex() ? "#f0f0f0" : "#ffffff"
                    }}>
                      <div style={styles.meta}>
                        <span style={styles.source}>
                           [{getCategoryName(item.category)} / {item.source}]
                        </span>
                        <span style={styles.time}>{item.time}</span>
                      </div>

                      <h2 style={styles.newsTitle}>
                        <a href={item.link} target="_blank" rel="noreferrer" style={styles.link}>
                          {item.title}
                        </a>
                      </h2>

                      <div style={styles.summaryBox}>
                        <p style={styles.summaryText}>{item.summary}</p>
                      </div>
                    </article>
                  )}
                </For>
              </div>

            </Show>
          </Show>
        </Show>
      </main>
      
      <footer style={styles.footer}>
        End of List
      </footer>
    </div>
  );
}

function getCategoryName(cat) {
  const map = {
    'economy': '경제',
    'society': '사회',
    'tech': '테크',
    'accident': '사건'
  };
  return map[cat] || cat;
}

const styles = {
  container: {
    "max-width": "800px",
    "margin": "0 auto",
    "padding": "0",
    "background-color": "#ffffff",
    "min-height": "100vh",
    "font-family": "'Noto Sans KR', sans-serif",
    "color": "#000000",
  },
  header: {
    "display": "flex",
    "justify-content": "space-between",
    "align-items": "center",
    "padding": "1rem 1.2rem",
    "border-bottom": "3px solid #000000", 
  },
  title: {
    "margin": 0,
    "font-size": "1.8rem",
    "font-weight": "900",
    "letter-spacing": "-1px",
  },
  headerBtnGroup: {
    "display": "flex",
    "gap": "0.5rem",
  },
  btn: {
    "padding": "0.5rem 0.8rem",
    "font-size": "0.9rem",
    "border": "2px solid #000000",
    "background": "#ffffff",
    "cursor": "pointer",
    "font-weight": "bold",
    "color": "#000000",
    "white-space": "nowrap",
  },
  activeBtn: {
    "padding": "0.5rem 0.8rem",
    "font-size": "0.9rem",
    "border": "2px solid #000000",
    "background": "#000000",
    "cursor": "pointer",
    "font-weight": "bold",
    "color": "#ffffff",
    "white-space": "nowrap",
  },
  content: {
    "padding": "0",
  },
  statusMsg: {
    "padding": "3rem",
    "text-align": "center",
    "font-size": "1.2rem",
    "font-weight": "bold",
  },
  list: {
    "display": "flex",
    "flex-direction": "column",
  },
  card: {
    "padding": "1.5rem 1.2rem", 
    "border-bottom": "1px solid #000000",
    "transition": "background-color 0.3s"
  },
  meta: {
    "display": "flex",
    "justify-content": "space-between",
    "margin-bottom": "0.6rem",
    "font-size": "0.85rem",
    "font-weight": "700",
  },
  source: {},
  time: {
    "font-family": "monospace", 
    "font-size": "0.9rem",
    "color": "#000000",
  },
  newsTitle: {
    "margin": "0 0 1rem 0",
    "font-size": "1.4rem",
    "line-height": "1.3",
    "word-break": "keep-all",
    "font-weight": "800",
  },
  link: {
    "color": "#000000",
    "text-decoration": "none",
  },
  summaryBox: {
    "padding": "0.8rem",
    "border": "2px solid #000000", 
    "background-color": "#ffffff",
  },
  summaryText: {
    "margin": 0,
    "font-size": "1.05rem",
    "line-height": "1.6",
    "white-space": "pre-wrap",
  },
  footer: {
    "padding": "2rem",
    "text-align": "center",
    "font-size": "0.8rem",
    "border-top": "3px solid black",
    "margin-top": "auto",
    "font-weight": "bold"
  }
};

export default App;