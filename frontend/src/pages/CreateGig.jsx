import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import axios from 'axios';
import { toast } from 'react-hot-toast';
import { Briefcase, DollarSign, FileText, ArrowLeft } from 'lucide-react';

const API_URL = 'http://localhost:5000/api';

const CreateGig = () => {
    const navigate = useNavigate();
    const { user } = useSelector((state) => state.auth);
    const [loading, setLoading] = useState(false);
    const [formData, setFormData] = useState({ title: '', description: '', budget: '' });

    useEffect(() => {
        if (!user) { toast.error('Please login to create a gig'); navigate('/login'); }
    }, [user, navigate]);

    const { title, description, budget } = formData;
    const onChange = (e) => setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));

    const onSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            const res = await axios.post(`${API_URL}/gigs`, formData, { headers: { Authorization: `Bearer ${user.token}` } });
            toast.success('Gig created!');
            navigate(`/gigs/${res.data.data._id}`);
        } catch (error) {
            toast.error(error.response?.data?.message || 'Failed to create gig');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="max-w-2xl mx-auto">
            <button onClick={() => navigate(-1)} className="flex items-center gap-2 text-text-muted hover:text-primary-500 mb-6 transition-colors font-bold text-sm uppercase">
                <ArrowLeft size={18} /> Back
            </button>

            <div className="tetris-block p-8">
                {/* Header */}
                <div className="flex items-center gap-4 mb-8 pb-6 border-b-2 border-dashed border-surface-border">
                    <div className="w-14 h-14 bg-primary-500 border-3 border-surface-dark flex items-center justify-center" style={{ borderWidth: '3px' }}>
                        <Briefcase size={28} className="text-white" />
                    </div>
                    <div>
                        <h1 className="text-2xl font-extrabold text-text-primary">CREATE GIG</h1>
                        <p className="text-text-muted">Drop a new job into the arena</p>
                    </div>
                </div>

                <form onSubmit={onSubmit} className="space-y-6">
                    <div>
                        <label className="text-xs font-bold text-text-primary uppercase tracking-wider mb-2 block flex items-center gap-2">
                            <FileText size={14} /> Gig Title
                        </label>
                        <input type="text" name="title" value={title} onChange={onChange} placeholder="e.g., Build a React Dashboard" className="input-field" required minLength={5} maxLength={100} />
                        <p className="text-xs text-text-muted mt-1">{title.length}/100</p>
                    </div>

                    <div>
                        <label className="text-xs font-bold text-text-primary uppercase tracking-wider mb-2 block flex items-center gap-2">
                            <FileText size={14} /> Description
                        </label>
                        <textarea name="description" value={description} onChange={onChange} placeholder="Describe your project..." className="input-field min-h-[150px] resize-none" required minLength={20} maxLength={2000} />
                        <p className="text-xs text-text-muted mt-1">{description.length}/2000</p>
                    </div>

                    <div>
                        <label className="text-xs font-bold text-text-primary uppercase tracking-wider mb-2 block flex items-center gap-2">
                            <DollarSign size={14} /> Budget (USD)
                        </label>
                        <div className="relative">
                            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-tetris-green font-bold text-lg">$</span>
                            <input type="number" name="budget" value={budget} onChange={onChange} placeholder="500" className="input-field pl-8" required min={1} />
                        </div>
                    </div>

                    <div className="pt-4 border-t-2 border-surface-border">
                        <button type="submit" disabled={loading} className="btn-primary w-full py-3">
                            {loading ? 'POSTING...' : '🚀 PUBLISH GIG'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default CreateGig;
