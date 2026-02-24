import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { UserRole } from '../store/authStore';
import { getLogoPath } from '../utils/assets';
import styles from '../styles/Homepage.module.css';

const Homepage: React.FC = () => {
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [selectedRole, setSelectedRole] = useState<UserRole | null>(null);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const navigate = useNavigate();

  const handleCTAClick = () => {
    navigate('/login');
  };

  return (
    <>
      <nav>
        <div className={styles.navContainer}>
          <div className={styles.logo}>
            <img src={getLogoPath()} alt="Soldier Holdings Logo" className={styles.logoIcon} />
            <span className={styles.logoText}>SOLDIER HOLDINGS</span>
          </div>
          <div className={styles.navButtons}>
            <a href="#about" className={styles.navLink}>About</a>
            <a href="#pillars" className={styles.navLink}>Core Pillars</a>
            <a href="#technical" className={styles.navLink}>Technical</a>
            <button className={styles.btnLogin} onClick={handleCTAClick}>
              <i className="fas fa-sign-in-alt"></i> Access Platform
            </button>
          </div>
        </div>
      </nav>

      <button className={styles.floatingMenuBtn} onClick={() => setMobileMenuOpen(true)}>
        <i className="fas fa-bars"></i>
      </button>

      <section className={styles.hero}>
        <div className={styles.heroContent}>
          <div className={styles.badge}>
            <i className="fas fa-shield-alt"></i>
            <span>The Sovereign Standard</span>
          </div>

          <h1>
            The Future of Political Integrity, <span className={styles.gradientText}>Coded in Trust</span>
          </h1>

          <p className={styles.subtitle}>
            Soldier Holdings is the first Dual-Rail Compliance Ecosystem designed to govern the future of political finance in the Global South. We bridge the gap between traditional banking and the decentralised frontier, ensuring every Rand and every Digital Asset is legally bound, forensically verified, and fully compliant with the South African Political Funding Act.
          </p>

          <div className={styles.ctaGroup}>
            <button className={`${styles.btn} ${styles.btnPrimary}`} onClick={handleCTAClick}>
              <i className="fas fa-user-shield"></i>
              <span>Regulator Command Centre</span>
            </button>
            <button className={`${styles.btn} ${styles.btnSecondary}`} onClick={handleCTAClick}>
              <i className="fas fa-lock"></i>
              <span>Secure Your Party's Digital Ingress</span>
            </button>
            <button className={`${styles.btn} ${styles.btnTertiary}`} onClick={handleCTAClick}>
              <i className="fas fa-chart-line"></i>
              <span>Explore the Public Transparency Ledger</span>
            </button>
          </div>

          <div className={styles.stats}>
            <div className={styles.stat}>
              <span className={styles.statValue}>R45,000,000</span>
              <span className={styles.statLabel}>Total Fiat Complied</span>
            </div>
            <div className={styles.statDivider}></div>
            <div className={styles.stat}>
              <span className={styles.statValue}>12.4 BTC</span>
              <span className={styles.statLabel}>Total Crypto Verified</span>
            </div>
            <div className={styles.statDivider}></div>
            <div className={styles.stat}>
              <span className={styles.statValue}>14</span>
              <span className={styles.statLabel}>Security Threats Neutralised</span>
            </div>
          </div>
        </div>

        <div className={styles.orbitalContainer}>
          <div className={styles.orbitalSystem}>
            <div className={styles.coreNode}>
              <i className="fas fa-shield-alt"></i>
            </div>
            <div className={`${styles.orbit} ${styles.orbit1}`}>
              <div className={styles.orbitNode}>
                <i className="fas fa-university"></i>
              </div>
            </div>
            <div className={`${styles.orbit} ${styles.orbit2}`}>
              <div className={styles.orbitNode}>
                <i className="fab fa-bitcoin"></i>
              </div>
            </div>
            <div className={`${styles.orbit} ${styles.orbit3}`}>
              <div className={styles.orbitNode}>
                <i className="fas fa-fingerprint"></i>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section id="about">
        <div className={styles.container}>
          <div className={styles.sectionHeader}>
            <h2>Why Soldier Holdings?</h2>
            <p className={styles.sectionIntro}>
              In an era where the digital economy moves faster than legislative oversight, the integrity of democracy depends on technological sovereignty. Traditional auditing is reactive—identifying breaches only after the damage is done.
            </p>
          </div>
        </div>
      </section>

      <section id="pillars">
        <div className={styles.container}>
          <div className={styles.sectionHeader}>
            <h2>Our Core Value Pillars</h2>
            <p className={styles.sectionIntro}>
              Four fundamental technologies that make Soldier Holdings the fortress of democratic finance
            </p>
          </div>

          <div className={styles.cardGrid}>
            <div className={styles.card}>
              <div className={styles.cardIcon}>
                <i className="fas fa-exchange-alt"></i>
              </div>
              <h3>The Dual-Rail Ingress: Total Oversight</h3>
              <p>
                Whether it's a traditional bank transfer or a digital asset donation, our Hybrid Transaction Gateway serves as a unified digital border post. By managing both the Fiat Rail (ZAR) and the Digital Asset Rail (Crypto/Stablecoins) simultaneously, we eliminate the "regulatory blind spots" that have historically allowed illicit influence to enter the democratic process.
              </p>
            </div>

            <div className={styles.card}>
              <div className={styles.cardIcon}>
                <i className="fas fa-fingerprint"></i>
              </div>
              <h3>The Golden Thread: Identity-to-Wallet Binding</h3>
              <p>
                We solve the "Anonymity Gap" of the blockchain. Through our Self-Sovereign Identity (SSI) framework, every digital wallet is cryptographically anchored to a verified South African identity. We utilize Zero-Knowledge Proofs (ZKPs) to ensure that while the state gets its "Green Light" for compliance, the private data of citizens remains protected under POPIA standards.
              </p>
            </div>

            <div className={styles.card}>
              <div className={styles.cardIcon}>
                <i className="fas fa-shield-alt"></i>
              </div>
              <h3>Forensic Guard Dogs: KYT & AML</h3>
              <p>
                Our system doesn't just ask who sent the money; it asks where the money has been. Every donation undergoes a Know Your Transaction (KYT) forensic scan. Using heuristic analysis, we trace the "hop history" of digital assets. If a donation has touched a sanctioned node or a foreign "mixer," our Smart Contract Escrow freezes the transaction instantly and alerts State Security.
              </p>
            </div>

            <div className={styles.card}>
              <div className={styles.cardIcon}>
                <i className="fas fa-book-open"></i>
              </div>
              <h3>Programmatic Accountability: The Glass Ledger</h3>
              <p>
                Transparency isn't just a promise; it's an immutable record. Our Immutable Audit Trail hashes every compliance decision onto a private blockchain, creating a permanent, tamper-proof history of funding. Regulators gain a high-fidelity command centre for deep-dive audits, while the public gains a "Glass Ledger" to verify the fairness of the democratic process.
              </p>
            </div>
          </div>
        </div>
      </section>

      <section id="strategic">
        <div className={styles.container}>
          <div className={styles.sectionHeader}>
            <h2>Strategic Value to South Africa</h2>
            <p className={styles.sectionIntro}>
              Soldier Holdings isn't just a software application; it is <strong>Critical National Infrastructure.</strong>
            </p>
          </div>

          <div className={styles.cardGrid}>
            <div className={styles.card}>
              <div className={styles.cardIcon}>
                <i className="fas fa-flag"></i>
              </div>
              <h3>National Security</h3>
              <p>We close the "backdoor" for foreign state-sponsored influence.</p>
            </div>

            <div className={styles.card}>
              <div className={styles.cardIcon}>
                <i className="fas fa-balance-scale"></i>
              </div>
              <h3>Economic Integrity</h3>
              <p>We help South Africa exit the FATF Grey list by implementing world-class AML/CFT standards for political assets.</p>
            </div>

            <div className={styles.card}>
              <div className={styles.cardIcon}>
                <i className="fas fa-users"></i>
              </div>
              <h3>Democratic Equality</h3>
              <p>We ensure that the statutory R15M donation cap is enforced across all financial rails in real-time, preventing the distortion of our political landscape.</p>
            </div>
          </div>
        </div>
      </section>

      <section className={styles.finalSection}>
        <div className={styles.container}>
          <h2 className={styles.finalH2}>
            At Soldier Holdings, we believe that <span className={styles.gradientText}>transparency is the best defence.</span> Through Soldier Holdings, we aren't just protecting a party's bank account—we are <span className={styles.gradientText}>protecting the sanctity of the South African vote.</span>
          </h2>
          <div className={styles.finalCtaGroup}>
            <button className={`${styles.btn} ${styles.btnPrimary}`} onClick={handleCTAClick}>
              <i className="fas fa-rocket"></i>
              <span>Request Technical Briefing</span>
            </button>
            <a href="mailto:contact@soldierholdings.co.za" className={`${styles.btn} ${styles.btnSecondary}`}>
              <i className="fas fa-phone"></i>
              <span>Contact TACTPAM</span>
            </a>
          </div>
        </div>
      </section>

      <footer>
        <div className={styles.container}>
          <p>&copy; 2026 Soldier Holdings | TACTPAM (Pty) Ltd | Political Funding Compliance Platform</p>
          <p className={styles.footerP}>
            <strong>The Sovereign Standard</strong> - Protecting the Currency of Democracy
          </p>
        </div>
      </footer>

      {mobileMenuOpen && (
        <div className={styles.mobileSidebarOverlay} onClick={() => setMobileMenuOpen(false)}>
          <div className={styles.mobileSidebar} onClick={(e) => e.stopPropagation()}>
            <button className={styles.mobileSidebarClose} 
            onClick={() => setMobileMenuOpen(false)}
            >
              <i className="fas fa-times"></i>
            </button>
            <div className={styles.mobileSidebarContent}>
              <a href="#about" className={styles.mobileNavLink} onClick={() => setMobileMenuOpen(false)}>About</a>
              <a href="#pillars" className={styles.mobileNavLink} onClick={() => setMobileMenuOpen(false)}>Core Pillars</a>
              <a href="#technical" className={styles.mobileNavLink} onClick={() => setMobileMenuOpen(false)}>Technical</a>
              <button className={`${styles.btn} ${styles.btnPrimary} ${styles.mobileLoginBtn}`} onClick={() => { setMobileMenuOpen(false); handleCTAClick(); }}>
                <i className="fas fa-sign-in-alt"></i>
                <span>Access Platform</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default Homepage;
