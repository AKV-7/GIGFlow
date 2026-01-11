import { Link, useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { logout, reset } from '../../store/slices/authSlice';
import { LogOut, Plus } from 'lucide-react';

const Header = () => {
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const { user } = useSelector((state) => state.auth);

    const onLogout = () => {
        dispatch(logout());
        dispatch(reset());
        navigate('/');
    };

    return (
        <header className="bg-white border-b-3 border-surface-dark sticky top-0 z-50" style={{ borderBottomWidth: '3px' }}>
            <div className="container mx-auto px-4 py-3 flex justify-between items-center">
                {/* Logo - Tetris Block Style */}
                <Link to="/" className="flex items-center gap-3 group">
                    <div className="flex gap-0.5">
                        <div className="w-4 h-4 bg-primary-500 border-2 border-surface-dark"></div>
                        <div className="w-4 h-4 bg-tetris-yellow border-2 border-surface-dark"></div>
                        <div className="w-4 h-4 bg-tetris-cyan border-2 border-surface-dark -mt-4"></div>
                    </div>
                    <span className="text-xl font-extrabold text-text-primary tracking-tight">
                        GIG<span className="text-primary-500">FLOW</span>
                    </span>
                </Link>

                {/* Navigation */}
                <nav className="flex items-center gap-3">
                    {user ? (
                        <>
                            <Link to="/create-gig" className="btn-primary flex items-center gap-2">
                                <Plus size={16} strokeWidth={3} />
                                <span className="hidden sm:inline">Post Gig</span>
                            </Link>
                            <div className="flex items-center gap-3 ml-2 pl-3 border-l-2 border-surface-dark">
                                <div className="flex items-center gap-2">
                                    <div className="w-8 h-8 bg-primary-500 border-2 border-surface-dark flex items-center justify-center">
                                        <span className="text-white text-sm font-bold">
                                            {(user?.user?.name || user?.name)?.charAt(0)?.toUpperCase()}
                                        </span>
                                    </div>
                                    <span className="text-text-primary font-bold hidden md:block">
                                        {user?.user?.name || user?.name}
                                    </span>
                                </div>
                                <button
                                    onClick={onLogout}
                                    className="text-text-muted hover:text-primary-500 transition-colors p-2"
                                    title="Logout"
                                >
                                    <LogOut size={18} strokeWidth={2.5} />
                                </button>
                            </div>
                        </>
                    ) : (
                        <div className="flex items-center gap-3">
                            <Link to="/login" className="btn-secondary">
                                Login
                            </Link>
                            <Link to="/register" className="btn-primary">
                                Sign Up
                            </Link>
                        </div>
                    )}
                </nav>
            </div>
        </header>
    );
};

export default Header;
