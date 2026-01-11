import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import axios from 'axios';
import { toast } from 'react-hot-toast';
import { ArrowLeft, DollarSign, User, Clock, CheckCircle, XCircle, Send, Award } from 'lucide-react';

const API_URL = 'http://localhost:5000/api';

const GigDetail = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const { user } = useSelector((state) => state.auth);

    const [gig, setGig] = useState(null);
    const [bids, setBids] = useState([]);
    const [loading, setLoading] = useState(true);
    const [bidLoading, setBidLoading] = useState(false);
    const [showBidForm, setShowBidForm] = useState(false);
    const [bidForm, setBidForm] = useState({ message: '', proposedPrice: '' });

    // Get user ID from the nested structure
    const userId = user?.user?.id || user?.id;
    const isOwner = user && gig?.ownerId?._id === userId;

    useEffect(() => { fetchGig(); }, [id]);
    useEffect(() => { if (isOwner && gig) fetchBids(); }, [isOwner, gig]);

    const fetchGig = async () => {
        try {
            const res = await axios.get(`${API_URL}/gigs/${id}`);
            setGig(res.data.data);
        } catch (error) { toast.error('Gig not found'); navigate('/'); }
        finally { setLoading(false); }
    };

    const fetchBids = async () => {
        try {
            const res = await axios.get(`${API_URL}/bids/${id}`, { headers: { Authorization: `Bearer ${user.token}` } });
            setBids(res.data.data);
        } catch (error) { console.error('Error fetching bids:', error); }
    };

    const handleBidSubmit = async (e) => {
        e.preventDefault();
        setBidLoading(true);
        try {
            await axios.post(`${API_URL}/bids`, { gigId: id, ...bidForm }, { headers: { Authorization: `Bearer ${user.token}` } });
            toast.success('Bid submitted!');
            setShowBidForm(false);
            setBidForm({ message: '', proposedPrice: '' });
        } catch (error) {
            console.error('Bid error:', error.response?.data);
            toast.error(error.response?.data?.message || 'Failed to submit bid');
        }
        finally { setBidLoading(false); }
    };

    const handleHire = async (bidId) => {
        try {
            await axios.patch(`${API_URL}/bids/${bidId}/hire`, {}, { headers: { Authorization: `Bearer ${user.token}` } });
            toast.success('Freelancer hired!');
            fetchGig(); fetchBids();
        } catch (error) { toast.error(error.response?.data?.message || 'Failed to hire'); }
    };

    if (loading) return (
        <div className="flex justify-center items-center h-64">
            <div className="flex gap-1">
                <div className="w-4 h-4 bg-primary-500 border-2 border-surface-dark animate-bounce"></div>
                <div className="w-4 h-4 bg-tetris-yellow border-2 border-surface-dark animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                <div className="w-4 h-4 bg-tetris-cyan border-2 border-surface-dark animate-bounce" style={{ animationDelay: '0.2s' }}></div>
            </div>
        </div>
    );

    if (!gig) return null;

    const statusBadge = {
        open: 'badge-open',
        assigned: 'badge-assigned',
        completed: 'bg-tetris-cyan text-white',
        cancelled: 'bg-tetris-red text-white'
    };

    return (
        <div className="max-w-4xl mx-auto">
            <button onClick={() => navigate('/')} className="flex items-center gap-2 text-text-muted hover:text-primary-500 mb-6 transition-colors font-bold text-sm uppercase">
                <ArrowLeft size={18} /> Back to Gigs
            </button>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Main Content */}
                <div className="lg:col-span-2 space-y-6">
                    <div className="tetris-block p-6">
                        <div className="flex items-center gap-2 mb-4">
                            <span className={`badge ${statusBadge[gig.status]}`}>{gig.status.toUpperCase()}</span>
                        </div>
                        <h1 className="text-2xl font-extrabold text-text-primary mb-4">{gig.title}</h1>
                        <p className="text-text-secondary whitespace-pre-wrap leading-relaxed">{gig.description}</p>
                    </div>

                    {/* Bids Section */}
                    {isOwner && (
                        <div className="tetris-block p-6">
                            <h2 className="text-xl font-extrabold text-text-primary mb-4 flex items-center gap-2">
                                <Award size={20} className="text-tetris-yellow" /> BIDS ({bids.length})
                            </h2>
                            {bids.length === 0 ? (
                                <p className="text-text-muted text-center py-8">No bids yet. Share your gig!</p>
                            ) : (
                                <div className="space-y-4">
                                    {bids.map((bid) => (
                                        <div key={bid._id} className={`p-4 border-3 ${bid.status === 'hired' ? 'border-tetris-green bg-tetris-green/10' : bid.status === 'rejected' ? 'border-surface-border opacity-50' : 'border-surface-dark'}`} style={{ borderWidth: '3px' }}>
                                            <div className="flex justify-between items-start mb-2">
                                                <div className="flex items-center gap-3">
                                                    <div className="w-10 h-10 bg-primary-500 border-2 border-surface-dark flex items-center justify-center text-white font-bold">
                                                        {bid.freelancerId?.name?.charAt(0) || '?'}
                                                    </div>
                                                    <div>
                                                        <p className="font-bold text-text-primary">{bid.freelancerId?.name}</p>
                                                        <p className="text-xs text-text-muted">{bid.freelancerId?.email}</p>
                                                    </div>
                                                </div>
                                                <span className="text-xl font-extrabold text-tetris-green">${bid.proposedPrice}</span>
                                            </div>
                                            <p className="text-sm text-text-secondary mt-2">{bid.message}</p>
                                            {gig.status === 'open' && bid.status === 'pending' && (
                                                <button onClick={() => handleHire(bid._id)} className="btn-primary mt-4 flex items-center gap-2 text-sm">
                                                    <CheckCircle size={16} /> HIRE
                                                </button>
                                            )}
                                            {bid.status === 'hired' && <span className="inline-flex items-center gap-1 mt-4 text-tetris-green font-bold text-sm"><CheckCircle size={16} /> HIRED</span>}
                                            {bid.status === 'rejected' && <span className="inline-flex items-center gap-1 mt-4 text-tetris-red font-bold text-sm"><XCircle size={16} /> REJECTED</span>}
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                    )}
                </div>

                {/* Sidebar */}
                <div className="lg:col-span-1 space-y-4">
                    <div className="tetris-block p-5">
                        <div className="text-center pb-4 border-b-2 border-dashed border-surface-border mb-4">
                            <span className="text-xs text-text-muted uppercase font-bold">💰 Budget</span>
                            <p className="text-3xl font-extrabold text-tetris-green">${gig.budget?.toLocaleString()}</p>
                        </div>
                        <div className="space-y-3 text-sm">
                            <div className="flex items-center gap-2 text-text-secondary">
                                <User size={16} /> by <span className="font-bold text-text-primary">{gig.ownerId?.name}</span>
                            </div>
                            <div className="flex items-center gap-2 text-text-secondary">
                                <Clock size={16} /> {new Date(gig.createdAt).toLocaleDateString()}
                            </div>
                        </div>

                        {user && !isOwner && gig.status === 'open' && (
                            <button onClick={() => setShowBidForm(!showBidForm)} className="btn-primary w-full mt-6 flex items-center justify-center gap-2">
                                <Send size={16} /> {showBidForm ? 'CANCEL' : 'PLACE BID'}
                            </button>
                        )}

                        {!user && gig.status === 'open' && (
                            <p className="text-center text-text-muted text-sm mt-6">
                                <a href="/login" className="text-primary-500 hover:underline font-bold">Login</a> to bid
                            </p>
                        )}
                    </div>

                    {/* Bid Form */}
                    {showBidForm && (
                        <form onSubmit={handleBidSubmit} className="tetris-block p-5 space-y-4" style={{ borderColor: '#f97316' }}>
                            <h3 className="font-extrabold text-text-primary">📝 Your Proposal</h3>
                            <div>
                                <label className="text-xs text-text-muted uppercase font-bold block mb-1">Your Price ($)</label>
                                <input type="number" value={bidForm.proposedPrice} onChange={(e) => setBidForm({ ...bidForm, proposedPrice: e.target.value })} className="input-field" placeholder="450" required min={1} />
                            </div>
                            <div>
                                <label className="text-xs text-text-muted uppercase font-bold block mb-1">Cover Letter</label>
                                <textarea value={bidForm.message} onChange={(e) => setBidForm({ ...bidForm, message: e.target.value })} className="input-field min-h-[100px] resize-none" placeholder="Why you?" required minLength={10} />
                            </div>
                            <button type="submit" disabled={bidLoading} className="btn-primary w-full">
                                {bidLoading ? 'SENDING...' : '🚀 SUBMIT BID'}
                            </button>
                        </form>
                    )}
                </div>
            </div>
        </div>
    );
};

export default GigDetail;
