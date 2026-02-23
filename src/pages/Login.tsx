import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuthStore } from '../store/authStore';
import styles from '../styles/Login.module.css';

const Login: React.FC = () => {
  const navigate = useNavigate();
  const { login } = useAuthStore();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    const success = login(email, password);
    if (success) {
      navigate('/dashboard');
    } else {
      setError('Invalid email or password. Please check the demo credentials.');
    }
  };

  return (
    <>
      <div className={styles.loginPage}>
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

        <h2>Login to Your Account</h2>

        <form onSubmit={handleSubmit} className={styles.loginForm}>
          <div className={styles.formGroup}>
            <label htmlFor="email">Email</label>
            <input
              type="email"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Enter your email"
              required
            />
          </div>

          <div className={styles.formGroup}>
            <label htmlFor="password">Password</label>
            <input
              type="password"
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter your password"
              required
            />
          </div>

          {error && <div className={styles.error}>{error}</div>}

          <button type="submit" className={styles.loginButton}>
            Login
          </button>
        </form>

        <div className={styles.loginFooter}>
          <p>
            <i className="fas fa-lock"></i> Secure Authentication • AES-256 Encrypted
          </p>
          <div className={styles.demoCredentials}>
            <h4>Demo Credentials:</h4>
            <div className={styles.credentialList}>
              <div>
                <strong>Political Party:</strong><br />
                Email: party@demo.za<br />
                Password: demo123
              </div>
              <div>
                <strong>Regulatory Body (IEC):</strong><br />
                Email: iec@demo.za<br />
                Password: demo123
              </div>
              <div>
                <strong>Financial Institution:</strong><br />
                Email: bank@demo.za<br />
                Password: demo123
              </div>
            </div>
          </div>
        </div>
        </div>
      </div>
    </>
  );
};

export default Login;
