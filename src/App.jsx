import { createSignal, createResource, For, Show } from 'solid-js';

// API 호출 함수 (카테고리 구분 없이 'all' 요청)
const fetchNews = async () => {
  try {
    const response = await fetch('https://musclecat.co.kr/getEinkNews', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      // 탭이 없으므로 한 번에 더 많은 기사(30개)를 가져오도록 설정했습니다.
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

function App() {
  // 새로고침 트리거용 시그널 (숫자가 바뀌면 재요청)
  const [refetchIndex, setRefetchIndex] = createSignal(0);
  
  // createResource: refetchIndex가 변할 때마다 fetchNews 실행
  const [newsData] = createResource(refetchIndex, fetchNews);

  const handleRefresh = () => {
    setRefetchIndex((prev) => prev + 1);
  };

  return (
    <div style={styles.container}>
      {/* 헤더 영역 */}
      <header style={styles.header}>
        <h1 style={styles.title}>E-ink News</h1>
        <button style={styles.refreshBtn} onClick={handleRefresh}>
          {newsData.loading ? '로딩중...' : '새로고침'}
        </button>
      </header>

      {/* 컨텐츠 영역 (탭 없이 바로 리스트 출력) */}
      <main style={styles.content}>
        <Show when={!newsData.loading} fallback={<div style={styles.statusMsg}>최신 뉴스를 가져오는 중...</div>}>
          <Show when={!newsData.error} fallback={<div style={styles.statusMsg}>불러오기 실패. 인터넷 연결을 확인하세요.</div>}>
            <Show when={newsData() && newsData().length > 0} fallback={<div style={styles.statusMsg}>등록된 뉴스가 없습니다.</div>}>
              
              <div style={styles.list}>
                <For each={newsData()}>
                  {(item) => (
                    <article style={styles.card}>
                      {/* 상단 메타 정보: [분야/언론사] 시간 */}
                      <div style={styles.meta}>
                        <span style={styles.source}>
                           [{getCategoryName(item.category)} / {item.source}]
                        </span>
                        <span style={styles.time}>{item.time}</span>
                      </div>

                      {/* 제목 */}
                      <h2 style={styles.newsTitle}>
                        <a href={item.link} target="_blank" rel="noreferrer" style={styles.link}>
                          {item.title}
                        </a>
                      </h2>

                      {/* 3줄 요약 박스 */}
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
      
      {/* 바닥글 (옵션) */}
      <footer style={styles.footer}>
        End of List
      </footer>
    </div>
  );
}

// 헬퍼: 영문 카테고리를 한글로 변환
function getCategoryName(cat) {
  const map = {
    'economy': '경제',
    'society': '사회',
    'tech': '테크',
    'accident': '사건'
  };
  return map[cat] || cat;
}

// 스타일 정의 (탭 관련 스타일 삭제)
const styles = {
  container: {
    "max-width": "600px",
    margin: "0 auto",
    padding: "0",
    "background-color": "#ffffff",
    "min-height": "100vh",
    "font-family": "'Noto Sans KR', sans-serif",
    color: "#000000",
  },
  header: {
    display: "flex",
    "justify-content": "space-between",
    "align-items": "center",
    padding: "1rem 1.2rem",
    "border-bottom": "3px solid #000000", // 헤더 강조
  },
  title: {
    margin: 0,
    "font-size": "1.8rem",
    "font-weight": "900",
    "letter-spacing": "-1px",
  },
  refreshBtn: {
    padding: "0.5rem 1rem",
    "font-size": "0.9rem",
    border: "2px solid #000000",
    background: "#ffffff",
    cursor: "pointer",
    "font-weight": "bold",
    color: "#000000",
  },
  content: {
    padding: "0",
  },
  statusMsg: {
    padding: "3rem",
    "text-align": "center",
    "font-size": "1.2rem",
    "font-weight": "bold",
  },
  list: {
    display: "flex",
    "flex-direction": "column",
  },
  card: {
    padding: "1.5rem 1.2rem", // 터치 영역 고려하여 패딩 조금 더 줌
    "border-bottom": "1px solid #000000",
  },
  meta: {
    display: "flex",
    "justify-content": "space-between",
    "margin-bottom": "0.6rem",
    "font-size": "0.85rem",
    "font-weight": "700", // 굵게
  },
  source: {
    // text-decoration 제거하고 깔끔하게
  },
  time: {
    "font-family": "monospace", // 숫자는 고정폭 폰트가 깔끔함
    "font-size": "0.9rem",
  },
  newsTitle: {
    margin: "0 0 1rem 0",
    "font-size": "1.4rem",
    "line-height": "1.3",
    "word-break": "keep-all",
    "font-weight": "800",
  },
  link: {
    color: "#000000",
    "text-decoration": "none",
  },
  summaryBox: {
    padding: "0.8rem",
    border: "2px solid #000000", 
    "background-color": "#ffffff",
  },
  summaryText: {
    margin: 0,
    "font-size": "1.05rem", // 가독성 위해 폰트 조금 키움
    "line-height": "1.6",
    "white-space": "pre-wrap",
  },
  footer: {
    padding: "2rem",
    "text-align": "center",
    "font-size": "0.8rem",
    "border-top": "3px solid black",
    "margin-top": "auto",
    "font-weight": "bold"
  }
};

export default App;