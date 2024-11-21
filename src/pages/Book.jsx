import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";

function Book() {
  const { id } = useParams(); // Get the book ID from the URL
  const [book, setBook] = useState(null); // State to hold book details
  const [loggedInUserId, setLoggedInUserId] = useState(null); // State to hold the logged-in user's ID

  // Fetch the logged-in user's ID
  useEffect(() => {
    const fetchLoggedInUser = async () => {
      try {
        const response = await axios.get(
          "http://localhost:3000/users/auth-check",
          {
            withCredentials: true, // Ensure cookies are included
          }
        );
        if (response.data.loggedIn) {
          setLoggedInUserId(response.data.userId);
          console.log("Logged-in User ID:", response.data.userId);
        } else {
          console.log("User not logged in.");
        }
      } catch (error) {
        console.error("Error fetching logged-in user:", error);
      }
    };

    fetchLoggedInUser();
  }, []);

  // Fetch the book details
  useEffect(() => {
    const fetchBookDetails = async () => {
      try {
        const response = await axios.get(
          `http://localhost:3000/products/${id}`
        );
        setBook(response.data);
      } catch (error) {
        console.error("Error fetching book details:", error);
      }
    };

    fetchBookDetails();
  }, [id]);

  if (!book) {
    return <div>Loading...</div>;
  }

  return (
    <div>
      <h1>{book.title}</h1>
      <p>Author: {book.author}</p>
      <p>Price: ${book.price}</p>
      <p>Description: {book.description}</p>
      <p>Condition: {book.condition}</p>
      <p>Category: {book.genre}</p>

      {/* Show buttons only if the logged-in user is the book's creator */}
      {loggedInUserId === book.user_id && (
        <div>
          <button>Edit</button>
          <button>Delete</button>
        </div>
      )}
    </div>
  );
}

export default Book;
