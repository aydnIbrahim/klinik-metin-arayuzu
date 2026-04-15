import { Database, Network, FileText, Layers, Activity, RefreshCw, BarChart } from 'lucide-react';
import './Architecture.css';

const Architecture = () => {
  return (
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
  );
};

export default Architecture;
