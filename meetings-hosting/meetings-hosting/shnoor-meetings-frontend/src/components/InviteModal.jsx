import { Copy, X, Check, Share2, Mail, Loader2 } from 'lucide-react';
import { useState } from 'react';
import api from '../api/axios';

export default function InviteModal({ isOpen, onClose, roomId }) {
  const [copied, setCopied] = useState(false);
  const [email, setEmail] = useState('');
  const [isSending, setIsSending] = useState(false);
  const [status, setStatus] = useState(null); // { type: 'success' | 'error', message: string }

  if (!isOpen) return null;

  const inviteLink = `${window.location.origin}/room/${roomId}?role=participant`;

  const handleCopy = () => {
    navigator.clipboard.writeText(inviteLink);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleSendInvite = async (e) => {
    e.preventDefault();
    if (!email) return;

    setIsSending(true);
    setStatus(null);

    try {
      const response = await api.post('/api/notifications/send-invite', {
        email: email,
        meeting_link: inviteLink
      });
      
      setStatus({ type: 'success', message: response.data.message || 'Invitation sent!' });
      setEmail('');
    } catch (err) {
      console.error('Failed to send invite:', err);
      setStatus({ 
        type: 'error', 
        message: err.response?.data?.detail || 'Failed to send email. Check SMTP settings.' 
      });
    } finally {
      setIsSending(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
      <div className="bg-gray-800 border border-gray-700 rounded-2xl p-6 w-full max-w-md shadow-2xl animate-in fade-in zoom-in duration-200 text-white">
        
        <div className="flex justify-between items-start mb-4">
          <h2 className="text-xl font-bold">Your meeting's ready</h2>
          <button onClick={onClose} className="text-gray-400 hover:text-white p-1 rounded-full hover:bg-gray-700 transition">
            <X size={20} />
          </button>
        </div>

        <p className="text-gray-400 text-sm mb-6">
          Share this meeting link with others you want in the meeting.
        </p>

        {/* Copy Link Section */}
        <div className="flex items-center gap-2 bg-gray-900 rounded-lg p-2 border border-gray-700 mb-6">
          <input 
            type="text" 
            readOnly 
            value={inviteLink}
            className="flex-1 bg-transparent border-none text-gray-300 px-2 outline-none text-sm"
          />
          <button 
            onClick={handleCopy}
            className="flex items-center gap-2 text-sm bg-blue-600 hover:bg-blue-500 transition px-4 py-2 rounded-md font-medium"
          >
            {copied ? <Check size={16} /> : <Copy size={16} />}
            {copied ? 'Copied!' : 'Copy'}
          </button>
        </div>

        {/* Email Invite Section */}
        <div className="border-t border-gray-700 pt-6 mt-2 mb-6">
          <h3 className="text-sm font-semibold text-gray-300 mb-3 flex items-center gap-2">
            <Mail size={16} className="text-blue-400" />
            Invite by Email
          </h3>
          <form onSubmit={handleSendInvite} className="flex flex-col gap-3">
            <input 
              type="email" 
              placeholder="Enter email address" 
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full bg-gray-900 border border-gray-700 rounded-lg px-4 py-2.5 text-sm text-gray-200 outline-none focus:border-blue-500 transition-colors"
            />
            <button 
              type="submit"
              disabled={isSending || !email}
              className="flex items-center justify-center gap-2 text-sm bg-blue-600 hover:bg-blue-500 disabled:bg-gray-700 disabled:text-gray-500 transition px-4 py-2.5 rounded-lg font-bold"
            >
              {isSending ? <Loader2 size={18} className="animate-spin" /> : 'Send Invitation'}
            </button>
          </form>

          {status && (
            <div className={`mt-3 text-xs font-medium px-3 py-2 rounded-md ${status.type === 'success' ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20' : 'bg-red-500/10 text-red-400 border border-red-500/20'}`}>
              {status.message}
            </div>
          )}
        </div>

        <button
          onClick={async () => {
            if (navigator.share) {
              try {
                await navigator.share({
                  title: 'Join my Shnoor Meeting',
                  text: 'Please join my meeting on Shnoor Meetings:',
                  url: inviteLink,
                });
              } catch (err) {
                console.error('Error sharing:', err);
              }
            } else {
              handleCopy();
            }
          }}
          className="w-full flex items-center justify-center gap-2 text-sm bg-gray-700 hover:bg-gray-600 transition px-4 py-2 text-white rounded-md font-medium"
        >
          <Share2 size={16} />
          Share via App
        </button>
      </div>
    </div>
  );
}
