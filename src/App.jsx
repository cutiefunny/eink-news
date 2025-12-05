import { createSignal } from 'solid-js';

// E-ink용 스타일: 고대비, 애니메이션 제거
const styles = {
  container: {
    display: 'flex',
    "flex-direction": 'column',
    "align-items": 'center',
    "justify-content": 'center',
    height: '100vh',
    background: '#ffffff',
    color: '#000000',
    "font-family": 'sans-serif',
  },
  button: {
    padding: '1rem 2rem',
    "font-size": '1.5rem',
    border: '2px solid black',
    background: 'white',
    color: 'black',
    "font-weight": 'bold',
    "margin-top": '1rem',
    cursor: 'pointer',
    // E-ink 핵심: 그림자나 복잡한 효과 제거
    "box-shadow": 'none', 
    "border-radius": '0px'
  },
  text: {
    "font-size": '2rem',
    "font-weight": 'bold'
  }
};

function App() {
  // Solid의 Signal은 값이 바뀔 때 컴포넌트를 다시 그리는 게 아니라
  // 이 값을 사용하는 DOM 위치(텍스트)만 정확히 업데이트합니다.
  const [count, setCount] = createSignal(0);

  return (
    <div style={styles.container}>
      <h1 style={styles.text}>E-ink Optimized</h1>
      <div style={styles.text}>Count: {count()}</div>
      
      <button 
        style={styles.button}
        onClick={() => setCount((c) => c + 1)}
      >
        Click Me (Instant)
      </button>
      
      <p>
        Edit <code>src/App.jsx</code> and save to test HMR
      </p>
    </div>
  );
}

export default App;