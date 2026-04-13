import { useState, useRef, useEffect } from 'react';
import { ArrowDown, Activity, FileText, CheckCircle, Copy, Code2, HeartPulse } from 'lucide-react';

function App() {
  const [inputText, setInputText] = useState('');
  
  // Output state management
  const [outputText, setOutputText] = useState('');
  const [displayedText, setDisplayedText] = useState('');
  
  const [isLoading, setIsLoading] = useState(false);
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' } | null>(null);
  
  const toolSectionRef = useRef<HTMLDivElement>(null);
  
  // Custom API URL defined in .env or fallback config
  const API_URL = import.meta.env.VITE_API_URL as string | undefined;

  // Typewriter effect
  useEffect(() => {
    if (!outputText) {
      setDisplayedText('');
      return;
    }
    
    let currentIndex = 0;
    const intervalId = setInterval(() => {
      setDisplayedText(outputText.slice(0, currentIndex + 1));
      currentIndex++;
      if (currentIndex === outputText.length) {
        clearInterval(intervalId);
      }
    }, 15); // Hız ayarı (ms): Daha küçük değer daha hızlı yazar
    
    return () => clearInterval(intervalId);
  }, [outputText]);

  const showToast = (message: string, type: 'success' | 'error' = 'success') => {
    setToast({ message, type });
    setTimeout(() => {
      setToast(null);
    }, 3000);
  };

  const scrollToTool = () => {
    toolSectionRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const handleSimplify = async () => {
    if (!inputText.trim()) return;
    
    setIsLoading(true);
    setOutputText(''); // Clear previous
    setDisplayedText('');
    
    try {
      if (API_URL) {
        // GERÇEK API ÇAĞRISI
        const response = await fetch(API_URL, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          // Backend API'nizin beklediği veri formatına göre buraları değiştirebilirsiniz
          body: JSON.stringify({ text: inputText }),
        });

        if (!response.ok) {
          throw new Error('API isteği başarısız oldu.');
        }

        const data = await response.json();
        // Backend API'nizin döndürdüğü yapıya göre buraları değiştirebilirsiniz
        // Örn: data.simplifiedText veya data.result
        const resultText = data.simplified || data.result || data.text || "Sunucudan dönen metin burada.";
        setOutputText(resultText);
      } else {
        // YEDEK/MOCK ÇAĞRI (API_URL tanımlı değilse)
        console.warn('VITE_API_URL tanımlanmadı. Mock veri kullanılıyor.');
        await new Promise(resolve => setTimeout(resolve, 1500));
        setOutputText("Bu alan, arka planda API'nizden gelen basitleştirilmiş klinik metni gösterir.\n\nSimüle edilen örnek dönüştürme:\n'Miyokard enfarktüsü' -> 'Kalp krizi'\n'Hipertansiyon' -> 'Yüksek tansiyon'\n\nGerçek API'nizi bağlamak için '.env' dosyası oluşturup VITE_API_URL değişkenini ayarlayınız.");
      }
    } catch (error: any) {
      console.error("API Hatası:", error);
      showToast(error.message || 'Sunucuya bağlanırken bir hata oluştu.', 'error');
      setOutputText('İşlem sırasında bir hata oluştu. Lütfen bağlantınızı ve API ayarlarınızı kontrol edin.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleCopy = () => {
    if (displayedText) {
      navigator.clipboard.writeText(displayedText);
      showToast('Metin kopyalandı!');
    }
  };

  return (
    <>
      {/* Hero Section */}
      <header className="hero-section">
        <div className="hero-pattern"></div>
        <div className="hero-content">
          <div className="hero-icon-wrapper">
            <HeartPulse size={48} color="#93c5fd" />
          </div>
          <h1 className="hero-title">
            Klinik Metinleri <span>Herkes İçin</span> Anlaşılır Kılın
          </h1>
          <p className="hero-subtitle">
            Sağlık profesyonellerinin hazırladığı karmaşık tıbbi raporları ve epikrizleri, hastaların kolayca anlayabileceği sade ve net bir dile saniyeler içinde çevirin.
          </p>
          <button onClick={scrollToTool} className="btn-primary">
            Aracı Kullanmaya Başla
            <ArrowDown className="icon" size={24} />
          </button>
        </div>
      </header>

      {/* Features Section */}
      <section className="features-section">
        <div className="features-grid">
          <div className="feature-card">
            <div className="feature-icon blue">
              <FileText size={32} />
            </div>
            <h3 className="feature-title">1. Metni Girin</h3>
            <p className="feature-desc">Basitleştirmek istediğiniz tıbbi terimleri içeren orijinal klinik raporu sisteme yapıştırın.</p>
          </div>
          <div className="feature-card">
            <div className="feature-icon">
              <Activity size={32} />
            </div>
            <h3 className="feature-title">2. Yapay Zeka İşlesin</h3>
            <p className="feature-desc">Gelişmiş API altyapımız, tıbbi bağlamı kaybetmeden metni saniyeler içinde analiz eder.</p>
          </div>
          <div className="feature-card">
            <div className="feature-icon green">
              <CheckCircle size={32} />
            </div>
            <h3 className="feature-title">3. Sonucu Alın</h3>
            <p className="feature-desc">Hastalarınızla güvenle paylaşabileceğiniz, anlaşılır ve net sonuca anında ulaşın.</p>
          </div>
        </div>
      </section>

      {/* Main Tool Section */}
      <main ref={toolSectionRef} className="tool-section">
        <div className="container">
          <div className="tool-header">
            <h2>Metin Basitleştirici</h2>
            <p>İşlemi başlatmak için karmaşık tıbbi metni aşağıya yapıştırın.</p>
          </div>

          <div className="panels-container">
            {/* Input Panel */}
            <div className="panel">
              <div className="panel-header">
                <span className="panel-title blue-icon">
                  <FileText size={20} />
                  Orijinal Klinik Metin
                </span>
              </div>
              <textarea
                className="panel-textarea"
                placeholder="Örn: Hasta acil servise retrosternal göğüs ağrısı şikayeti ile başvurdu. EKG'sinde akut anterior miyokard enfarktüsü bulguları izlendi..."
                value={inputText}
                onChange={(e) => setInputText(e.target.value)}
              />
            </div>

            {/* Output Panel */}
            <div className="panel relative">
              <div className="panel-header">
                <span className="panel-title green-icon">
                  <CheckCircle size={20} />
                  Basitleştirilmiş Sonuç
                </span>
                {displayedText && (
                  <button onClick={handleCopy} className="copy-btn" title="Metni Kopyala">
                    <Copy size={16} /> Kopyala
                  </button>
                )}
              </div>
              
              <div className="relative flex-grow">
                <textarea
                  readOnly
                  className="panel-textarea output"
                  value={displayedText}
                  placeholder=""
                />
                
                {/* Typewriter Cursor (only when writing) */}
                {displayedText && displayedText.length < outputText.length && (
                  <span className="typewriter-cursor"></span>
                )}
                
                {/* Visual indicator / Shimmer */}
                {isLoading && (
                  <div className="skeleton-loader"></div>
                )}
                
                {/* Watermark when empty */}
                {!displayedText && !isLoading && (
                  <div className="watermark">
                    <span>Sonuç Bekleniyor...</span>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Action Area */}
          <div className="action-wrapper">
            <button
              onClick={handleSimplify}
              disabled={isLoading || !inputText.trim()}
              className="btn-action"
            >
              {isLoading ? (
                <>
                  <Activity className="animate-spin" size={24} />
                  Yapay Zeka İşliyor...
                </>
              ) : (
                'Metni Basitleştir'
              )}
            </button>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="footer">
        <div className="footer-content">
          <div className="footer-logo">
            <HeartPulse size={28} color="#2563eb" />
            Klinik<span>Sade</span>
          </div>
          
          <div>
            <p style={{ marginBottom: '0.5rem' }}>Bu araç karmaşık tıbbi metinleri basitleştirmek amacıyla profesyoneller için geliştirilmiştir.</p>
            <p>© {new Date().getFullYear()} Tüm hakları saklıdır.</p>
          </div>

          <div className="footer-dev-badge">
            <Code2 size={18} color="#93c5fd" />
            Geliştirici: <span>İbrahim Aydın</span>
          </div>
        </div>
      </footer>

      {/* Toast Notification */}
      <div className={`toast ${toast ? 'show' : ''} ${toast?.type === 'error' ? 'toast-error' : ''}`}>
        {toast?.type === 'success' ? <CheckCircle size={20} /> : <Activity size={20} />}
        {toast?.message}
      </div>
    </>
  );
}

export default App;