// frontend/src/components/Admin/Invitations/SendInvitation.js
import axios from 'axios';
import { toast } from 'react-toastify';

export const sendInvitationToAllUsers = async (invitationId) => {
  try {
    const res = await axios.post(`https://register-event-cwsv.onrender.com/api/invitations/send/${invitationId}`);
    toast.success(res.data.message || 'Invitations sent successfully!');
  } catch (error) {
    toast.error(
      error.response?.data?.message || 'Failed to send invitations. Try again later.'
    );
  }
};
