import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import axiosInstance from '../axiosConfig';

const LoanForm = ({ loans, setLoans, editingLoan, setEditingLoan }) => {
  const { user } = useAuth();
  const [formData, setFormData] = useState({ book: '', member: '', loanDate: '', returned: '' });
  const [books, setBooks] = useState([]);
  const [members, setMembers] = useState([]);

  useEffect(() => {
    const fetchBooksAndMembers = async () => {
      try {
        const [booksResponse, membersResponse] = await Promise.all([
          axiosInstance.get('/api/books', {
            headers: { Authorization: `Bearer ${user.token}` }
          }),
          axiosInstance.get('/api/members', {
            headers: { Authorization: `Bearer ${user.token}` }
          })
        ]);
        setBooks(booksResponse.data);
        setMembers(membersResponse.data);
      } catch (error) {
        alert('Failed to fetch books and members:', error);
      }
    };

    fetchBooksAndMembers();
  }, [user.token]);

  useEffect(() => {
    if (editingLoan) {
      const bookId = typeof editingLoan.book === 'object' ? editingLoan.book._id : editingLoan.book;
      const memberId = typeof editingLoan.member === 'object' ? editingLoan.member._id : editingLoan.member;
      
      const formattedDate = editingLoan.loanDate ? 
        new Date(editingLoan.loanDate).toISOString().split('T')[0] : '';
      
      setFormData({
        book: bookId,
        member: memberId,
        loanDate: formattedDate,
        returned: editingLoan.returned.toString(),
      });
    } else {
      setFormData({ book: '', member: '', loanDate: '', returned: '' });
    }
  }, [editingLoan]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingLoan) {
        const response = await axiosInstance.put(`/api/loans/${editingLoan._id}`, formData, {
          headers: { Authorization: `Bearer ${user.token}` },
        });
        setLoans(loans.map((loan) => (loan._id === response.data._id ? response.data : loan)));
      } else {
        const response = await axiosInstance.post('/api/loans', formData, {
          headers: { Authorization: `Bearer ${user.token}` },
        });
        setLoans([...loans, response.data]);
      }
      setEditingLoan(null);
      setFormData({ book: '', member: '', loanDate: '', returned: '' });
    } catch (error) {
      alert('Failed to save loan.');
    }
  };

  return (
    <form onSubmit={handleSubmit} className="bg-white p-6 shadow-md rounded mb-6">
      <h1 className="text-2xl font-bold mb-4">{editingLoan ? 'Edit Loan' : 'Add Loan'}</h1>
      <select
        value={formData.book}
        onChange={(e) => setFormData({ ...formData, book: e.target.value })}
        className="w-full mb-4 p-2 border rounded"
        required
      >
        <option value="">Select a Book</option>
        {books.map((book) => (
          <option key={book._id} value={book._id}>
            {book.title} by {book.author}
          </option>
        ))}
      </select>
      <select
        value={formData.member}
        onChange={(e) => setFormData({ ...formData, member: e.target.value })}
        className="w-full mb-4 p-2 border rounded"
        required
      >
        <option value="">Select a Member</option>
        {members.map((member) => (
          <option key={member._id} value={member._id}>
            {member.firstName} {member.lastName}
          </option>
        ))}
      </select>
      <input
        type="date"
        value={formData.loanDate}
        onChange={(e) => setFormData({ ...formData, loanDate: e.target.value })}
        className="w-full mb-4 p-2 border rounded"
        required
      />
      <select
        value={formData.returned}
        onChange={(e) => setFormData({ ...formData, returned: e.target.value })}
        className="w-full mb-4 p-2 border rounded"
        required
      >
        <option value="">Select Status</option>
        <option value="true">Returned</option>
        <option value="false">Not Returned</option>
      </select>
      <button type="submit" className="w-full bg-emerald-700 text-white p-2 rounded">
        {editingLoan ? 'Update Loan' : 'Add Loan'}
      </button>
    </form>
  );
};

export default LoanForm;
