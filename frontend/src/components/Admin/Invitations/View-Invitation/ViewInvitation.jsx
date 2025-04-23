import React, { useEffect, useState } from 'react';
import axios from 'axios';
import './ViewInvitation.css';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { FaPaperPlane, FaTrashAlt, FaEye, FaEdit } from 'react-icons/fa';
import { motion, AnimatePresence } from 'framer-motion';

const ViewInvitation = () => {
  const [invitations, setInvitations] = useState([]);
  const [selected, setSelected] = useState(null);
  const [editForm, setEditForm] = useState({});
  const [loadingId, setLoadingId] = useState(null); // <-- loading state

  useEffect(() => {
    fetchInvitations();
  }, []);

  const fetchInvitations = async () => {
    try {
      const response = await axios.get('https://register-event-cwsv.onrender.com/api/invitations');
      const currentDate = new Date();
      const filtered = response.data.filter(inv => {
        const expiry = new Date(inv.createdAt);
        expiry.setDate(expiry.getDate() + 15);
        return expiry > currentDate;
      });
      setInvitations(filtered);
    } catch (error) {
      toast.error('Failed to fetch invitations');
    }
  };

  const handleDelete = async (id) => {
    try {
      await axios.delete(`https://register-event-cwsv.onrender.com/api/invitations/${id}`);
      setInvitations(invitations.filter(inv => inv._id !== id));
      toast.success('Invitation deleted');
    } catch (error) {
      toast.error('Error deleting invitation');
    }
  };

  const handleUpdate = async () => {
    try {
      const res = await axios.put(
        `https://register-event-cwsv.onrender.com/api/invitations/${selected._id}`,
        editForm
      );
      setInvitations(prev =>
        prev.map(inv => (inv._id === selected._id ? { ...inv, ...editForm } : inv))
      );
      toast.success('Invitation updated');
      setSelected(null);
    } catch (error) {
      toast.error('Error updating invitation');
    }
  };

  const sendInvitationToAllUsers = async (id) => {
    setLoadingId(id);
    try {
      const res = await axios.post(`https://register-event-cwsv.onrender.com/api/invitations/send/${id}`);
      toast.success('Invitations sent successfully!');
    } catch (error) {
      toast.error(
        error.response?.data?.message || 'Failed to send invitations. Try again later.'
      );
    } finally {
      setLoadingId(null);
    }
  };

  return (
    <motion.div
      className="invitation-card-container"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 1 }}
    >
      <h2>All Invitations</h2>
      <div className="card-grid">
        <AnimatePresence>
          {invitations.map((inv, index) => {
            const expiry = new Date(inv.createdAt);
            expiry.setDate(expiry.getDate() + 15);
            return (
              <motion.div
                key={inv._id}
                className="invitation-card"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95 }}
                transition={{
                  duration: 0.3,
                  delay: index * 0.1,
                }}
              >
                <h3>{inv.title}</h3>
                <p><strong>Date:</strong> {inv.date}</p>
                <p><strong>Time:</strong> {inv.time}</p>
                <p><strong>Expiry Date:</strong> {expiry.toLocaleDateString()}</p>
                <div className="card-buttons">
                  <button
                    className="send-btn"
                    onClick={() => sendInvitationToAllUsers(inv._id)}
                    disabled={loadingId === inv._id}
                  >
                    {loadingId === inv._id ? (
                      <>
                        <span className="spinner" /> Sending...
                      </>
                    ) : (
                      <>
                        <FaPaperPlane /> Send
                      </>
                    )}
                  </button>
                  <button className="view-btn" onClick={() => setSelected(inv)}>
                    <FaEye /> View
                  </button>
                  <button className="delete-btn" onClick={() => handleDelete(inv._id)}>
                    <FaTrashAlt /> Delete
                  </button>
                </div>
              </motion.div>
            );
          })}
        </AnimatePresence>
      </div>

      <AnimatePresence>
        {selected && (
          <motion.div
            className="modal-overlay"
            onClick={() => setSelected(null)}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <motion.div
              className="modal"
              onClick={(e) => e.stopPropagation()}
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.8, opacity: 0 }}
              transition={{ duration: 0.3 }}
            >
              <h2>Edit Invitation</h2>
              {['title', 'date', 'time', 'venue', 'tagline', 'website'].map((field) => (
                <input
                  key={field}
                  type="text"
                  placeholder={field.charAt(0).toUpperCase() + field.slice(1)}
                  value={editForm[field] ?? selected[field]}
                  onChange={(e) =>
                    setEditForm((prev) => ({ ...prev, [field]: e.target.value }))
                  }
                />
              ))}
              <p><strong>Expiry Date:</strong> {new Date(new Date(selected.createdAt).setDate(new Date(selected.createdAt).getDate() + 15)).toLocaleDateString()}</p>
              <div className="modal-buttons">
                <button onClick={handleUpdate}>
                  <FaEdit /> Update
                </button>
                <button onClick={() => setSelected(null)}>Cancel</button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};

export default ViewInvitation;
