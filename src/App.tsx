import { useRef, useState } from 'react';
import Background from './components/Background/Background';
import Hero from './components/Hero/Hero';
import Features from './components/Features/Features';
import SimplifierTool from './components/SimplifierTool/SimplifierTool';
import Architecture from './components/Architecture/Architecture';
import Footer from './components/Footer/Footer';
import Toast from './components/ui/Toast/Toast';

function App() {
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' } | null>(null);
  const toolSectionRef = useRef<HTMLDivElement>(null);

  const showToast = (message: string, type: 'success' | 'error' = 'success') => {
    setToast({ message, type });
    setTimeout(() => {
      setToast(null);
    }, 3000);
  };

  const scrollToTool = () => {
    toolSectionRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <>
      <Background />
      <Hero onScrollToTool={scrollToTool} />
      <Features />
      <SimplifierTool onShowToast={showToast} ref={toolSectionRef} />
      <Architecture />
      <Footer />
      <Toast toast={toast} />
    </>
  );
}

export default App;