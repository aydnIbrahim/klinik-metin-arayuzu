import { useState, useEffect, forwardRef } from 'react';
import { FileText, CheckCircle, Copy, Activity } from 'lucide-react';
import './SimplifierTool.css';

interface SimplifierToolProps {
  onShowToast: (message: string, type?: 'success' | 'error') => void;
}

const SimplifierTool = forwardRef<HTMLDivElement, SimplifierToolProps>(({ onShowToast }, ref) => {
  const [inputText, setInputText] = useState('');
  const [outputText, setOutputText] = useState('');
  const [displayedText, setDisplayedText] = useState('');
  const [isLoading, setIsLoading] = useState(false);

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
    }, 15);

    return () => clearInterval(intervalId);
  }, [outputText]);

  const handleSimplify = async () => {
    if (!inputText.trim()) return;

    setIsLoading(true);
    setOutputText('');
    setDisplayedText('');

    try {
      if (API_URL) {
        const response = await fetch(API_URL, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ text: inputText }),
        });

        if (!response.ok) throw new Error('API isteği başarısız oldu.');

        const data = await response.json();
        const resultText = data.simplified || data.result || data.text || "Sunucudan dönen metin burada.";
        setOutputText(resultText);
      } else {
        console.warn('VITE_API_URL tanımlanmadı. Mock veri kullanılıyor.');
        await new Promise(resolve => setTimeout(resolve, 1500));
        setOutputText("Bu alan, arka planda API'nizden gelen basitleştirilmiş klinik metni gösterir.\n\nSimüle edilen örnek dönüştürme:\n'Miyokard enfarktüsü' -> 'Kalp krizi'\n'Hipertansiyon' -> 'Yüksek tansiyon'\n\nGerçek API'nizi bağlamak için '.env' dosyası oluşturup VITE_API_URL değişkenini ayarlayınız.");
      }
    } catch (error: any) {
      console.error("API Hatası:", error);
      onShowToast(error.message || 'Sunucuya bağlanırken bir hata oluştu.', 'error');
      setOutputText('İşlem sırasında bir hata oluştu. Lütfen bağlantınızı ve API ayarlarınızı kontrol edin.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleCopy = () => {
    if (displayedText) {
      navigator.clipboard.writeText(displayedText);
      onShowToast('Metin kopyalandı!', 'success');
    }
  };

  return (
    <main ref={ref} id="tool" className="tool-section">
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

              {displayedText && displayedText.length < outputText.length && (
                <span className="typewriter-cursor"></span>
              )}

              {isLoading && (
                <div className="skeleton-loader"></div>
              )}

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
  );
});

export default SimplifierTool;
