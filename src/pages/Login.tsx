import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { UserRole, useAuthStore } from '../store/authStore';
import styles from '../styles/Login.module.css';

const Login: React.FC = () => {
  const navigate = useNavigate();
  const { login } = useAuthStore();

  const handleRoleSelect = (role: UserRole) => {
    login(role, 'Demo User');
    navigate('/dashboard');
  };

  return (
    <>
      <div className={styles.loginContainer}>
        <div className={styles.loginHeader}>
          <div className={styles.logo}>
            <img src="/images/logo.png" alt="Soldier Holdings Logo" />
            <h1>SOLDIER HOLDINGS</h1>
          </div>
          <p className={styles.subtitle}>Political Funding Compliance Platform</p>
        </div>

        <Link to="/" className={styles.backLink}>
          <i className="fas fa-arrow-left"></i>
          <span>Back to Homepage</span>
        </Link>

        <h2>Select Your Account Type</h2>

        <div className={styles.roleSelector}>
          <div className={styles.roleCard} onClick={() => handleRoleSelect('political')}>
            <div className={styles.roleIcon}>
              <i className="fas fa-users"></i>
            </div>
            <div className={styles.roleContent}>
              <h3>Political Party</h3>
              <div className={styles.roleSubtitle}>The Treasurer's View</div>
              <p>Campaign Finance Officers: Efficiency and "Nights-Back" ease of use</p>
            </div>
            <i className={styles.roleArrow}></i>
          </div>

          <div className={`${styles.roleCard} ${styles.success}`} onClick={() => handleRoleSelect('regulator')}>
            <div className={styles.roleIcon}>
              <i className="fas fa-shield-alt"></i>
            </div>
            <div className={styles.roleContent}>
              <h3>Regulatory Body</h3>
              <div className={styles.roleSubtitle}>Regulator Command Centre</div>
              <p>IEC / SSA: Compliance Auditors and State Security Analysts</p>
            </div>
            <i className={styles.roleArrow}></i>
          </div>

          <div className={`${styles.roleCard} ${styles.warning}`} onClick={() => handleRoleSelect('financial')}>
            <div className={styles.roleIcon}>
              <i className="fas fa-university"></i>
            </div>
            <div className={styles.roleContent}>
              <h3>Financial Institution</h3>
              <div className={styles.roleSubtitle}>Financial Gateway</div>
              <p>Banks and payment processors: Dual-Rail transaction management</p>
            </div>
            <i className={styles.roleArrow}></i>
          </div>
        </div>

        <div className={styles.loginFooter}>
          <p>
            <i className="fas fa-lock"></i> Secure Authentication • AES-256 Encrypted
          </p>
          <p>
            <strong>Demo Credentials:</strong> Click any role above to access the demo dashboard
          </p>
        </div>
      </div>
    </>
  );
};

export default Login;
