import React, { useState, useEffect, useCallback } from 'react';

const API_URL = `${process.env.REACT_APP_BASE_API_URL}/api/admin`;
const PUBLIC_API_URL = `${process.env.REACT_APP_BASE_API_URL}/api`;

const setCookie = (name, value, days) => {
    let expires = "";
    if (days) {
        const date = new Date();
        date.setTime(date.getTime() + (days * 24 * 60 * 60 * 1000));
        expires = "; expires=" + date.toUTCString();
    }
    document.cookie = name + "=" + (value || "") + expires + "; path=/";
};

const getCookie = (name) => {
    const nameEQ = name + "=";
    const ca = document.cookie.split(';');
    for (let i = 0; i < ca.length; i++) {
        let c = ca[i];
        while (c.charAt(0) === ' ') c = c.substring(1, c.length);
        if (c.indexOf(nameEQ) === 0) return c.substring(nameEQ.length, c.length);
    }
    return null;
};

const removeCookie = (name) => {
    document.cookie = name + '=; Max-Age=-99999999; path=/;';
};

const ParticipantModal = ({ isOpen, onClose, onSave, participant, isLoading }) => {
    const [formData, setFormData] = useState({});

    const majors = [
        "Computer Science",
        "Visual Communication Design",
        "Public Relations",
        "Communication",
        "Entreprenuership Business Creation",
        "Digital Business Innovation",
        "Interactive Design & Technology",
        "Digital Psychology",
        "Interior Design"
    ];

    useEffect(() => {
        setFormData(participant || {
            fullName: '', nim: '', binusianEmail: '', privateEmail: '', phone: '', major: ''
        });
    }, [participant]);

    if (!isOpen) return null;

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        onSave(formData);
    };

    return (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50 p-4">
            <div className="w-full max-w-lg bg-[#0d0d0d] border-2 border-cyan-500/50 rounded-lg shadow-2xl p-8 space-y-6">
                <h2 className="text-2xl font-bold text-cyan-400">{participant ? 'Edit Participant' : 'Add New Participant'}</h2>
                <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div><label className="text-sm text-slate-300">Full Name</label><input type="text" name="fullName" value={formData.fullName || ''} onChange={handleChange} required className="w-full mt-1 px-3 py-2 bg-slate-900 border border-slate-700 rounded-md text-white"/></div>
                        <div><label className="text-sm text-slate-300">NIM</label><input type="text" name="nim" value={formData.nim || ''} onChange={handleChange} required className="w-full mt-1 px-3 py-2 bg-slate-900 border border-slate-700 rounded-md text-white"/></div>
                        <div><label className="text-sm text-slate-300">Binusian Email</label><input type="email" name="binusianEmail" value={formData.binusianEmail || ''} onChange={handleChange} required className="w-full mt-1 px-3 py-2 bg-slate-900 border border-slate-700 rounded-md text-white"/></div>
                        <div><label className="text-sm text-slate-300">Private Email</label><input type="email" name="privateEmail" value={formData.privateEmail || ''} onChange={handleChange} required className="w-full mt-1 px-3 py-2 bg-slate-900 border border-slate-700 rounded-md text-white"/></div>
                        <div><label className="text-sm text-slate-300">Phone</label><input type="tel" name="phone" value={formData.phone || ''} onChange={handleChange} required className="w-full mt-1 px-3 py-2 bg-slate-900 border border-slate-700 rounded-md text-white"/></div>
                        <div>
                            <label className="text-sm text-slate-300">Major</label>
                            <select name="major" value={formData.major || ''} onChange={handleChange} required className="w-full mt-1 px-3 py-2 bg-slate-900 border border-slate-700 rounded-md text-white">
                                <option value="" disabled>Select a Major</option>
                                {majors.map(major => <option key={major} value={major}>{major}</option>)}
                            </select>
                        </div>
                    </div>
                    <div className="flex justify-end gap-4 pt-4">
                        <button type="button" onClick={onClose} className="px-4 py-2 border border-slate-600 rounded-md text-slate-300 hover:bg-slate-700">Cancel</button>
                        <button type="submit" disabled={isLoading} className="px-4 py-2 bg-cyan-500/20 text-cyan-300 border border-cyan-500 rounded-md hover:bg-cyan-500/30 disabled:opacity-50">
                            {isLoading ? 'Saving...' : 'Save Changes'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

const ConfirmModal = ({ isOpen, onClose, onConfirm, title, message }) => {
    if (!isOpen) return null;
    return (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50 p-4">
            <div className="w-full max-w-md bg-[#0d0d0d] border-2 border-red-500/50 rounded-lg shadow-2xl p-8 space-y-6">
                <h2 className="text-2xl font-bold text-red-400">{title}</h2>
                <p className="text-slate-300">{message}</p>
                <div className="flex justify-end gap-4 pt-4">
                    <button onClick={onClose} className="px-4 py-2 border border-slate-600 rounded-md text-slate-300 hover:bg-slate-700">Cancel</button>
                    <button onClick={onConfirm} className="px-4 py-2 bg-red-500/20 text-red-300 border border-red-500 rounded-md hover:bg-red-500/30">Confirm Delete</button>
                </div>
            </div>
        </div>
    );
};


function AdminPage() {
    const [sortConfig, setSortConfig] = useState({ key: null, direction: 'asc' });
    const [token, setToken] = useState(getCookie('admin_token'));
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [participants, setParticipants] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState('');
    
   
    const [isRegistrationOpen, setIsRegistrationOpen] = useState(false);
    const [isToggling, setIsToggling] = useState(false);

    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isConfirmOpen, setIsConfirmOpen] = useState(false);
    const [selectedParticipant, setSelectedParticipant] = useState(null);
    const [isSaving, setIsSaving] = useState(false);
    
    const handleSort = (key) => {
        let direction = 'asc';
        if (sortConfig.key === key && sortConfig.direction === 'asc') {
            direction = 'desc';
        }
        setSortConfig({ key, direction });
    };

    const handleLogin = async (e) => {
        e.preventDefault();
        setIsLoading(true);
        setError('');
        try {
            const response = await fetch(`${API_URL}/login`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email, password }),
            });
            const data = await response.json();
            if (!response.ok) throw new Error(data.message || 'Login failed');
            
            setCookie('admin_token', data.accessToken, 1);
            setToken(data.accessToken);
        } catch (err) {
            setError(err.message);
        } finally {
            setIsLoading(false);
        }
    };

    const handleLogout = () => {
        removeCookie('admin_token');
        setToken(null);
        setParticipants([]);
    };

    const fetchRegistrationStatus = useCallback(async () => {
        try {
            const response = await fetch(`${PUBLIC_API_URL}/settings/registration`);
            if (!response.ok) {
                console.error('Failed to fetch registration status.');
                return;
            }
            const data = await response.json();
            setIsRegistrationOpen(data.isOpen);
        } catch (err) {
            console.error("Error fetching registration status:", err.message);
        }
    }, []);

    const fetchParticipantData = useCallback(async () => {
        if (!token) return;
        setIsLoading(true);
        setError('');
        try {
            const response = await fetch(`${API_URL}/participants`, {
                headers: { 'Authorization': `Bearer ${token}` },
            });
            if (response.status === 401 || response.status === 403) {
                handleLogout();
                throw new Error('Your session has expired. Please log in again.');
            }
            if (!response.ok) throw new Error('Failed to fetch participant data.');
            const data = await response.json();
            setParticipants(data);
        } catch (err) {
            setError(err.message);
        } finally {
            setIsLoading(false);
        }
    }, [token]);

    const handleToggleRegistration = async () => {
        setIsToggling(true);
        setError('');
        try {
            const response = await fetch(`${API_URL}/settings/toggle-registration`, {
                method: 'POST',
                headers: { 'Authorization': `Bearer ${token}`, 'Content-Type': 'application/json' },
            });
            const data = await response.json();
            if (!response.ok) throw new Error(data.message || 'Failed to toggle status.');
            
            setIsRegistrationOpen(data.isOpen);
            alert(data.message);
        } catch (err) {
            setError(err.message);
        } finally {
            setIsToggling(false);
        }
    };


    const handleSaveParticipant = async (formData) => {
        setIsSaving(true);
        setError('');
        
        const isUpdate = !!formData._id;
        const url = isUpdate ? `${API_URL}/participants/${formData._id}` : `${API_URL}/participants`;
        const method = isUpdate ? 'PUT' : 'POST';
        const payload = { ...formData, name: formData.fullName };
        delete payload.fullName;

        try {
            const response = await fetch(url, {
                method: method,
                headers: { 'Authorization': `Bearer ${token}`, 'Content-Type': 'application/json' },
                body: JSON.stringify(payload),
            });
            const data = await response.json();
            if (!response.ok) throw new Error(data.message || 'Failed to save participant.');
            
            setIsModalOpen(false);
            fetchParticipantData();
        } catch (err) {
            setError(err.message);
            alert(`Error: ${err.message}`);
        } finally {
            setIsSaving(false);
        }
    };

    const handleDelete = async () => {
        if (!selectedParticipant) return;
        setIsConfirmOpen(false);
        try {
            const response = await fetch(`${API_URL}/participants/${selectedParticipant._id}`, {
                method: 'DELETE',
                headers: { 'Authorization': `Bearer ${token}` },
            });
            if (!response.ok) throw new Error('Failed to delete participant.');
            fetchParticipantData();
        } catch (err) {
            setError(err.message);
        }
    };

    const handleExport = async () => {
        try {
            const response = await fetch(`${API_URL}/participants/export`, {
                headers: { 'Authorization': `Bearer ${token}` },
            });
            if (!response.ok) throw new Error('Failed to export data.');
            
            const blob = await response.blob();
            const url = window.URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.style.display = 'none';
            a.href = url;
            a.download = 'registrations.csv';
            document.body.appendChild(a);
            a.click();
            window.URL.revokeObjectURL(url);
            a.remove();
        } catch (err) {
            setError(err.message);
        }
    };

    useEffect(() => {
        if (token) {
            fetchRegistrationStatus();
            fetchParticipantData();
        }
    }, [token, fetchParticipantData, fetchRegistrationStatus]);

    const openCreateModal = () => {
        setSelectedParticipant(null);
        setIsModalOpen(true);
    };

    const openEditModal = (participant) => {
        setSelectedParticipant({ ...participant, fullName: participant.name });
        setIsModalOpen(true);
    };

    const openConfirmModal = (participant) => {
        setSelectedParticipant(participant);
        setIsConfirmOpen(true);
    };

    if (!token) {
        return (
            <div className="min-h-screen bg-[#0d0d0d] flex items-center justify-center text-white">
                <div className="w-full max-w-md p-8 space-y-6 bg-black/50 rounded-lg border border-fuchsia-500/50">
                    <h1 className="text-2xl font-bold text-center text-cyan-400">Admin Login</h1>
                    <form onSubmit={handleLogin} className="space-y-6">
                        <div><label className="text-sm font-bold text-slate-300">Email</label><input type="email" value={email} onChange={(e) => setEmail(e.target.value)} required className="w-full mt-2 px-4 py-2 bg-slate-900 border-2 border-slate-700 rounded-md focus:ring-fuchsia-500 focus:border-fuchsia-500"/></div>
                        <div><label className="text-sm font-bold text-slate-300">Password</label><input type="password" value={password} onChange={(e) => setPassword(e.target.value)} required className="w-full mt-2 px-4 py-2 bg-slate-900 border-2 border-slate-700 rounded-md focus:ring-fuchsia-500 focus:border-fuchsia-500"/></div>
                        <button type="submit" disabled={isLoading} className="w-full py-2 px-4 bg-cyan-400/20 text-cyan-300 border-2 border-cyan-400 rounded-md font-semibold hover:bg-cyan-400/30 transition-colors disabled:opacity-50">{isLoading ? 'Logging in...' : 'Login'}</button>
                        {error && <p className="text-red-500 text-sm text-center">{error}</p>}
                    </form>
                </div>
            </div>
        );
    }

    return (
        <>
            <ParticipantModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} onSave={handleSaveParticipant} participant={selectedParticipant} isLoading={isSaving} />
            <ConfirmModal isOpen={isConfirmOpen} onClose={() => setIsConfirmOpen(false)} onConfirm={handleDelete} title="Confirm Deletion" message={`Are you sure you want to delete participant: ${selectedParticipant?.name}? This action cannot be undone.`}/>

            <div className="min-h-screen bg-[#0d0d0d] text-slate-200 p-4 sm:p-6 lg:p-8">
                <div className="max-w-7xl mx-auto">
                    <div className="flex flex-wrap justify-between items-center mb-6 gap-4">
                        <h1 className="text-3xl font-bold text-cyan-400">Admin Dashboard</h1>
                        <div className="flex flex-wrap gap-4 items-center">
                            <button onClick={openCreateModal} className="px-4 py-2 bg-fuchsia-500/20 text-fuchsia-300 border-2 border-fuchsia-500 rounded-md font-semibold hover:bg-fuchsia-500/30 transition-colors">Add Participant</button>
                            <button onClick={handleToggleRegistration} disabled={isToggling} className={`px-4 py-2 rounded-md font-semibold border-2 transition-colors disabled:opacity-50 ${isRegistrationOpen ? 'bg-red-500/20 text-red-300 border-red-500 hover:bg-red-500/30' : 'bg-green-500/20 text-green-300 border-green-500 hover:bg-green-500/30'}`}>{isToggling ? 'Updating...' : (isRegistrationOpen ? 'Close Registration' : 'Open Registration')}</button>
                            <button onClick={handleExport} className="px-4 py-2 bg-blue-500/20 text-blue-300 border-2 border-blue-500 rounded-md font-semibold hover:bg-blue-500/30 transition-colors">Export CSV</button>
                            <button onClick={handleLogout} className="px-4 py-2 bg-slate-500/20 text-slate-300 border-2 border-slate-500 rounded-md font-semibold hover:bg-slate-500/30 transition-colors">Logout</button>
                        </div>
                    </div>
                    {error && <p className="text-red-500 text-sm mb-4">{error}</p>}
                    <div className="overflow-x-auto bg-black/50 rounded-lg border border-fuchsia-500/30">
                        <table className="min-w-full divide-y divide-slate-700">
                        <thead className="bg-slate-900/50">
                        <tr>
                            {[
                            { label: 'Name', key: 'name' },
                            { label: 'NIM', key: 'nim' },
                            { label: 'Binusian Email', key: 'binusianEmail' },
                            { label: 'Private Email', key: 'privateEmail' },
                            { label: 'Phone', key: 'phone' },
                            { label: 'Major', key: 'major' },
                            { label: 'Actions', key: null }
                            ].map(({ label, key }) => {
                            const isSorted = sortConfig.key === key;
                            const sortSymbol = isSorted
                                ? (sortConfig.direction === 'asc' ? '↑' : '↓')
                                : '⇅'; 

                            return (
                                <th
                                key={label}
                                className="px-6 py-3 text-left text-xs font-medium text-cyan-300 uppercase tracking-wider cursor-pointer select-none"
                                onClick={() => key && handleSort(key)}
                                >
                                {label} <span className="inline-block">{key ? sortSymbol : ''}</span>
                                </th>
                            );
                            })}
                        </tr>
                        </thead>

                            <tbody className="divide-y divide-slate-800">
                                {isLoading ? (
                                    <tr><td colSpan="7" className="text-center py-4">Loading data...</td></tr>
                                ) : [...participants].sort((a, b) => {
                                        if (!sortConfig.key) return 0;
                                        const valA = (a[sortConfig.key] || '').toString().toLowerCase();
                                        const valB = (b[sortConfig.key] || '').toString().toLowerCase();

                                        if (valA < valB) return sortConfig.direction === 'asc' ? -1 : 1;
                                        if (valA > valB) return sortConfig.direction === 'asc' ? 1 : -1;
                                        return 0;
                                    }).map(p => (

                                    <tr key={p._id} className="hover:bg-slate-800/50">
                                        <td className="px-6 py-4 whitespace-nowrap text-sm">{p.name}</td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm">{p.nim}</td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm">{p.binusianEmail}</td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm">{p.privateEmail}</td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm">{p.phone}</td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm">{p.major}</td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm">
                                            <button onClick={() => openEditModal(p)} className="text-white hover:text-gray-300 mr-4">Edit</button>
                                            <button onClick={() => openConfirmModal(p)} className="text-red-500 hover:text-red-400">Delete</button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </>
    );
}

export default AdminPage;
