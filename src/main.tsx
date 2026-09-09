import {StrictMode} from 'react';
import {createRoot} from 'react-dom/client';
import App from './App.tsx';
import './index.css';

// Global tap-ripple positioning: any element with class "tap-ripple" gets
// its ripple origin pinned to the exact tap/click point via CSS vars.
if (typeof window !== 'undefined') {
  const setRippleOrigin = (e: PointerEvent | MouseEvent) => {
    const target = (e.target as HTMLElement)?.closest?.('.tap-ripple') as HTMLElement | null;
    if (!target) return;
    const rect = target.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width) * 100;
    const y = ((e.clientY - rect.top) / rect.height) * 100;
    target.style.setProperty('--tap-x', `${x}%`);
    target.style.setProperty('--tap-y', `${y}%`);
  };
  window.addEventListener('pointerdown', setRippleOrigin, { passive: true });
}

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
);
