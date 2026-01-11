import { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useNavigate, Link } from 'react-router-dom';
import { login, reset } from '../store/slices/authSlice';
import { toast } from 'react-hot-toast';
import { Mail, Lock, ArrowRight } from 'lucide-react';

const Login = () => {
    const [formData, setFormData] = useState({ email: '', password: '' });
    const { email, password } = formData;
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const { user, isLoading, isError, isSuccess, message } = useSelector((state) => state.auth);

    useEffect(() => {
        if (isError) toast.error(message);
        if (isSuccess || user) navigate('/');
        dispatch(reset());
    }, [user, isError, isSuccess, message, navigate, dispatch]);

    const onChange = (e) => setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
    const onSubmit = (e) => { e.preventDefault(); dispatch(login({ email, password })); };

    return (
        <div className="flex justify-center items-center min-h-[calc(100vh-100px)]">
            <div className="w-full max-w-md">
                <div className="tetris-block p-8">
                    {/* Header */}
                    <div className="text-center mb-8">
                        <div className="flex justify-center gap-1 mb-4">
                            <div className="w-6 h-6 bg-primary-500 border-2 border-surface-dark"></div>
                            <div className="w-6 h-6 bg-tetris-yellow border-2 border-surface-dark -mt-3"></div>
                            <div className="w-6 h-6 bg-tetris-cyan border-2 border-surface-dark"></div>
                        </div>
                        <h1 className="text-2xl font-extrabold text-text-primary">INSERT COIN</h1>
                        <p className="text-text-muted mt-1">Login to continue playing</p>
                    </div>

                    <form onSubmit={onSubmit} className="space-y-4">
                        <div>
                            <label className="text-xs font-bold text-text-primary uppercase tracking-wider mb-2 block">📧 Email</label>
                            <input
                                type="email"
                                className="input-field"
                                name="email"
                                value={email}
                                onChange={onChange}
                                placeholder="player@game.com"
                                required
                            />
                        </div>

                        <div>
                            <label className="text-xs font-bold text-text-primary uppercase tracking-wider mb-2 block">🔒 Password</label>
                            <input
                                type="password"
                                className="input-field"
                                name="password"
                                value={password}
                                onChange={onChange}
                                placeholder="••••••••"
                                required
                            />
                        </div>

                        <button type="submit" disabled={isLoading} className="btn-primary w-full flex items-center justify-center gap-2 py-3 mt-6">
                            {isLoading ? 'LOADING...' : <>START GAME <ArrowRight size={18} /></>}
                        </button>
                    </form>

                    <p className="text-center mt-6 text-text-muted text-sm border-t-2 border-dashed border-surface-border pt-4">
                        New player? <Link to="/register" className="text-primary-500 hover:underline font-bold">CREATE ACCOUNT</Link>
                    </p>
                </div>
            </div>
        </div>
    );
};

export default Login;
