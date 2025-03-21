import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import axiosInstance from '../axiosConfig';

const BookForm = ({ books, setBooks, editingBook, setEditingBook }) => {
  const { user } = useAuth();
  const [formData, setFormData] = useState({ title: '', author: '', isbn: '', description: '' });

  useEffect(() => {
    if (editingBook) {
      setFormData({
        title: editingBook.title,
        author: editingBook.author,
        isbn: editingBook.isbn,
        description: editingBook.description,
      });
    } else {
      setFormData({ title: '', author: '', isbn: '', description: '' });
    }
  }, [editingBook]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingBook) {
        const response = await axiosInstance.put(`/api/books/${editingBook._id}`, formData, {
          headers: { Authorization: `Bearer ${user.token}` },
        });
        setBooks(books.map((book) => (book._id === response.data._id ? response.data : book)));
      } else {
        const response = await axiosInstance.post('/api/books', formData, {
          headers: { Authorization: `Bearer ${user.token}` },
        });
        setBooks([...books, response.data]);
      }
      setEditingBook(null);
      setFormData({ title: '', author: '', isbn: '', description: '' });
    } catch (error) {
      alert('Failed to save book.');
    }
  };

  return (
    <form onSubmit={handleSubmit} className="bg-white p-6 shadow-md rounded mb-6">
      <h1 className="text-2xl font-bold mb-4">{editingBook ? 'Edit Book' : 'Add Book'}</h1>
      <input
        type="text"
        placeholder="Title"
        value={formData.title}
        onChange={(e) => setFormData({ ...formData, title: e.target.value })}
        className="w-full mb-4 p-2 border rounded"
      />
      <input
        type="text"
        placeholder="Author"
        value={formData.author}
        onChange={(e) => setFormData({ ...formData, author: e.target.value })}
        className="w-full mb-4 p-2 border rounded"
      />
      <input
        type="text"
        placeholder="ISBN"
        value={formData.isbn}
        onChange={(e) => setFormData({ ...formData, isbn: e.target.value })}
        className="w-full mb-4 p-2 border rounded"
      />
      <input
        type="text"
        placeholder="Description"
        value={formData.description}
        onChange={(e) => setFormData({ ...formData, description: e.target.value })}
        className="w-full mb-4 p-2 border rounded"
      />
      <button type="submit" className="w-full bg-emerald-700 text-white p-2 rounded">
        {editingBook ? 'Update Book' : 'Add Book'}
      </button>
    </form>
  );
};

export default BookForm;
