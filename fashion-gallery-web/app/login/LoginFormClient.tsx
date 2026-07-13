'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuthStore } from '@/lib/store/authStore';
import Image from 'next/image';
import styles from './login.module.css';
import { auth, db } from '@/lib/firebase/client';
import { signInWithEmailAndPassword, createUserWithEmailAndPassword, updateProfile } from 'firebase/auth';
import { doc, getDoc, setDoc } from 'firebase/firestore';

export default function LoginFormClient() {
  const [isRegistering, setIsRegistering] = useState(false);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const login = useAuthStore((state) => state.login);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccessMsg(null);
    setLoading(true);
    
    try {
      let userCredential;
      if (isRegistering) {
        userCredential = await createUserWithEmailAndPassword(auth, email, password);
        await updateProfile(userCredential.user, { displayName: name });
        
        // Create user document in Firestore
        const newUserDoc = {
          uid: userCredential.user.uid,
          name: name,
          email: email,
          phone: '',
          address: '',
          avatar: `https://api.dicebear.com/7.x/initials/svg?seed=${encodeURIComponent(name)}&backgroundColor=6B2335&textColor=ffffff`,
          wishlist: [],
          addresses: [],
          preferences: { orderUpdatesEmail: true, orderUpdatesSms: false, promotions: true, newsletter: true },
          createdAt: new Date().toISOString()
        };
        await setDoc(doc(db, 'users', userCredential.user.uid), newUserDoc);
        login(newUserDoc);
      } else {
        userCredential = await signInWithEmailAndPassword(auth, email, password);
        const userDocRef = doc(db, 'users', userCredential.user.uid);
        const userDocSnap = await getDoc(userDocRef);
        
        if (userDocSnap.exists()) {
          login(userDocSnap.data() as any);
        } else {
          // Fallback if document doesn't exist for some reason
          login({
            uid: userCredential.user.uid,
            name: userCredential.user.displayName || 'User',
            email: userCredential.user.email || '',
            phone: '',
            address: '',
            avatar: `https://api.dicebear.com/7.x/initials/svg?seed=${encodeURIComponent(userCredential.user.displayName || 'U')}&backgroundColor=6B2335&textColor=ffffff`
          });
        }
      }

      // Redirect to account or back to previous page
      const returnUrl = new URLSearchParams(window.location.search).get('returnUrl') || '/account';
      router.push(returnUrl);
    } catch (err: any) {
      console.warn('Auth error:', err.message);
      if (err.code === 'auth/email-already-in-use') {
        setError('Email is already registered.');
      } else if (err.code === 'auth/invalid-credential') {
        setError('Invalid email or password.');
      } else {
        setError('Authentication failed. Please try again.');
      }
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleLogin = async (e: React.MouseEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);
    
    try {
      const { GoogleAuthProvider, signInWithPopup } = await import('firebase/auth');
      const provider = new GoogleAuthProvider();
      const userCredential = await signInWithPopup(auth, provider);
      
      const userDocRef = doc(db, 'users', userCredential.user.uid);
      const userDocSnap = await getDoc(userDocRef);
      
      if (userDocSnap.exists()) {
        login(userDocSnap.data() as any);
      } else {
        // Create user doc for first-time Google login
        const newUserDoc = {
          uid: userCredential.user.uid,
          name: userCredential.user.displayName || 'Google User',
          email: userCredential.user.email || '',
          phone: '',
          address: '',
          avatar: userCredential.user.photoURL || `https://api.dicebear.com/7.x/initials/svg?seed=Google&backgroundColor=6B2335&textColor=ffffff`,
          wishlist: [],
          addresses: [],
          preferences: { orderUpdatesEmail: true, orderUpdatesSms: false, promotions: true, newsletter: true },
          createdAt: new Date().toISOString()
        };
        await setDoc(userDocRef, newUserDoc);
        login(newUserDoc);
      }
      
      const returnUrl = new URLSearchParams(window.location.search).get('returnUrl') || '/account';
      router.push(returnUrl);
    } catch (err: any) {
      console.warn('Google Auth error:', err.message);
      setError('Google login failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const toggleMode = (e: React.MouseEvent) => {
    e.preventDefault();
    setIsRegistering(!isRegistering);
    setError(null);
    setSuccessMsg(null);
  };

  const handleForgotPassword = async (e: React.MouseEvent) => {
    e.preventDefault();
    setError(null);
    setSuccessMsg(null);
    
    if (!email) {
      setError('Please enter your email address in the field above to reset your password.');
      return;
    }
    
    setLoading(true);
    try {
      const { sendPasswordResetEmail } = await import('firebase/auth');
      await sendPasswordResetEmail(auth, email);
      setSuccessMsg('Password reset email sent! Please check your inbox.');
    } catch (err: any) {
      console.warn('Password reset error:', err.message);
      setError('Failed to send password reset email. Please verify your email address.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className={styles.main}>
      <div className={styles.container}>

        <div className={styles.formSection}>
          <div className={styles.formCard}>
            <h1 className={styles.title}>{isRegistering ? 'Create an Account' : 'Welcome Back'}</h1>
            <p className={styles.subtitle}>{isRegistering ? 'Join us today.' : 'Please enter your details to sign in.'}</p>
            
            {error && (
              <div style={{ backgroundColor: '#fee2e2', color: '#dc2626', padding: '12px', borderRadius: '8px', marginBottom: '16px', fontSize: '14px', fontWeight: 500 }}>
                {error}
              </div>
            )}
            
            {successMsg && (
              <div style={{ backgroundColor: '#dcfce7', color: '#166534', padding: '12px', borderRadius: '8px', marginBottom: '16px', fontSize: '14px', fontWeight: 500 }}>
                {successMsg}
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
                  <a href="#" onClick={handleForgotPassword}>Forgot password?</a>
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
