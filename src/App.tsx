import { useState, useRef, useEffect } from 'react';
import { ArrowDown, Activity, FileText, CheckCircle, Copy, Code2, HeartPulse, Database, RefreshCw, BarChart, Network, Layers } from 'lucide-react';

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
      <div className="bg-animations">
        <div className="ambient-blob blob-1"></div>
        <div className="ambient-blob blob-2"></div>
        <div className="ambient-blob blob-3"></div>
      </div>

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

      {/* Architecture Documentation Section */}
      <section className="architecture-section">
        <div className="container">
          <div className="tool-header">
            <h2>Sistem Mimarisi ve Teknoloji</h2>
            <p>Sadeleştirme sadece kelime değiştirmek değil, bilgi hiyerarşisini ve tıbbi özgünlüğü korumaktır.</p>
          </div>

          <div className="arch-content">
            {/* 1. Overview */}
            <div className="arch-card highlight-card">
              <div className="arch-card-header">
                <Network className="arch-icon blue" size={28} />
                <h3>Sistem Mimarisi (Agentic RAG + Reflexion)</h3>
              </div>
              <p>Geleneksel doğrusal veri işleme hatları yerine, bu sistemde <strong>iteratif bir ajan döngüsü</strong> kullanılmaktadır. Tüm bileşenler bağımsız çalışır ancak sürekli bir geri bildirim döngüsü ile birbirine bağlıdır. Temel hedeflerimizden biri; doktorun teknik hassasiyetine (ICD-10 kodları) sadık kalarak, hastanın anlama ihtiyacı arasındaki <strong>semantik köprüyü</strong> güvenli bir şekilde kurmaktır.</p>
            </div>

            {/* Architecture Diagram */}
            <div className="arch-diagram-container">
              <div className="diagram-node db-node">
                <Database size={24} />
                <span>FAISS Vektör DB</span>
                <small>(Cochrane Plains)</small>
              </div>
              
              <div className="diagram-arrow vertical db-arrow"></div>

              <div className="diagram-row">
                <div className="diagram-node extract">
                  <FileText size={24} />
                  <span>Extraction Agent</span>
                  <small>ICD-10 ve terimleri ayıklar</small>
                </div>
                
                <div className="diagram-arrow right"></div>
                
                <div className="diagram-node generate">
                  <Layers size={24} />
                  <span>Generation Agent</span>
                  <small>5 farklı taslak metin üretir</small>
                </div>
                
                <div className="diagram-arrow right"></div>
                
                <div className="diagram-node evaluate">
                  <Activity size={24} />
                  <span>Evaluation Agent</span>
                  <small>Okunabilirlik ve doğruluğu ölçer</small>
                </div>
              </div>

              {/* Reflexion Loop */}
              <div className="reflexion-loop">
                <div className="loop-label">
                  <RefreshCw size={16} />
                  <span>Reflexion Loop (Skor &lt; 0.70) - Eksik Kodları ve Hataları Düzeltir</span>
                </div>
              </div>
            </div>

            {/* Grid for details */}
            <div className="arch-grid">
              {/* 2. Data Layer */}
              <div className="arch-card">
                <div className="arch-card-header">
                  <Database className="arch-icon green" size={24} />
                  <h3>Veri Katmanı ve Dinamik RAG (FAISS)</h3>
                </div>
                <p>Sistemin bilgi temeli, tıbbi sadeleştirmede altın standart kabul edilen <strong>Cochrane Plain Language Summaries</strong> veri setine dayanır. Veriler <strong>FAISS</strong> indeksi üzerinden RAG mimarisine bağlanarak modele dinamik "few-shot" örnekleri sağlar ve tıbbi bağlamın korunmasına yardımcı olur.</p>
              </div>

              {/* 3. Pipeline Flow */}
              <div className="arch-card">
                <div className="arch-card-header">
                  <Layers className="arch-icon purple" size={24} />
                  <h3>İşlem Hattı ve Ajan Yapısı</h3>
                </div>
                <ul className="arch-list">
                  <li><strong>Extraction Agent:</strong> Ham metinden ICD-10 kodlarını ve kritik teknik terimleri zorunlu korunacaklar olarak ayıklar.</li>
                  <li><strong>Generation Agent:</strong> Ayıklanan verilere ve RAG'dan gelen örneklere dayanarak 5 farklı taslak metin üretir.</li>
                  <li><strong>Evaluation Agent:</strong> Üretilen taslakları okunabilirlik (Ateşman) ve içerik bağlamında değerlendirir.</li>
                </ul>
              </div>

              {/* 4. Reflexion Loop */}
              <div className="arch-card">
                <div className="arch-card-header">
                  <RefreshCw className="arch-icon orange" size={24} />
                  <h3>Öz-Düzenleme Döngüsü (Reflexion)</h3>
                </div>
                <p>Projeyi ayırt edici kılan ana mekanizmadır. Eğer değerlendirme skoru Ateşman eşik değerinin (<strong>0.70</strong>) altındaysa, sistem sözel geri bildirim üreterek metni yeniden iyileştirir. Ayrıca ilk üretimde kaybolabilen ICD kodları, bu döngü sayesinde "zorunlu kod yerleştirme" yönergesiyle metne hata yapmadan geri kazandırılır.</p>
              </div>

              {/* 5. Metrics */}
              <div className="arch-card">
                <div className="arch-card-header">
                  <BarChart className="arch-icon blue" size={24} />
                  <h3>Başarı ve Performans Metrikleri</h3>
                </div>
                <p>Başarımız sadece "sadeleştirme" ile sınırlı değil, <strong>doğruluk odaklıdır</strong>. Ölçüm metriklerimiz:</p>
                <div className="metrics-tags">
                  <span className="metric-tag">Ateşman (Hedef &gt; 70)</span>
                  <span className="metric-tag">ICD-10 Doğruluğu</span>
                  <span className="metric-tag">BERTScore</span>
                  <span className="metric-tag">SARI</span>
                </div>
                <p className="metric-result">
                  Saf LLM (Baseline) kullanımı ile başarı puanı <strong>0.17</strong> iken, Agentic RAG + Reflexion mimarisi sayesinde bu skor <strong>0.79</strong>'a çıkmış ve tıbbi doğruluk <strong>~%300</strong> oranında artmıştır.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="footer">
        <div className="footer-content">
          <div className="footer-logo">
            <HeartPulse size={28} color="#2563eb" />
            Klinik<span>Sade</span>
          </div>

          <div>
            <p style={{ marginBottom: '0.5rem' }}>Bu araç karmaşık tıbbi metinleri basitleştirmek amacıyla geliştirilmiştir.</p>
          </div>

          <div className="footer-dev-badge">
            <Code2 size={18} color="#93c5fd" />
            Geliştiriciler: <span>...</span>
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