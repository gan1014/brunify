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
        <div className="min-h-screen flex items-center justify-center relative overflow-hidden bg-black">
            {/* Background Image with Overlay */}
            <div
                className="absolute inset-0 bg-cover bg-center transition-transform duration-[10s] animate-pulse"
                style={{
                    backgroundImage: `linear-gradient(to bottom, rgba(0,0,0,0.4), rgba(0,0,0,0.9)), url("https://images.unsplash.com/photo-1505633162211-e4a929c0b5f6?w=1600&h=900&fit=crop")`,
                    opacity: 0.7
                }}
            />

            {/* Grain/Noise Overlay */}
            <div className="absolute inset-0 bg-grain opacity-20 pointer-events-none" />

            <div className="w-full max-w-md relative z-10 p-4">
                {/* Logo */}
                <div className="text-center mb-8 animate-fadeIn">
                    <h1 className="text-white text-5xl font-black tracking-tight flex items-center justify-center gap-3 mb-2 font-skull">
                        <span className="material-symbols-outlined text-primary text-6xl filled-icon">
                            skull
                        </span>
                        Brunify
                    </h1>
                    <p className="text-primary/60 text-xs font-bold tracking-[0.4em] uppercase">
                        Eternal Audio remains
                    </p>
                </div>

                {/* Form Container */}
                <div className="bg-black/40 backdrop-blur-md border border-white/5 rounded-3xl p-8 shadow-[0_30px_60px_rgba(0,0,0,0.8)] relative group overflow-hidden">
                    {/* Animated Rose Glow (Top Corner) */}
                    <div className="absolute -top-10 -right-10 size-32 bg-accent/20 blur-[60px] rounded-full group-hover:bg-accent/30 transition-all duration-700" />

                    <div className="flex gap-2 mb-8 relative z-10">
                        <button
                            onClick={() => setIsLogin(true)}
                            className={`flex-1 py-3 px-4 rounded-2xl font-black tracking-widest text-xs uppercase transition-all duration-500 ${isLogin
                                ? 'bg-primary text-black scale-100 shadow-[0_0_20px_rgba(255,255,255,0.3)]'
                                : 'bg-white/5 text-white/40 hover:bg-white/10 scale-95'
                                }`}
                        >
                            Log In
                        </button>
                        <button
                            onClick={() => setIsLogin(false)}
                            className={`flex-1 py-3 px-4 rounded-2xl font-black tracking-widest text-xs uppercase transition-all duration-500 ${!isLogin
                                ? 'bg-primary text-black scale-100 shadow-[0_0_20px_rgba(255,255,255,0.3)]'
                                : 'bg-white/5 text-white/40 hover:bg-white/10 scale-95'
                                }`}
                        >
                            Join Us
                        </button>
                    </div>

                    <form onSubmit={handleSubmit} className="space-y-5 relative z-10">
                        {!isLogin && (
                            <div className="animate-fadeIn">
                                <label className="block text-[10px] font-black uppercase tracking-[0.2em] mb-2 text-primary/40 pl-1">
                                    Username
                                </label>
                                <input
                                    type="text"
                                    name="username"
                                    value={formData.username}
                                    onChange={handleChange}
                                    placeholder="SOUL NAME"
                                    className="w-full px-5 py-4 bg-black/40 border border-white/10 rounded-2xl text-white placeholder-white/20 focus:outline-none focus:border-primary/40 focus:bg-black/60 transition-all font-medium text-sm"
                                    required={!isLogin}
                                />
                            </div>
                        )}

                        <div className="animate-fadeIn">
                            <label className="block text-[10px] font-black uppercase tracking-[0.2em] mb-2 text-primary/40 pl-1">
                                Email Address
                            </label>
                            <input
                                type="email"
                                name="email"
                                value={formData.email}
                                onChange={handleChange}
                                placeholder="THE_VOID@DARKNESS.COM"
                                className="w-full px-5 py-4 bg-black/40 border border-white/10 rounded-2xl text-white placeholder-white/20 focus:outline-none focus:border-primary/40 focus:bg-black/60 transition-all font-medium text-sm"
                                required
                            />
                        </div>

                        <div className="animate-fadeIn">
                            <label className="block text-[10px] font-black uppercase tracking-[0.2em] mb-2 text-primary/40 pl-1">
                                Secret Key
                            </label>
                            <input
                                type="password"
                                name="password"
                                value={formData.password}
                                onChange={handleChange}
                                placeholder="••••••••"
                                className="w-full px-5 py-4 bg-black/40 border border-white/10 rounded-2xl text-white placeholder-white/20 focus:outline-none focus:border-primary/40 focus:bg-black/60 transition-all font-medium text-sm"
                                required
                            />
                        </div>

                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full py-5 px-8 bg-primary text-black font-black tracking-widest uppercase text-xs rounded-2xl hover:scale-[1.02] active:scale-95 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-3 overflow-hidden group shadow-[0_0_30px_rgba(255,255,255,0.1)] hover:shadow-[0_0_30px_rgba(255,255,255,0.2)]"
                        >
                            {loading ? (
                                <>
                                    <span className="material-symbols-outlined animate-spin-slow">skull</span>
                                    Raising Soul...
                                </>
                            ) : (
                                <>
                                    <span className="material-symbols-outlined text-sm font-bold">
                                        {isLogin ? 'key' : 'person_add'}
                                    </span>
                                    {isLogin ? 'Enter The Void' : 'Begin Eternal Life'}
                                </>
                            )}
                        </button>
                    </form>

                    <div className="mt-8 text-center">
                        <button
                            onClick={() => setIsLogin(!isLogin)}
                            className="text-[10px] font-black uppercase tracking-[0.3em] text-primary/30 hover:text-primary/100 transition-all duration-500"
                        >
                            {isLogin ? 'Need an afterlife? register' : 'already have a soul? login'}
                        </button>
                    </div>
                </div>

                {/* Footer Skip */}
                <div className="mt-10 text-center animate-fadeIn">
                    <Link
                        to="/"
                        className="text-[10px] font-black uppercase tracking-[0.4em] text-white/20 hover:text-primary transition-all flex items-center justify-center gap-3"
                    >
                        <span className="w-8 h-px bg-white/10" />
                        Skip to life
                        <span className="w-8 h-px bg-white/10" />
                    </Link>
                </div>
            </div>

            {/* Dark Floral Accents (Bottom Corners) */}
            <div className="absolute -bottom-20 -left-20 size-80 bg-accent/10 blur-[100px] rounded-full pointer-events-none" />
            <div className="absolute -bottom-20 -right-20 size-80 bg-primary/10 blur-[100px] rounded-full pointer-events-none" />
        </div>
    );
};

export default Login;
