import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import axiosInstance from '../axiosConfig';

const MemberForm = ({ members, setMembers, editingMember, setEditingMember }) => {
  const { user } = useAuth();
  const [formData, setFormData] = useState({ firstName: '', lastName: '', address: '', email: '', phone: '' });

  useEffect(() => {
    if (editingMember) {
      setFormData({
        firstName: editingMember.firstName,
        lastName: editingMember.lastName,
        address: editingMember.address,
        email: editingMember.email,
        phone: editingMember.phone,
      });
    } else {
      setFormData({ firstName: '', lastName: '', address: '', email: '', phone: '' });
    }
  }, [editingMember]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingMember) {
        const response = await axiosInstance.put(`/api/members/${editingMember._id}`, formData, {
          headers: { Authorization: `Bearer ${user.token}` },
        });
        setMembers(members.map((member) => (member._id === response.data._id ? response.data : member)));
      } else {
        const response = await axiosInstance.post('/api/members', formData, {
          headers: { Authorization: `Bearer ${user.token}` },
        });
        setMembers([...members, response.data]);
      }
      setEditingMember(null);
      setFormData({ firstName: '', lastName: '', address: '', email: '', phone: '' });
    } catch (error) {
      alert('Failed to save member.');
    }
  };

  return (
    <form onSubmit={handleSubmit} className="bg-white p-6 shadow-md rounded mb-6">
      <h1 className="text-2xl font-bold mb-4">{editingMember ? 'Edit Member' : 'Add Member'}</h1>
      <input
        type="text"
        placeholder="First Name"
        value={formData.firstName}
        onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
        className="w-full mb-4 p-2 border rounded"
      />
      <input
        type="text"
        placeholder="Last Name"
        value={formData.lastName}
        onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
        className="w-full mb-4 p-2 border rounded"
      />
      <input
        type="text"
        placeholder="Address"
        value={formData.address}
        onChange={(e) => setFormData({ ...formData, address: e.target.value })}
        className="w-full mb-4 p-2 border rounded"
      />
      <input
        type="text"
        placeholder="Email"
        value={formData.email}
        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
        className="w-full mb-4 p-2 border rounded"
      />
      <input
        type="text"
        placeholder="Phone"
        value={formData.phone}
        onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
        className="w-full mb-4 p-2 border rounded"
      />
      <button type="submit" className="w-full bg-emerald-700 text-white p-2 rounded">
        {editingMember ? 'Update Member' : 'Add Member'}
      </button>
    </form>
  );
};

export default MemberForm;
