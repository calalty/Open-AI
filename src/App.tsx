import { useEffect, useState } from "react";
import "./App.scss";

function App() {
  const [value, setValue] = useState<string | null>(null);
  const [message, setMessage] = useState<any>(null);
  const [prevMessage, setPrevMessage] = useState<
    { title: string | null; role: string; content: string }[]
  >([]);
  const [currentTitle, setCurrentTitle] = useState<string | null>(null);
  const [closeSideBar, setCloseSideBar] = useState<boolean>(false);

  const getMessages = async () => {
    const options = {
      method: "POST",
      body: JSON.stringify({
        message: value,
      }),
      headers: {
        "Content-Type": "application/json",
      },
    };

    try {
      const res = await fetch("http://localhost:8000/completions", options);
      const data = await res.json();
      setMessage(data.choices[0].message);
    } catch (error) {
      console.log(error);
    }
  };

  const currentChat = prevMessage.filter(
    (prevMessage) => prevMessage.title === currentTitle
  );

  const uniqueTitles = Array.from(
    new Set(prevMessage.map((prevMessage) => prevMessage.title))
  );

  const createNewChat = () => {
    setMessage(null);
    setValue("");
    setCurrentTitle(null);
  };

  const toggleSideBar = () => {
    setCloseSideBar(!closeSideBar);
  };

  const clickUniqueTitle = (uniqueTitle: string) => {
    setMessage(null);
    setValue("");
    setCurrentTitle(uniqueTitle);
  };

  useEffect(() => {
    if (!currentTitle && value && message) {
      setCurrentTitle(value);
    }

    if (currentTitle && value && message) {
      setPrevMessage((prevMessage) => [
        ...prevMessage,
        {
          title: currentTitle,
          role: "user",
          content: value,
        },
        {
          title: currentTitle,
          role: message.role,
          content: message.content,
        },
      ]);
    }
  }, [currentTitle, message]);

  return (
    <div className="container">
      <div
        className={[
          "side-bar-container",
          closeSideBar && "side-bar-container--closed",
        ].join(" ")}
      >
        <section className="side-bar">
          <div className="nav">
            <div className="top-buttons">
              <button className="new-chat" onClick={createNewChat}>
                <span className="new-chat-plus">+</span> New chat
              </button>
              <button className="close-side-bar" onClick={toggleSideBar}>
                -
              </button>
            </div>
            <ul className="history">
              {uniqueTitles.map((uniqueTitle, index) => (
                <li
                  onClick={() => clickUniqueTitle(uniqueTitle as string)}
                  key={index}
                  className="history-item"
                >
                  {uniqueTitle}
                </li>
              ))}
              <li className="history-item">
                <span className="history-item-icon">💬</span>Title
              </li>
            </ul>
          </div>
          <nav></nav>
        </section>
      </div>
      <section className="main">
        {closeSideBar && (
          <button className="open-side-bar" onClick={toggleSideBar}>
            -
          </button>
        )}
        {!currentTitle && <h1>CalChat</h1>}
        <ul className="feed">
          {currentChat.map((chatMessage, index) => (
            <li
              className={
                chatMessage.role === "user" ? "user-bg" : "assistant-bg"
              }
              key={index}
            >
              <div className="feed-chat">
                <div className="role">{chatMessage.role}</div>
                <div>{chatMessage.content}</div>
              </div>
            </li>
          ))}
        </ul>
        <div className="bottom-section">
          <div className="input-container">
            <input
              value={value ?? ""}
              onChange={(e) => setValue(e.target.value)}
            />
            <div onClick={getMessages} id="submit">
              ➤
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

export default App;
