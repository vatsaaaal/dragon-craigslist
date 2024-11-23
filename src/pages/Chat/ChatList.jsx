import React, { useEffect, useState } from "react";
import { fetchUserId } from "../../hooks/useFetchUserId";
import axios from "axios";

const ChatList = () => {
  const [users, setUsers] = useState([]); // State to store user data
  const [currentUserId, setCurrentUserId] = useState(null); // State to store the current user ID
  const [error, setError] = useState(null);

  // Fetch user ID and associated users when component mounts
  useEffect(() => {
    const fetchUsers = async () => {
      try {
        // Fetch current user ID
        const user = await fetchUserId();
        if (user) {
          setCurrentUserId(user.user_id); // Store user ID in state

          // Fetch users the account has talked with
          const response = await axios.get(`http://localhost:3000/messages/past_user`, {
            withCredentials: true,
          });

          if (response.data && Array.isArray(response.data)) {
            setUsers(response.data); // Store user data in state
          } else {
            console.error("Failed to retrieve users from server");
          }
        }
      } catch (error) {
        setError("Error fetching users.");
        console.error("Error fetching users:", error);
      }
    };

    fetchUsers();
  }, []);

  return (
    <div className="user-list">
      <h3>Users You’ve Talked With</h3>
      {currentUserId && <p>Welcome, User {currentUserId}</p>}
      {error && <p className="error-message">{error}</p>}
      <ul>
        {users.length > 0 ? (
          users.map((user) => (
            <li key={user.user_id}>
              <strong>{user.username}</strong> (ID: {user.user_id})
            </li>
          ))
        ) : (
          !error && <p>No users available.</p>
        )}
      </ul>
    </div>
  );
};

export default ChatList;