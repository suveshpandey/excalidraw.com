// 'use client'
// import Navbar from '../../components/Navbar';
// import axios, { AxiosError } from 'axios';
// import React, { useState } from 'react';
// import { useRouter } from 'next/navigation';
// import Loader from '@/components/Loader';
// import { MousePointerSquareDashed } from 'lucide-react';

// export default function AuthPage() {
//   const [isSignUp, setIsSignUp] = useState(false);
//   const [email, setEmail] = useState("");
//   const [password, setPassword] = useState("");
//   const [username, setUsername] = useState("");
//   const [error, setError] = useState("");
//   const [loading, setLoading] = useState(false);
//   const router = useRouter();
  
//   const handleSubmit = async (e: React.FormEvent) => {
//     e.preventDefault();

//     try {
//       setLoading(true);
//       if (isSignUp) {
//         // Signup logic
//         const response = await axios.post('http://localhost:8080/api/v1/user/signup', {
//           email,
//           password,
//           username
//         });

//         if (response.status === 201) {
//           setLoading(false);
//           localStorage.setItem("token", response.data.token);
//           localStorage.setItem("username", response.data.userData.username);
//           console.log(response.data.token);
//           router.push('/dashboard');
//         }
//       } else {
//         // Signin logic
//         const response = await axios.post('http://localhost:8080/api/v1/user/signin', {
//           email,
//           password
//         });

//         if (response.status === 200) {
//           setLoading(false);
//           localStorage.setItem("token", response.data.token);
//           localStorage.setItem("username", response.data.userData.username);
//           console.log(response.data.token);
//           router.push('/dashboard');
//         }
//       }
//     } catch (err) {
//       setLoading(false);
//       const axiosError = err as AxiosError;
//       if (axiosError.response) {
//         switch (axiosError.response.status) {
//           case 403:
//             setError('Invalid input format');
//             break;
//           case 409:
//             setError('User with this email already exists');
//             break;
//           case 404:
//             setError('Wrong credentials');
//             break;
//           default:
//             setError('Something went wrong. Please try again.');
//         }
//       } else {
//         setError('Network error. Please check your connection.');
//       }
//     } finally {
//       setLoading(false);
//     }
//   };

//   return (
//     <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center p-4 transition-all duration-300">
//       {/* <Navbar onLogout={handleLogOut} /> */}
//       <div className="w-full md:w-[70%] flex fixed top-0">
//           <div className="relative">
//             <div className="absolute inset-0 bg-blue-500 blur-lg opacity-20 rounded-full"></div>
//             <MousePointerSquareDashed className="h-8 w-8 text-blue-400 relative z-10" />
//           </div>
//           <span className="ml-3 font-bold text-xl tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-slate-700 to-slate-500 cursor-pointer">
//             Excaliboard
//           </span>
//       </div>
      
//       <div className="bg-white rounded-lg shadow-sm p-8 w-full max-w-md">
//         <h1 className="text-3xl font-bold mb-2 text-gray-800">Welcome to Excaliboard</h1>
//         <p className="text-gray-600 mb-4 text-center">Sign up or sign in to start creating</p>
//         <a href="/" className="text-sm text-gray-500 hover:text-blue-500 hover:underline">&larr; Back to home</a>

//         <div className="flex gap-4 mb-8 mt-6">
//           <button
//             type="button"
//             onClick={() => setIsSignUp(true)}
//             className={`flex-1 py-2 rounded-md font-medium cursor-pointer transition-colors duration-300 ${
//               isSignUp
//                 ? 'bg-blue-600 text-white shadow-md'
//                 : 'text-gray-500 bg-gray-100 hover:bg-gray-200'
//             }`}
//           >
//             Sign Up
//           </button>
//           <button
//             type="button"
//             onClick={() => setIsSignUp(false)}
//             className={`flex-1 py-2 rounded-md font-medium cursor-pointer transition-colors duration-300 ${
//               !isSignUp
//                 ? 'bg-blue-600 text-white shadow-md'
//                 : 'text-gray-500 bg-gray-100 hover:bg-gray-200'
//             }`}
//           >
//             Sign In
//           </button>
//         </div>

//         <form className="space-y-4" onSubmit={handleSubmit}>
//           <div>
//             <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
//               Email
//             </label>
//             <input
//               type="email"
//               id="email"
//               value={email}
//               onChange={(e) => setEmail(e.target.value)}
//               placeholder="john@example.com"
//               className="w-full px-4 py-2 border border-gray-300 rounded-md outline-none hover:border-blue-600 text-gray-800"
//               autoComplete="email"
//               required
//             />
//           </div>

//           <div>
//             <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">
//               Password
//             </label>
//             <input
//               type="password"
//               id="password"
//               value={password}
//               onChange={(e) => setPassword(e.target.value)}
//               placeholder="x x x x x x x"
//               className="w-full px-4 py-2 border border-gray-300 rounded-md outline-none hover:border-blue-600 text-gray-800"
//               autoComplete={isSignUp ? "new-password" : "current-password"}
//               required
//               minLength={6}
//             />
//           </div>

//           {isSignUp && (
//             <div>
//               <label htmlFor="username" className="block text-sm font-medium text-gray-700 mb-1">
//                 Username
//               </label>
//               <input
//                 type="text"
//                 id="username"
//                 value={username}
//                 onChange={(e) => setUsername(e.target.value)}
//                 placeholder="John Doe"
//                 className="w-full px-4 py-2 border border-gray-300 rounded-md outline-none hover:border-blue-600 text-gray-800"
//                 autoComplete="username"
//                 required
//               />
//             </div>
//           )}

//           {!isSignUp && (
//             <a href="/signup" className="block text-sm text-blue-600 hover:text-blue-700">
//               Forgot password?
//             </a>
//           )}

//           {error && (
//             <div className="text-red-500 text-sm mb-4 text-center py-2 px-3 bg-red-50 rounded-md">
//               {error}
//             </div>
//           )}

//           <button
//             type="submit"
//             disabled={loading}
//             className="w-full flex justify-center items-center gap-x-3 bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 transition-colors font-medium disabled:bg-blue-400 cursor-pointer disabled:cursor-not-allowed"
//           >
//             {loading && <Loader />}
//             {isSignUp ? (loading ? "Creating account..." : "Create Account") : (loading ? "Signing in..." : "Sign In")}
//           </button>
//         </form>

//         {/* Rest of your JSX remains the same */}
//         <div className="mt-8">
//           <div className="relative">
//             <div className="absolute inset-0 flex items-center">
//               <div className="w-full border-t border-gray-300"></div>
//             </div>
//             <div className="relative flex justify-center text-sm">
//               <span className="px-2 bg-white text-gray-500">Or continue with</span>
//             </div>
//           </div>

//           <button 
//             type="button"
//             className="w-full mt-4 bg-gray-800 text-white py-2 px-4 rounded-md hover:bg-gray-900 transition-colors font-medium flex items-center justify-center gap-2"
//           >
//             <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
//               <path d="M12 0C5.373 0 0 5.373 0 12c0 5.302 3.438 9.8 8.207 11.387.6.113.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23A11.509 11.509 0 0112 5.803c1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576C20.566 21.797 24 17.3 24 12c0-6.627-5.373-12-12-12z" />
//             </svg>
//             GitHub
//           </button>
//         </div>

//         <p className="mt-8 text-center text-sm text-gray-500">
//           By signing up, you agree to our{' '}
//           <a href="#" className="text-blue-600 hover:text-blue-700">
//             Terms of Service
//           </a>{' '}
//           and{' '}
//           <a href="#" className="text-blue-600 hover:text-blue-700">
//             Privacy Policy
//           </a>
//         </p>
//       </div>
//     </div>
//   );
// }


'use client'
import Navbar from '../../components/Navbar';
import axios, { AxiosError } from 'axios';
import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import Loader from '@/components/Loader';
import { MousePointerSquareDashed } from 'lucide-react';

export default function AuthPage() {
  const [isSignUp, setIsSignUp] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [username, setUsername] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  
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
            className="w-full flex justify-center items-center gap-x-3 bg-blue-600 text-white py-2.5 px-4 rounded-xl hover:bg-blue-500 transition-all font-medium disabled:bg-blue-600/50 disabled:cursor-not-allowed mt-4"
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
            className="w-full mt-6 bg-white/5 text-white py-2.5 px-4 rounded-xl hover:bg-white/10 transition-all font-medium flex items-center justify-center gap-2 border border-white/10"
          >
            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
              <path d="M12 0C5.373 0 0 5.373 0 12c0 5.302 3.438 9.8 8.207 11.387.6.113.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23A11.509 11.509 0 0112 5.803c1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576C20.566 21.797 24 17.3 24 12c0-6.627-5.373-12-12-12z" />
            </svg>
            GitHub
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