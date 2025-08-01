import React, { useState, useEffect, useCallback } from "react";
import axios from "axios";

function UserManaging() {
  const [userList, setUserList] = useState([]);
  const [userName, setUserName] = useState('');
  const [userEmail, setUserEmail] = useState('');
  const [userCity, setUserCity] = useState('');
  const [selectedUserId, setSelectedUserId] = useState(null);

  // ✅ Backend hosted on Render
  const baseUrl = `https://userapi-hqvf.onrender.com/api/User`;

  // ✅ Fetch all users
  const getApi = useCallback(async () => {
    try {
      const apiResponse = await axios.get(baseUrl);
      if (apiResponse) {
        setUserList(apiResponse.data);
      }
    } catch (e) {
      console.log("Error fetching users:", e);
    }
  }, [baseUrl]);

  useEffect(() => {
    getApi();
  }, [getApi]);

  const clearForm = () => {
    setUserName('');
    setUserEmail('');
    setUserCity('');
    setSelectedUserId(null);
  };

  // ✅ Create or Update user
  const createUser = async (e) => {
    e.preventDefault();
    const newUser = {
      name: userName,
      email: userEmail,
      city: userCity
    };

    try {
      if (selectedUserId) {
        // Update user
        const apiUrl = `${baseUrl}/${selectedUserId}`;
        newUser["id"] = selectedUserId;
        await axios.put(apiUrl, newUser);
      } else {
        // Create user
        await axios.post(baseUrl, newUser);
      }
    } catch (e) {
      console.log("Error creating/updating user:", e);
    }

    clearForm();
    getApi();
  };

  // ✅ Fetch user data for editing
  const updateAction = async (userId) => {
    setSelectedUserId(userId);
    const apiUrl = `${baseUrl}/${userId}`;
    try {
      const apiResponse = await axios.get(apiUrl);
      const user = apiResponse.data;
      setUserName(user.name);
      setUserEmail(user.email);
      setUserCity(user.city);
    } catch (e) {
      console.log("Error loading user for update:", e);
    }
  };

  // ✅ Delete user
  const deleteAction = async (id) => {
    const confirmDelete = window.confirm("Are you sure you want to delete this user?");
    if (!confirmDelete) return;

    try {
      const apiUrl = `${baseUrl}/${id}`;
      await axios.delete(apiUrl);
      getApi();
      console.log(`Deleted User ${id}`);
    } catch (e) {
      console.log("Error deleting user:", e);
    }
  };

  return (
    <div>
      <h1>User Management</h1>
      <div className="main-container">
        <div className="createUser">
          <h2 className="heading">{selectedUserId ? "Update User" : "Create User"}</h2>
          <form className="registerForm" onSubmit={createUser}>
            <input
              className="input-style"
              value={userName}
              type="text"
              placeholder="Enter Your Name"
              onChange={(e) => setUserName(e.target.value)}
              required
            />
            <input
              className="input-style"
              value={userEmail}
              type="email"
              placeholder="Enter Your Email"
              onChange={(e) => setUserEmail(e.target.value)}
              required
            />
            <input
              className="input-style"
              value={userCity}
              type="text"
              placeholder="Enter Your City"
              onChange={(e) => setUserCity(e.target.value)}
              required
            />
            <button type="submit">
              {selectedUserId ? "Update User" : "Add User"}
            </button>
            <button type="button" onClick={clearForm}>
              Clear Form
            </button>
          </form>
        </div>

        <div className="createdUser">
          <h2 className="heading">User List</h2>
          <div className="userList">
            {userList.map((user, index) => (
              <div key={index} className="user-card">
                <p><strong>Name:</strong> {user.name}</p>
                <p><strong>Email:</strong> {user.email}</p>
                <p><strong>City:</strong> {user.city}</p>
                <button className="listBtn" onClick={() => updateAction(user.id)}>Edit</button>
                <button className="listBtn" onClick={() => deleteAction(user.id)}>Delete</button>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

export default UserManaging;
