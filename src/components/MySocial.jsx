import React, { useState } from "react";
import LoginImage from "../images/login-image.svg";

import user1 from "../images/user1.svg";
import user2 from "../images/user2.svg";
import user3 from "../images/user3.svg";
import user4 from "../images/user4.svg";
import user5 from "../images/user5.svg";

const users = [
  // Record # 1
  {
    id: 1,
    username: "Saboor Malik",
    post: [
      {
        postId: 101,
        postTitle: "Hello Java",
        postPicture: user1,
      },
    ],
    requests: [],
    firends: [],
  },
  // Record # 2
  {
    id: 2,
    username: "Ali Mehroz",
    post: [
      {
        postId: 102,
        postTitle: "Hello JavaScript",
        postPicture: user2,
      },
    ],
    requests: [],
    firends: [],
  },
  // Record # 3
  {
    id: 3,
    username: "Hassan Shaigan",
    post: [
      {
        postId: 103,
        postTitle: "Coding is Fun",
        postPicture: user3,
      },
    ],
    requests: [],
    firends: [],
  },
  // Record # 4
  {
    id: 4,
    username: "Ali Rooshan",
    post: [
      {
        postId: 104,
        postTitle: "Hello i'm a Full Stack Developer",
        postPicture: user4,
      },
    ],
    requests: [],
    firends: [],
  },
  // Record # 5
  {
    id: 5,
    username: "Mustehsan Ali",
    post: [
      {
        postId: 105,
        postTitle: "Hello i'm a Python Developer",
        postPicture: user5,
      },
    ],
    requests: [],
    firends: [],
  },
];

// Simulated global state (acting as a database)
let globalSentRequests = []; // Stores friend requests
let globalFriends = []; // Stores accepted friends

const MySocial = () => {
  const [userId, setUserId] = useState("");
  
  const [loggedInUser, setLoggedInUser] = useState(null);

  const [modalContent, setModalContent] = useState(null);
  const [sentRequests, setSentRequests] = useState([]); // Sent friend requests
  const [pendingRequests, setPendingRequests] = useState([]); // Received friend requests
  const [friends, setFriends] = useState([]); // Friends list
  
  
  const handleLogin = () => {
    const user = users.find((u) => u.id === parseInt(userId));
    if (user) {
      setLoggedInUser(user);

      // Load sent requests for this user
      setSentRequests(
        globalSentRequests.filter((req) => req.from.id === user.id)
      );

      // Load pending requests (requests where this user is the recipient)
      setPendingRequests(
        globalSentRequests.filter((req) => req.to.id === user.id)
      );

      // Load accepted friends
      setFriends(
        globalFriends
          .filter((pair) => pair.includes(user.id))
          .map((pair) =>
            users.find(
              (u) => u.id === (pair[0] === user.id ? pair[1] : pair[0])
            )
          )
      );
    } else {
      alert("User not found");
    }
  };

  const handleLogout = () => {
    setLoggedInUser(null);
    setUserId("");
    setModalContent(null);
    setSentRequests([]);
    setPendingRequests([]);
    setFriends([]);
  };

  const openModal = (content) => setModalContent(content);
  const closeModal = () => setModalContent(null);

  const handleAddFriend = (user) => {
    const request = { from: loggedInUser, to: user };
    globalSentRequests.push(request);
    setSentRequests([...sentRequests, request]);
  };

  const handleCancelRequest = (user) => {
    globalSentRequests = globalSentRequests.filter(
      (req) => !(req.from.id === loggedInUser.id && req.to.id === user.id)
    );
    setSentRequests(sentRequests.filter((req) => req.to.id !== user.id));
  };

  const handleAcceptRequest = (user) => {
    // Add both users as friends
    globalFriends.push([loggedInUser.id, user.id]);

    // Remove request from pending
    globalSentRequests = globalSentRequests.filter(
      (req) => !(req.from.id === user.id && req.to.id === loggedInUser.id)
    );

    setPendingRequests(
      pendingRequests.filter((req) => req.from.id !== user.id)
    );

    // Update friends list
    setFriends([...friends, user]);
  };

  const handleDeleteRequest = (user) => {
    globalSentRequests = globalSentRequests.filter(
      (req) => !(req.from.id === user.id && req.to.id === loggedInUser.id)
    );
    setPendingRequests(
      pendingRequests.filter((req) => req.from.id !== user.id)
    );
  };

  const [postToShow, setPostToShow] = useState(null);
  const [unfriendMessage, setUnfriendMessage] = useState("");

  const handleUnfriend = (friend) => {
    globalFriends = globalFriends.filter(
      (pair) => !(pair.includes(loggedInUser.id) && pair.includes(friend.id))
    );
    setFriends(friends.filter((f) => f.id !== friend.id));
    setUnfriendMessage(`You have unfriended ${friend.username}.`);

    setTimeout(() => setUnfriendMessage(""), 3000); // Message disappears after 3 seconds
  };

  const handleViewPost = (friend) => {
    setPostToShow(friend.post[0]);
    openModal("post");
  };

  {
    unfriendMessage && (
      <div className="alert alert-warning sticky-top">{unfriendMessage}</div>
    );
  }

  

  return (
    <>
      {/* Navbar */}
      <nav className="navbar navbar-dark bg-dark">
        <div class="container">
          <a class="navbar-brand" href="#">
            MySocial
          </a>
        </div>
      </nav>

      <div className="container mt-4">
        {/* Login Form */}
        {!loggedInUser ? (
          <div
            className="container mx-auto shadow-lg p-5 bg-white rounded"
            style={{ width: "100%" }}
          >
            <div className="row">
              <div className="col-md-6">
                <img src={LoginImage} alt="Login-Image" className="img-fluid" />
              </div>
              <div className="col-md-6 p-5">
                <div className="row">
                  <h3 className="mt-2 mb-2">Login</h3>
                  <p className="mt-2 mb-2">
                    Stay connected, share moments, and make new friends your
                    social hub awaits!
                  </p>
                </div>
                <input
                  type="number"
                  className="form-control mb-2 mt-2"
                  placeholder="Enter your ID"
                  value={userId}
                  onChange={(e) => setUserId(e.target.value)}
                />
                <button
                  className="btn btn-dark mt-2 mb-2 w-100"
                  onClick={handleLogin}
                >
                  Login
                </button>
              </div>
            </div>
          </div>
        ) : (
          <div className="container  shadow-lg p-5 bg-white rounded">
            <h3>Welcome, {loggedInUser.username}!</h3>
            <button className="btn btn-dark mb-3" onClick={handleLogout}>
              Logout
            </button>
            <div className="d-flex flex-wrap gap-2">
              <button
                className="btn btn-dark"
                onClick={() => openModal("suggestions")}
              >
                Suggestions
              </button>
              <button
                className="btn btn-dark"
                onClick={() => openModal("friends")}
              >
                Friends
              </button>
              <button
                className="btn btn-dark"
                onClick={() => openModal("profile")}
              >
                My Profile
              </button>
              <button
                className="btn btn-dark"
                onClick={() => openModal("sentRequests")}
              >
                Sent Requests
              </button>
              <button
                className="btn btn-dark"
                onClick={() => openModal("pendingRequests")}
              >
                Pending Requests
              </button>
            </div>
          </div>
        )}

        {unfriendMessage && (
          <div className="alert alert-warning">{unfriendMessage}</div>
        )}

        {/* Modal */}
        {modalContent && (
          <div className="modal-overlay">
            <div className="modal-content">
              {modalContent === "profile" ? (
                <>
                  <h4>My Profile</h4>
                  <p>Your profile</p>
                  <div className="profile-card text-center justify-content-center">
                    <p className="mt-3">{loggedInUser.username}</p>
                  </div>
                </>
              ) : modalContent === "suggestions" ? (
                <>
                  <h4>Suggestions</h4>
                  {users
                    .filter(
                      (user) =>
                        user.id !== loggedInUser.id &&
                        !sentRequests.some((req) => req.to.id === user.id) &&
                        !friends.some((friend) => friend.id === user.id)
                    )
                    .map((user) => (
                      <div key={user.id} className="suggestion-card">
                        <p className="mt-3">{user.username}</p>
                        <button
                          className="btn btn-dark"
                          onClick={() => handleAddFriend(user)}
                        >
                          Add Friend
                        </button>
                      </div>
                    ))}
                </>
              ) : modalContent === "sentRequests" ? (
                <>
                  <h4>Sent Requests</h4>
                  {sentRequests.length > 0 ? (
                    sentRequests.map((req) => (
                      <div key={req.to.id} className="sent-request-card">
                        <p className="mt-3">{req.to.username}</p>
                        <button
                          className="btn btn-dark"
                          onClick={() => handleCancelRequest(req.to)}
                        >
                          Cancel Request
                        </button>
                      </div>
                    ))
                  ) : (
                    <p>No sent requests</p>
                  )}
                </>
              ) : modalContent === "pendingRequests" ? (
                <>
                  <h4>Pending Requests</h4>
                  {pendingRequests.length > 0 ? (
                    pendingRequests.map((req) => (
                      <div key={req.from.id} className="pending-request-card">
                        <p className="mt-3">{req.from.username}</p>
                        <button
                          className="btn btn-dark"
                          onClick={() => handleAcceptRequest(req.from)}
                        >
                          Accept
                        </button>
                        <button
                          className="btn btn-dark"
                          onClick={() => handleDeleteRequest(req.from)}
                        >
                          Delete
                        </button>
                      </div>
                    ))
                  ) : (
                    <p>No pending requests</p>
                  )}
                </>
              ) : modalContent === "friends" ? (
                <>
                  <h4>My Friends</h4>
                  {friends.length > 0 ? (
                    friends.map((friend) => (
                      <div key={friend.id} className="friend-card">
                        <p className="mt-3">{friend.username}</p>
                        <button
                          className="btn btn-info mr-2"
                          onClick={() => handleViewPost(friend)}
                        >
                          View Post
                        </button>
                        <button
                          className="btn btn-dark"
                          onClick={() => handleUnfriend(friend)}
                        >
                          Unfriend
                        </button>
                      </div>
                    ))
                  ) : (
                    <p>No friends yet</p>
                  )}
                </>
              ) : modalContent === "post" && postToShow ? (
                <>
                  <h4>Post Details</h4>
                  <p>
                    <strong>Post ID:</strong> {postToShow.postId}
                  </p>
                  <p>
                    <strong>Title:</strong> {postToShow.postTitle}
                  </p>
                  <img
                    src={postToShow.postPicture}
                    alt="Post"
                    style={{ maxWidth: "100%" }}
                  />
                </>
              ) : null}
              <br />
              <div className="row text-center justify-content-center">
                <button className="close-btn" onClick={closeModal}>
                  <i class="fa-solid fa-xmark"></i>
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </>
  );
};

export default MySocial;
