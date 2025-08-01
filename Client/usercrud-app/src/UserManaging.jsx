import React, { useState, useEffect, useRef } from "react";
import axios from "axios";


function UserManaging() {
  const scrollRef = useRef(null); // 👈 useRef for userList div


  const [userList, setUserList] = useState([]);
  const [userName, setUserName] = useState('');
  const [userEmail, setUserEmail] = useState('');
  const [userCity, setUserCity] = useState('');
  const [selectedUserId, setSelectedUserId] = useState(null);

  const baseUrl = `https://localhost:7131/api/User`


  const getApi = async()=>{
    try{
        let apiResponse = await axios.get(baseUrl)

        console.log(apiResponse)

        if(apiResponse){
          setUserList(apiResponse.data)
        }
    }
    catch(e){
        console.log(e)
    }
  }
  useEffect(() =>{
    getApi()
  },[])

  const clearForm = () => {
    setUserName('');
    setUserEmail('');
    setUserCity('');
    setSelectedUserId(null)
  };

  const createUser = async (e) => {
    e.preventDefault();
    const newUser = {
      name: userName,
      email: userEmail, 
      city: userCity
    };
    let apiResponse = null;
    let apiUrl = null;
      try{
          if(selectedUserId){
            apiUrl = `${baseUrl}/${selectedUserId}`
            newUser["id"] = selectedUserId
            apiResponse = await axios.put(apiUrl,newUser)
          }else{
            apiUrl = `${baseUrl}`
            apiResponse = await axios.post(apiUrl,newUser)
          }
      }
      catch(e){
        console.log(e)
      }
    // console.log(selectedUserId)

    // setUserList(prevList => [...prevList, newUser]);
    setSelectedUserId(null);
    clearForm();
    getApi();
  };
  const updateAction = async (userId)=>{
    // let user =userList[index]
    setSelectedUserId(userId)

    let apiUrl = `${baseUrl}/${userId}`
    try{
        const apiResponse = await axios.get(apiUrl)
        console.log(apiResponse)
        const user = apiResponse.data
        setUserName(user.name)
        setUserEmail(user.email)
        setUserCity(user.city)  
    }
    catch(e){
      console.log(e)
    }

  }
  const deleteAction = async(id)=>{

    const confirmDelete = window.confirm("Are you sure you want to delete this user?");
     if (!confirmDelete) return; 


    let apiUrl = `${baseUrl}/${id}`
    try{
        let apiResponse = await axios.delete(apiUrl)
    }
    catch(e){
      console.log(e)
    }
    getApi();

      console.log(`Deleted User ${id}`)
  }

  return (
    <div>
      <h1>User Management</h1>
      <div className="main-container">
        <div className="createUser">
          <h2 className="heading">Create User</h2>
          <form className="registerForm" onSubmit={createUser}>
            <input
              className="input-style"
              value={userName}
              type="text"
              placeholder="Enter Your Name"
              onChange={(e) => setUserName(e.target.value)}
            />
            <input
              className="input-style"
              value={userEmail}
              type="email"
              placeholder="Enter Your Mail"
              onChange={(e) => setUserEmail(e.target.value)}
            />
            <input
              className="input-style"
              value={userCity}
              type="text"
              placeholder="Enter Your City"
              onChange={(e) => setUserCity(e.target.value)}
            />
            <button type="submit">{selectedUserId?"Update User":"Add User"}</button>
            <button type="button" onClick={clearForm}>Clear Form</button>
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
                    <button className="listBtn" onClick={()=>{updateAction(user.id)}}>Edit</button>
                    <button className="listBtn" onClick={()=>{deleteAction(user.id)}}>Delete</button>
                  </div>
                ))}
              </div>
            </div>
      </div>
    </div>
  );
}

export default UserManaging;
