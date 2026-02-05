import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { authAPI } from '../services/api';
import { useAuthStore } from '../store/store';
import toast from 'react-hot-toast';

const Login = () => {
    const navigate = useNavigate();
    const { setUser, setToken } = useAuthStore();
    const [isLogin, setIsLogin] = useState(true);
    const [formData, setFormData] = useState({
        username: '',
        email: '',
        password: '',
    });
    const [loading, setLoading] = useState(false);

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value,
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);

        try {
            let response;
            if (isLogin) {
                response = await authAPI.login({
                    email: formData.email,
                    password: formData.password,
                });
            } else {
                response = await authAPI.register(formData);
            }

            const { data, token } = response.data;
            setUser(data);
            setToken(token);

            toast.success(`Welcome${isLogin ? ' back' : ''}!`);
            navigate('/');
        } catch (error) {
            console.error('Auth error:', error);
            toast.error(error.response?.data?.message || 'Authentication failed');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-background-dark via-background-dark to-black p-4">
            <div className="w-full max-w-md">
                {/* Logo */}
                <div className="text-center mb-8">
                    <h1 className="text-white text-3xl font-black tracking-tight flex items-center justify-center gap-2 mb-2">
                        <span className="material-symbols-outlined text-primary text-5xl filled-icon">
                            graphic_eq
                        </span>
                        MusicStream
                    </h1>
                    <p className="text-primary text-sm font-semibold tracking-widest uppercase">
                        Premium Audio
                    </p>
                </div>

                {/* Form */}
                <div className="glass-effect rounded-2xl p-8">
                    <div className="flex gap-2 mb-6">
                        <button
                            onClick={() => setIsLogin(true)}
                            className={`flex-1 py-3 px-4 rounded-xl font-bold transition-all ${isLogin
                                    ? 'bg-primary text-black'
                                    : 'bg-white/5 text-white/60 hover:bg-white/10'
                                }`}
                        >
                            Login
                        </button>
                        <button
                            onClick={() => setIsLogin(false)}
                            className={`flex-1 py-3 px-4 rounded-xl font-bold transition-all ${!isLogin
                                    ? 'bg-primary text-black'
                                    : 'bg-white/5 text-white/60 hover:bg-white/10'
                                }`}
                        >
                            Register
                        </button>
                    </div>

                    <form onSubmit={handleSubmit} className="space-y-4">
                        {!isLogin && (
                            <div>
                                <label className="block text-sm font-bold mb-2 text-white/80">
                                    Username
                                </label>
                                <input
                                    type="text"
                                    name="username"
                                    value={formData.username}
                                    onChange={handleChange}
                                    placeholder="Choose a username"
                                    className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-lg text-white placeholder-white/40 focus:outline-none focus:border-primary transition-colors"
                                    required={!isLogin}
                                />
                            </div>
                        )}

                        <div>
                            <label className="block text-sm font-bold mb-2 text-white/80">
                                Email
                            </label>
                            <input
                                type="email"
                                name="email"
                                value={formData.email}
                                onChange={handleChange}
                                placeholder="your@email.com"
                                className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-lg text-white placeholder-white/40 focus:outline-none focus:border-primary transition-colors"
                                required
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-bold mb-2 text-white/80">
                                Password
                            </label>
                            <input
                                type="password"
                                name="password"
                                value={formData.password}
                                onChange={handleChange}
                                placeholder="••••••••"
                                className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-lg text-white placeholder-white/40 focus:outline-none focus:border-primary transition-colors"
                                required
                            />
                        </div>

                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full py-4 px-8 bg-primary text-black font-bold rounded-xl hover:scale-[1.02] active:scale-95 transition-transform disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                        >
                            {loading ? (
                                <>
                                    <span className="material-symbols-outlined animate-spin">refresh</span>
                                    Please wait...
                                </>
                            ) : (
                                <>{isLogin ? 'Login' : 'Create Account'}</>
                            )}
                        </button>
                    </form>

                    <div className="mt-6 text-center text-sm text-white/60">
                        <p>
                            {isLogin ? "Don't have an account?" : 'Already have an account?'}{' '}
                            <button
                                onClick={() => setIsLogin(!isLogin)}
                                className="text-primary font-bold hover:underline"
                            >
                                {isLogin ? 'Register' : 'Login'}
                            </button>
                        </p>
                    </div>
                </div>

                {/* Skip to Demo */}
                <div className="mt-6 text-center">
                    <Link
                        to="/"
                        className="text-sm text-white/60 hover:text-white transition-colors inline-flex items-center gap-2"
                    >
                        <span className="material-symbols-outlined text-sm">arrow_forward</span>
                        Skip to demo
                    </Link>
                </div>
            </div>
        </div>
    );
};

export default Login;
