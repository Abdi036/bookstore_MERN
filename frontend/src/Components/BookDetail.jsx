import React, { useEffect, useState, useContext } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import axios from "../../axios";
import Button from "./Button";
import { BookContext } from "../App";
import Modal from "./Modal";
import Popup from "./Popup";

export default function BookDetail() {
  const { id } = useParams();
  const { books, setBooks } = useContext(BookContext);
  const [book, setBook] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [updatedBook, setUpdatedBook] = useState({});
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [isNotificationVisible, setIsNotificationVisible] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchBook = async () => {
      try {
        const response = await axios.get(`/books/${id}`);
        setBook(response.data);
        setUpdatedBook(response.data);
      } catch (error) {
        console.error("Error fetching book:", error);
      }
    };

    fetchBook();
  }, [id]);

  if (!book) {
    return <div>Loading...</div>;
  }

  const handleUpdate = async () => {
    try {
      const response = await axios.patch(`/books/${id}`, updatedBook);
      const updatedData = books.map((b) => (b._id === id ? response.data : b));
      setBooks(updatedData);
      setBook(response.data);
      setIsEditing(false);

      setIsNotificationVisible(true);
      setTimeout(() => {
        setIsNotificationVisible(false);
      }, 2000);
    } catch (error) {
      console.error("Error updating book:", error);
    }
  };

  const handleDelete = async () => {
    try {
      await axios.delete(`/books/${id}`);
      const updatedData = books.filter((b) => b._id !== id);
      setBooks(updatedData);
      navigate("/");

      setIsNotificationVisible(true);
      setTimeout(() => {
        setIsNotificationVisible(false);
      }, 2000);
    } catch (error) {
      console.error("Error deleting book:", error);
    }
  };

  return (
    <div className="w-full h-screen flex flex-col items-center justify-center bg-slate-100 relative">
      <div className="w-9/12 bg-white shadow-md rounded-md p-5 flex flex-col">
        <div className="flex justify-between">
          <Link to="/">
            <Button>&larr; Back</Button>
          </Link>
        </div>
        <h1 className="text-3xl font-bold mt-5">{book.title}</h1>

        {isEditing ? (
          <>
            <label className="mt-4">Title:</label>
            <input
              type="text"
              value={updatedBook.title}
              onChange={(e) =>
                setUpdatedBook({ ...updatedBook, title: e.target.value })
              }
            />
            <label className="mt-4">Author:</label>
            <input
              type="text"
              value={updatedBook.author}
              onChange={(e) =>
                setUpdatedBook({ ...updatedBook, author: e.target.value })
              }
            />
            <label className="mt-4">Publication Year:</label>
            <input
              type="number"
              value={updatedBook.publishYear}
              onChange={(e) =>
                setUpdatedBook({
                  ...updatedBook,
                  publishYear: e.target.value,
                })
              }
            />
            <label className="mt-4">Genre:</label>
            <input
              type="text"
              value={updatedBook.Genre}
              onChange={(e) =>
                setUpdatedBook({ ...updatedBook, Genre: e.target.value })
              }
            />
            <label className="mt-4">Description:</label>
            <textarea
              value={updatedBook.Description}
              onChange={(e) =>
                setUpdatedBook({
                  ...updatedBook,
                  Description: e.target.value,
                })
              }
            />
            <Button onClick={handleUpdate} className="mt-4">
              Save Changes
            </Button>
          </>
        ) : (
          <>
            <h2 className="text-xl font-semibold mt-4">
              Author: {book.author}
            </h2>
            <p className="mt-2">Published Year: {book.publishYear}</p>
            <p className="mt-2">Genre: {book.Genre}</p>
            <p className="mt-2">Description: {book.Description}</p>
          </>
        )}

        <div className="py-5">
          <Button className="mx-5" onClick={() => setIsEditing(!isEditing)}>
            {isEditing ? "Cancel" : "Edit"}
          </Button>
          <Button onClick={() => setIsDeleteModalOpen(true)}>Delete</Button>
        </div>
      </div>
      <Modal
        isOpen={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
      >
        <div className="p-5">
          <h2 className="text-xl font-bold mb-4">
            Are you sure you want to delete this book?
          </h2>
          <div className="flex justify-between">
            <Button onClick={() => setIsDeleteModalOpen(false)}>Cancel</Button>
            <Button onClick={handleDelete}>Delete</Button>
          </div>
        </div>
      </Modal>
      {isNotificationVisible && (
        <Popup className="fixed bottom-4 left-4 bg-green-400 text-white p-4 rounded shadow-lg">
          Book Edited successfully
        </Popup>
      )}
    </div>
  );
}
