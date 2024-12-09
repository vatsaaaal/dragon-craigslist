import { useEffect } from "react";
import axios from "axios";

export const fetchUserId = async () => {
  const API_URL = import.meta.env.VITE_API_URL || "http://localhost:3000";
    try {
      const response = await axios.get(`${API_URL}/users/me`, {
        withCredentials: true, // Include authentication cookies
      });
  
      if (response.data && response.data.user_id) {
        return response.data; // Return the full user object
      } else {
        console.error("No user ID found in the response.");
        return null; // Explicitly return null if user_id is missing
      }
    } catch (error) {
      console.error("Error fetching user information:", error.message);
      return null; // Return null in case of an error
    }
  };
  