import { useEffect } from "react";
import axios from "axios";

export const fetchUserId = async () => {
    try {
      const response = await axios.get("http://localhost:3000/users/me", {
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
  