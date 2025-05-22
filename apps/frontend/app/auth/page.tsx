'use client'

import axios, { AxiosError } from 'axios';
import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Loader from '@/components/Loader';
import { MousePointerSquareDashed } from 'lucide-react';

import { signIn, useSession } from 'next-auth/react';

export default function AuthPage() {
  const [isSignUp, setIsSignUp] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [username, setUsername] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);
  
  const router = useRouter();
  const { data: session } = useSession();
  

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      setLoading(true);
      if (isSignUp) {
        // Signup logic
        const response = await axios.post('http://localhost:8080/api/v1/user/signup', {
          email,
          password,
          username
        });

        if (response.status === 201) {
          setLoading(false);
          localStorage.setItem("token", response.data.token);
          localStorage.setItem("username", response.data.userData.username);
          console.log(response.data.token);
          router.push('/dashboard');
        }
      } else {
        // Signin logic
        const response = await axios.post('http://localhost:8080/api/v1/user/signin', {
          email,
          password
        });

        if (response.status === 200) {
          setLoading(false);
          localStorage.setItem("token", response.data.token);
          localStorage.setItem("username", response.data.userData.username);
          console.log(response.data.token);
          router.push('/dashboard');
        }
      }
    } catch (err) {
      setLoading(false);
      const axiosError = err as AxiosError;
      if (axiosError.response) {
        switch (axiosError.response.status) {
          case 403:
            setError('Invalid input format');
            break;
          case 409:
            setError('User with this email already exists');
            break;
          case 404:
            setError('Wrong credentials');
            break;
          default:
            setError('Something went wrong. Please try again.');
        }
      } else {
        setError('Network error. Please check your connection.');
      }
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleSignIn = async () => {
    try {
      setError("");
      
      // Initiate Google sign-in
      const result = await signIn('google', { 
        redirect: false 
      });
      
      if (result?.error) {
        throw new Error(result.error);
      }

      // The rest will be handled by our callbacks
      // We can check for success after a short delay
      setTimeout(() => {
        if (localStorage.getItem('token')) {
          router.push('/dashboard');
        } else {
          throw new Error('Authentication failed');
        }
      }, 1000);
      
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to sign in with Google');
      console.error("Google sign-in error:", err);
    }
    finally {
      setGoogleLoading(false);
    }
  };

  useEffect(() => {
    // Check if we have a token in localStorage (from Google auth)
    const token = localStorage.getItem('token');
    if (token) {
      router.push('/dashboard');
    }
    
    // Or if we have a session from NextAuth
    //@ts-ignore
    if (session?.backendToken) {
      //@ts-ignore
      localStorage.setItem('token', session.backendToken);
      //@ts-ignore
      localStorage.setItem('username', session.userData.username);
      router.push('/dashboard');
    }
  }, [session, router]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-950 to-slate-900 text-white flex flex-col items-center justify-center p-4 transition-all duration-300">
      <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 fixed top-0 py-4">
        <div className="flex items-center">
          <div className="relative">
            <div className="absolute inset-0 bg-blue-500 blur-lg opacity-20 rounded-full"></div>
            <MousePointerSquareDashed className="h-8 w-8 text-blue-400 relative z-10" />
          </div>
          <span className="ml-3 font-bold text-xl tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-white to-blue-200 cursor-pointer">
            Excaliboard
          </span>
        </div>
      </div>
      
      <div className="bg-white/5 backdrop-blur-md rounded-2xl border border-white/10 p-8 w-full max-w-md">
        <div className="text-center mb-6">
          <h1 className="text-3xl font-bold mb-2 bg-clip-text text-transparent bg-gradient-to-r from-blue-300 to-purple-300">
            Welcome to Excaliboard
          </h1>
          <p className="text-blue-100/80">Sign up or sign in to start creating</p>
        </div>

        <div className="flex gap-4 mb-6">
          <button
            type="button"
            onClick={() => setIsSignUp(true)}
            className={`flex-1 py-2 rounded-xl font-medium cursor-pointer transition-all duration-300 ${
              isSignUp
                ? 'bg-blue-600/90 text-white shadow-md'
                : 'text-blue-100/80 bg-white/5 hover:bg-white/10'
            }`}
          >
            Sign Up
          </button>
          <button
            type="button"
            onClick={() => setIsSignUp(false)}
            className={`flex-1 py-2 rounded-xl font-medium cursor-pointer transition-all duration-300 ${
              !isSignUp
                ? 'bg-blue-600/90 text-white shadow-md'
                : 'text-blue-100/80 bg-white/5 hover:bg-white/10'
            }`}
          >
            Sign In
          </button>
        </div>

        <form className="space-y-4" onSubmit={handleSubmit}>
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-blue-100/80 mb-2">
              Email
            </label>
            <input
              type="email"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="john@example.com"
              className="w-full px-4 py-2.5 bg-white/5 border border-white/10 rounded-xl outline-none focus:border-blue-400 text-white placeholder-blue-100/50"
              autoComplete="email"
              required
            />
          </div>

          <div>
            <label htmlFor="password" className="block text-sm font-medium text-blue-100/80 mb-2">
              Password
            </label>
            <input
              type="password"
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              className="w-full px-4 py-2.5 bg-white/5 border border-white/10 rounded-xl outline-none focus:border-blue-400 text-white placeholder-blue-100/50"
              autoComplete={isSignUp ? "new-password" : "current-password"}
              required
              minLength={6}
            />
          </div>

          {isSignUp && (
            <div>
              <label htmlFor="username" className="block text-sm font-medium text-blue-100/80 mb-2">
                Username
              </label>
              <input
                type="text"
                id="username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="John Doe"
                className="w-full px-4 py-2.5 bg-white/5 border border-white/10 rounded-xl outline-none focus:border-blue-400 text-white placeholder-blue-100/50"
                autoComplete="username"
                required
              />
            </div>
          )}

          {!isSignUp && (
            <div className="text-right">
              <a href="#" className="text-sm text-blue-300 hover:text-blue-200">
                Forgot password?
              </a>
            </div>
          )}

          {error && (
            <div className="text-red-300 text-sm text-center py-2 px-3 bg-red-500/10 rounded-xl border border-red-500/20">
              {error}
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full flex justify-center items-center gap-x-3 bg-blue-600 text-white py-2.5 px-4 rounded-xl hover:bg-blue-500 transition-all font-medium disabled:bg-blue-600/50 disabled:cursor-not-allowed mt-4 cursor-pointer"
          >
            {loading && <Loader />}
            {isSignUp ? (loading ? "Creating account..." : "Create Account") : (loading ? "Signing in..." : "Sign In")}
          </button>
        </form>

        <div className="mt-6">
          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-white/10"></div>
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-2 bg-transparent text-blue-100/60">Or continue with</span>
            </div>
          </div>

          <button 
              type="button"
              onClick={handleGoogleSignIn}
              disabled={googleLoading}
              className="w-full mt-6 bg-white/5 text-white py-2.5 px-4 rounded-xl hover:bg-white/10 transition-all font-medium flex items-center justify-center gap-2 border border-white/10 disabled:opacity-50 cursor-pointer"
          >
            {googleLoading ? ( <Loader /> ) : (
              <>
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12.545 10.239v3.821h5.445c-0.712 2.315-2.647 3.972-5.445 3.972-3.332 0-6.033-2.701-6.033-6.032s2.701-6.032 6.033-6.032c1.498 0 2.866 0.549 3.921 1.453l2.814-2.814c-1.784-1.664-4.13-2.676-6.735-2.676-5.523 0-10 4.477-10 10s4.477 10 10 10c8.396 0 10-7.496 10-10 0-0.67-0.069-1.325-0.189-1.955h-9.811z" />
                </svg>
                Google
              </>
            )}
          </button>
        </div>

        <p className="mt-8 text-center text-sm text-blue-100/60">
          By signing up, you agree to our{' '}
          <a href="#" className="text-blue-300 hover:text-blue-200">
            Terms of Service
          </a>{' '}
          and{' '}
          <a href="#" className="text-blue-300 hover:text-blue-200">
            Privacy Policy
          </a>
        </p>
      </div>
    </div>
  );
}