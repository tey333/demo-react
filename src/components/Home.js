import React, { useState } from 'react';
import './Home.css';

const Home = () => {
  const [users, setUsers] = useState([]);
  const [newUser, setNewUser] = useState('');

  const handleAddUser = () => {
    if (newUser.trim()) {
      setUsers([...users, newUser]);
      setNewUser('');
    }
  };

  return (
    <div className="home-container">
      <h2>User Management</h2>
      <div className="add-user">
        <input
          type="text"
          placeholder="Enter new user"
          value={newUser}
          onChange={(e) => setNewUser(e.target.value)}
        />
        <button onClick={handleAddUser}>Add User</button>
      </div>
      <div className="user-list">
        <h3>User List</h3>
        <ul>
          {users.map((user, index) => (
            <li key={index}>{user}</li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default Home;
