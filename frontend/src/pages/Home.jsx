import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useSelector } from 'react-redux';
import axios from 'axios';
import { Briefcase, Clock, DollarSign, Users, TrendingUp, Zap, Search, X } from 'lucide-react';
import { API_URL } from '../config/api';

const Home = () => {
    const [gigs, setGigs] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState('');
    const [debouncedSearch, setDebouncedSearch] = useState('');
    const { user } = useSelector((state) => state.auth);

    // Debounce search input
    useEffect(() => {
        const timer = setTimeout(() => {
            setDebouncedSearch(searchQuery);
        }, 300);
        return () => clearTimeout(timer);
    }, [searchQuery]);

    // Fetch gigs with search
    useEffect(() => {
        const fetchGigs = async () => {
            setLoading(true);
            try {
                const url = debouncedSearch
                    ? `${API_URL}/gigs?search=${encodeURIComponent(debouncedSearch)}`
                    : `${API_URL}/gigs`;
                const res = await axios.get(url);
                setGigs(res.data.data);
            } catch (error) {
                console.error('Error fetching gigs:', error);
            } finally {
                setLoading(false);
            }
        };
        fetchGigs();
    }, [debouncedSearch]);

    const getTetrisColor = (index) => {
        const colors = ['bg-tetris-cyan', 'bg-tetris-orange', 'bg-tetris-yellow', 'bg-tetris-green', 'bg-tetris-purple', 'bg-tetris-blue', 'bg-tetris-red'];
        return colors[index % colors.length];
    };

    const clearSearch = () => {
        setSearchQuery('');
    };

    return (
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
            {/* Sidebar - Reddit Style */}
            <aside className="lg:col-span-1 order-2 lg:order-1">
                <div className="tetris-block p-4 sticky top-24">
                    {/* Branding */}
                    <div className="flex items-center gap-3 pb-4 border-b-2 border-surface-dark mb-4">
                        <div className="flex gap-0.5">
                            <div className="w-6 h-6 bg-primary-500 border-2 border-surface-dark"></div>
                            <div className="w-6 h-6 bg-tetris-cyan border-2 border-surface-dark -mt-3"></div>
                        </div>
                        <div>
                            <h2 className="font-extrabold text-text-primary">r/GigFlow</h2>
                            <p className="text-xs text-text-muted">The Freelance Arcade</p>
                        </div>
                    </div>

                    <p className="text-sm text-text-secondary mb-4">
                        🎮 Post gigs. Place bids. Level up your career.
                    </p>

                    {user && (
                        <Link to="/create-gig" className="btn-primary w-full text-center block">
                            + CREATE GIG
                        </Link>
                    )}

                    {/* Stats */}
                    <div className="mt-6 pt-4 border-t-2 border-dashed border-surface-border">
                        <h3 className="text-xs font-bold text-text-muted uppercase tracking-wider mb-3">⚡ STATS</h3>
                        <div className="space-y-2">
                            <div className="flex justify-between items-center p-2 bg-surface-light border-2 border-surface-border">
                                <span className="text-sm text-text-secondary">Open Gigs</span>
                                <span className="font-bold text-primary-500">{gigs.length}</span>
                            </div>
                            <div className="flex justify-between items-center p-2 bg-surface-light border-2 border-surface-border">
                                <span className="text-sm text-text-secondary">Total Value</span>
                                <span className="font-bold text-tetris-green">${gigs.reduce((acc, g) => acc + g.budget, 0).toLocaleString()}</span>
                            </div>
                        </div>
                    </div>
                </div>
            </aside>

            {/* Main Feed - Reddit Style */}
            <main className="lg:col-span-3 order-1 lg:order-2">
                {/* Search Bar */}
                <div className="tetris-block p-4 mb-6">
                    <div className="relative">
                        <Search size={20} className="absolute left-3 top-1/2 -translate-y-1/2 text-text-muted" />
                        <input
                            type="text"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            placeholder="🔍 Search gigs by title..."
                            className="input-field pl-10 pr-10"
                        />
                        {searchQuery && (
                            <button
                                onClick={clearSearch}
                                className="absolute right-3 top-1/2 -translate-y-1/2 text-text-muted hover:text-primary-500"
                            >
                                <X size={18} />
                            </button>
                        )}
                    </div>
                    {debouncedSearch && (
                        <p className="text-sm text-text-muted mt-2">
                            Showing results for: <span className="font-bold text-primary-500">"{debouncedSearch}"</span>
                        </p>
                    )}
                </div>

                {/* Header */}
                <div className="flex items-center justify-between mb-6">
                    <div>
                        <h1 className="text-2xl font-extrabold text-text-primary">🔥 HOT GIGS</h1>
                        <p className="text-text-muted text-sm">Find your next power-up</p>
                    </div>
                    <div className="flex gap-2">
                        <button className="btn-primary flex items-center gap-1 text-xs">
                            <Zap size={14} /> HOT
                        </button>
                        <button className="btn-secondary flex items-center gap-1 text-xs">
                            <Clock size={14} /> NEW
                        </button>
                    </div>
                </div>

                {/* Loading State */}
                {loading ? (
                    <div className="flex justify-center items-center h-64">
                        <div className="flex items-center gap-3">
                            <div className="flex gap-1">
                                <div className="w-4 h-4 bg-primary-500 border-2 border-surface-dark animate-bounce"></div>
                                <div className="w-4 h-4 bg-tetris-yellow border-2 border-surface-dark animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                                <div className="w-4 h-4 bg-tetris-cyan border-2 border-surface-dark animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                            </div>
                            <span className="font-bold text-text-primary">LOADING...</span>
                        </div>
                    </div>
                ) : gigs.length === 0 ? (
                    <div className="tetris-block text-center py-16">
                        <div className="flex justify-center gap-1 mb-4">
                            <div className="w-8 h-8 bg-tetris-cyan border-2 border-surface-dark"></div>
                            <div className="w-8 h-8 bg-primary-500 border-2 border-surface-dark -mt-4"></div>
                            <div className="w-8 h-8 bg-tetris-yellow border-2 border-surface-dark"></div>
                        </div>
                        {debouncedSearch ? (
                            <>
                                <h2 className="text-xl font-bold text-text-primary mb-2">NO RESULTS!</h2>
                                <p className="text-text-muted mb-6">No gigs found for "{debouncedSearch}"</p>
                                <button onClick={clearSearch} className="btn-secondary">
                                    Clear Search
                                </button>
                            </>
                        ) : (
                            <>
                                <h2 className="text-xl font-bold text-text-primary mb-2">NO GIGS YET!</h2>
                                <p className="text-text-muted mb-6">Be the first player to drop a gig</p>
                                {user && (
                                    <Link to="/create-gig" className="btn-primary inline-block">
                                        + POST FIRST GIG
                                    </Link>
                                )}
                            </>
                        )}
                    </div>
                ) : (
                    <div className="space-y-4">
                        {gigs.map((gig, index) => (
                            <Link to={`/gigs/${gig._id}`} key={gig._id} className="block group">
                                <div className="tetris-block p-0 flex overflow-hidden">
                                    {/* Tetris Color Bar */}
                                    <div className={`w-3 ${getTetrisColor(index)} border-r-2 border-surface-dark`}></div>

                                    {/* Content */}
                                    <div className="flex-1 p-4">
                                        <div className="flex items-start justify-between gap-4">
                                            <div className="flex-1">
                                                <div className="flex items-center gap-2 mb-2">
                                                    <span className="badge badge-open">OPEN</span>
                                                    <span className="text-xs text-text-muted">
                                                        by <span className="font-bold text-text-primary">{gig.ownerId?.name || 'Anonymous'}</span>
                                                    </span>
                                                </div>
                                                <h3 className="text-lg font-bold text-text-primary group-hover:text-primary-500 transition-colors">
                                                    {gig.title}
                                                </h3>
                                                <p className="text-sm text-text-secondary mt-1 line-clamp-2">
                                                    {gig.description}
                                                </p>
                                                <div className="flex items-center gap-4 mt-3 text-xs text-text-muted">
                                                    <span className="flex items-center gap-1">
                                                        <Clock size={14} />
                                                        {new Date(gig.createdAt).toLocaleDateString()}
                                                    </span>
                                                </div>
                                            </div>

                                            {/* Budget - Tetris Block Style */}
                                            <div className="bg-tetris-green border-2 border-surface-dark p-3 text-center min-w-[80px]">
                                                <p className="text-xl font-extrabold text-white">${gig.budget?.toLocaleString()}</p>
                                                <p className="text-xs text-white/80 uppercase">Budget</p>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </Link>
                        ))}
                    </div>
                )}
            </main>
        </div>
    );
};

export default Home;
