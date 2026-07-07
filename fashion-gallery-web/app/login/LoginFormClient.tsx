'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuthStore } from '@/lib/store/authStore';
import Image from 'next/image';
import styles from './login.module.css';

export default function LoginFormClient() {
  const [isRegistering, setIsRegistering] = useState(false);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const login = useAuthStore((state) => state.login);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);
    
    try {
      const endpoint = isRegistering ? '/api/auth/register' : '/api/auth/login';
      const body = isRegistering 
        ? JSON.stringify({ name, email, password })
        : JSON.stringify({ email, password });

      const res = await fetch(endpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.error || 'Authentication failed');
        setLoading(false);
        return;
      }
      
      // Successfully authenticated
      login(data.user);
      
      // Redirect to account or back to previous page
      const returnUrl = new URLSearchParams(window.location.search).get('returnUrl') || '/account';
      router.push(returnUrl);
    } catch (err) {
      setError('A network error occurred. Please try again.');
      setLoading(false);
    }
  };

  const handleGoogleLogin = async (e: React.MouseEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);
    
    // Simulate network delay / OAuth popup for realism
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    const googleUser = {
      name: 'Google User',
      email: 'user@gmail.com',
      phone: '',
      address: '',
      avatar: `https://api.dicebear.com/7.x/initials/svg?seed=Google&backgroundColor=6B2335&textColor=ffffff`
    };
    
    login(googleUser);
    const returnUrl = new URLSearchParams(window.location.search).get('returnUrl') || '/account';
    router.push(returnUrl);
  };

  const toggleMode = (e: React.MouseEvent) => {
    e.preventDefault();
    setIsRegistering(!isRegistering);
    setError(null);
  };

  return (
    <main className={styles.main}>
      <div className={styles.container}>
        <div className={styles.imageSection}>
          <Image 
            src="/hero-bg-v6.jpg" 
            alt="Fashion Gallery" 
            fill 
            style={{ objectFit: 'cover' }}
            priority
          />
          <div className={styles.imageOverlay}>
            <div className={styles.overlayContent}>
              <h2>Discover Your Elegance</h2>
              <p>Join My Moon Clothing to track orders, save favorite items, and enjoy a seamless shopping experience.</p>
            </div>
          </div>
        </div>
        <div className={styles.formSection}>
          <div className={styles.formCard}>
            <h1 className={styles.title}>{isRegistering ? 'Create an Account' : 'Welcome Back'}</h1>
            <p className={styles.subtitle}>{isRegistering ? 'Join us today.' : 'Please enter your details to sign in.'}</p>
            
            {error && (
              <div style={{ backgroundColor: '#fee2e2', color: '#dc2626', padding: '12px', borderRadius: '8px', marginBottom: '16px', fontSize: '14px', fontWeight: 500 }}>
                {error}
              </div>
            )}

            <form onSubmit={handleLogin} className={styles.form}>
              {isRegistering && (
                <div className={styles.inputGroup}>
                  <label htmlFor="name">Full Name</label>
                  <input 
                    type="text" 
                    id="name" 
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Enter your full name" 
                    required={isRegistering} 
                  />
                </div>
              )}
              
              <div className={styles.inputGroup}>
                <label htmlFor="email">Email address</label>
                <input 
                  type="email" 
                  id="email" 
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Enter your email" 
                  required 
                />
              </div>
              
              <div className={styles.inputGroup}>
                <label htmlFor="password">Password</label>
                <div className={styles.passwordWrapper}>
                  <input 
                    type={showPassword ? "text" : "password"} 
                    id="password" 
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Enter your password" 
                    required 
                  />
                  <button 
                    type="button" 
                    className={styles.eyeBtn}
                    onClick={() => setShowPassword(!showPassword)}
                    aria-label={showPassword ? "Hide password" : "Show password"}
                  >
                    {showPassword ? (
                      <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24"/><line x1="1" y1="1" x2="23" y2="23"/></svg>
                    ) : (
                      <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></svg>
                    )}
                  </button>
                </div>
              </div>
              
              {!isRegistering && (
                <div className={styles.forgotPassword}>
                  <a href="#">Forgot password?</a>
                </div>
              )}
              
              <button type="submit" className={styles.loginBtn} disabled={loading}>
                {loading ? 'Processing...' : (isRegistering ? 'Sign Up' : 'Sign In')}
              </button>
              
              <div className={styles.divider}>
                <span>or</span>
              </div>
              
              <button type="button" className={styles.googleBtn} onClick={handleGoogleLogin} disabled={loading}>
                <img src="https://www.svgrepo.com/show/475656/google-color.svg" alt="Google" width="20" height="20" />
                {isRegistering ? 'Sign up with Google' : 'Sign in with Google'}
              </button>
            </form>
            
            <p className={styles.registerLink}>
              {isRegistering ? 'Already have an account? ' : "Don't have an account? "}
              <a href="#" onClick={toggleMode}>
                {isRegistering ? 'Sign in' : 'Sign up for free'}
              </a>
            </p>
          </div>
        </div>
      </div>
    </main>
  );
}
