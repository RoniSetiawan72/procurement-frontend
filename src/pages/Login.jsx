import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { login } from '../api/services/authService';

const Login = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        try {
            const res = await login({ email, password });
            if (res.success) {
                localStorage.setItem('procurement_auth_token', res.data.token);
                localStorage.setItem('user_data', JSON.stringify(res.data.user));
                navigate('/dashboard');
            }
        } catch (err) {
            setError(err.response?.data?.message || 'Login gagal, periksa koneksi.');
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-neo-brutal-bg p-4">
            {/* Card Login Neubrutalism */}
            <div className="w-full max-w-md border-4 border-black bg-white p-8 shadow-[8px_8px_0px_0px_rgba(0,0,0,1)]">
                <h1 className="text-4xl font-black mb-2 uppercase italic">Login</h1>
                <p className="font-bold mb-6 text-gray-600">Sistem Procurement Terpadu</p>

                {error && (
                    <div className="border-2 border-black bg-neo-red p-3 mb-6 font-bold shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
                        {error}
                    </div>
                )}

                <form onSubmit={handleSubmit} className="space-y-6">
                    <div>
                        <label className="block font-black uppercase text-sm mb-1">Email Address</label>
                        <input 
                            type="email" 
                            className="w-full border-4 border-black p-3 font-bold focus:outline-none focus:bg-neo-yellow transition-colors"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            placeholder="roni@example.com"
                            required
                        />
                    </div>

                    <div>
                        <label className="block font-black uppercase text-sm mb-1">Password</label>
                        <input 
                            type="password" 
                            className="w-full border-4 border-black p-3 font-bold focus:outline-none focus:bg-neo-yellow transition-colors"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            placeholder="********"
                            required
                        />
                    </div>

                    <button 
                        type="submit"
                        className="w-full border-4 border-black bg-neo-blue py-4 font-black uppercase text-xl shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] active:shadow-none active:translate-x-1 active:translate-y-1 transition-all"
                    >
                        Masuk Ke Sistem
                    </button>
                </form>
            </div>
        </div>
    );
};

export default Login;