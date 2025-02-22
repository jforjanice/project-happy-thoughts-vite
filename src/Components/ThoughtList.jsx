import { useState, useEffect } from "react";
import UserInput from "./UserInput";
import TimeAgo from "timeago-react";
// This component is responsible to fetch the data and displaying the list of messages including the new ones

export const ThoughtList = () => {
  const [loading, setLoading] = useState(true);
  const [thoughts, setThoughtList] = useState([]);
  const [likes, setLikes] = useState({});
  const [time, setTime] = useState(null);

  const fetchData = () => {
    fetch("https://happy-thoughts-api-h1ti.onrender.com/thoughts")
      .then((res) => {
        if (!res.ok) {
          throw new Error(`HTTP error! Status: ${res.status}`);
        }
        return res.json();
      })
      .then((data) => {
        console.log("Fetched data:", data); // Log the fetched data
        setThoughtList(data);
        setLoading(false);
      })
      .catch((error) => {
        console.error("Failed to fetch data", error);
      })
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    setTime(Date.now());
    fetchData();
  }, []);

  const handleLike = (thoughtId) => {
    setLikes((prevLikes) => ({
      ...prevLikes,
      [thoughtId]: (prevLikes[thoughtId] || 0) + 1,
    }));
  };

  // Create a function to refresh the list of message including the new input

  const refreshList = () => {
    fetchData();
  };

  return (
    <div className="container">
      {/* Pass the user new input as a prop from component "UserInput" */}
      <UserInput newThoughtPosted={refreshList} />
      {loading ? (
        <p>Loading...</p>
      ) : (
        thoughts.map((thought) => (
          <div key={thought._id} className="textBox">
            <p className="user-input">{thought.message}</p>
            <div className="like-time">
              <div className="likeBtn">
                <button
                  onClick={() => handleLike(thought._id)}
                  className="heart"
                >
                  ❤️
                </button>
                <p> X {likes[thought._id] || 0}</p>
              </div>
              <div className="time">
                <TimeAgo opts={{ minInterval: "60" }} datetime={time} />
              </div>
            </div>
          </div>
        ))
      )}
    </div>
  );
};
