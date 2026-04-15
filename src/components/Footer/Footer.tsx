import { HeartPulse, Code2 } from 'lucide-react';
import './Footer.css';

const Footer = () => {
  return (
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
  );
};

export default Footer;
