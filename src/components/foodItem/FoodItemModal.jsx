/*
 * Project Name: Salt & Pepper
 * Group: Group 15
 * University: University of Plymouth
 * Course: BSc (Hons) Software Engineering
 * Author(s): Amarathunga Ruwanthie, Jayamuni Rashminda, Onaliy Jayawardana, Gihan Wipulaguna, Hapuarachchige Hapuarachchi, Waniga Perera
 *
 * Copyright (c) 2024 [Amarathunga Ruwanthie, Jayamuni Rashminda, Onaliy Jayawardana, Gihan Wipulaguna, Hapuarachchige Hapuarachchi, Waniga Perera]. All rights reserved.
 *
 * This code is the property of the authors and may not be reproduced, distributed, or
 * used without permission from the copyright holder(s).
 */

//------------------React Imports-------------------------
import React, { useContext, useEffect, useState } from "react";

//------------------App Imports-------------------------
import { assets } from "../../assets/assets";
import { StoreContext } from "../../context/StoreContext";
import { socket } from "../../socket/socket";

//------------------Other Imports-------------------------
import { ChatBubbleBottomCenterTextIcon } from "@heroicons/react/24/outline";
import axios from "axios";
import { jwtDecode } from "jwt-decode";

const FoodItemModal = ({ isOpen, onClose, children, item }) => {
  const { cartItems, addToCart, removeFromCart } = useContext(StoreContext);
  const [isChatting, setIsChatting] = useState(false);
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState("");
  const [token, setToken] = useState("");
  const [email, setEmail] = useState("");
  useEffect(() => {
    if (localStorage.getItem("token")) {
      setToken(localStorage.getItem("token"));
    }
  }, []);

  //Decode JWT token and fetch user email
  useEffect(() => {
    if (token) {
      const decoded = jwtDecode(token);
      axios
        .get(`/api/user/email/${decoded.id}`)

        .then((response) => {
          setEmail(response.data.email);
          console.log("email", response.data);
        })
        .catch((error) => {
          console.error("Error fetching role:", error);
        });
    }
  }, [token]);

  // Fetch chat history when the chat is opened
  useEffect(() => {
    if (isChatting) {
      const fetchChatHistory = async () => {
        try {
          const response = await axios.get(
            `/api/chat/${item._id}/${item.store}`,
            { headers: { token } }
          );
          if (response.data.success) {
            setMessages(response.data.data);
          } else {
            console.error("Failed to fetch chat history.");
          }
        } catch (error) {
          console.error("Error fetching chat history:", error);
        }
      };

      fetchChatHistory();
      return () => {
        socket.off("receive_message");
      };
    }
  }, [isChatting, item, token]);

  // Listen for incoming messages from the store owner
  useEffect(() => {
    if (isChatting) {
      socket.on("receive_message", (messageData) => {
        setMessages((prevMessages) => [
          ...prevMessages,
          { from: messageData.from, message: messageData.message },
        ]);
      });

      // Cleanup listener
      return () => {
        socket.off("receive_message");
      };
    }
  }, [isChatting]);

  // Add to the existing customer-side component
  const handleChatClick = () => {
    socket.emit("start_chat", {
      foodItemId: item._id,
      from: item.store,
      to: email,
    });
    setIsChatting(true);
    localStorage.setItem("isChatting", "true");
  };

  // UseEffect to fetch the chat history when the chat modal opens
  useEffect(() => {
    if (isChatting) {
      const fetchChatHistory = async () => {
        try {
          const response = await axios.get(
            `/api/chat/${item._id}/${item.store}`,
            { headers: { token } }
          );
          if (response.data.success) {
            setMessages(response.data.data);
          } else {
            console.error("Failed to fetch chat history.");
          }
        } catch (error) {
          console.error("Error fetching chat history:", error);
        }
      };
      fetchChatHistory();
    }

    return () => {
      socket.off("receive_message");
    };
  }, [isChatting, item, token]);

  //Function to send new chats
  const handleSendMessage = async () => {
    if (newMessage.trim() !== "") {
      try {
        const newMsg = {
          from: email,
          message: newMessage,
          to: item.store,
          timestamp: new Date().toISOString(),
        };

        setMessages((prevMessages) => [...prevMessages, newMsg]);

        // Emit the message through the socket
        socket.emit("send_message", {
          to: item.store,
          message: newMessage,
          foodItemId: item._id,
        });

        // Save the message to the server
        await axios.post(
          "/api/chat/send",
          {
            foodItemId: item._id,
            foodName: item.name,
            to: item.store,
            from: email,
            message: newMessage,
          },
          { headers: { token } }
        );

        // Clear the input
        setNewMessage("");
      } catch (error) {
        console.error("Error sending message:", error);
      }
    }
  };

  const handleCloseChat = () => {
    setIsChatting(false);
    localStorage.removeItem("isChatting");
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 w-11/12 max-w-lg relative">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-500 hover:text-gray-800 bg-gray-100 hover:bg-gray-200 rounded-full p-2 shadow-md transition duration-200"
          aria-label="Close"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-5 w-5"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={2}
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M6 18L18 6M6 6l12 12"
            />
          </svg>
        </button>

        {children}

        {item && (
          <div className="mt-4 flex justify-center items-center space-x-4">
            <div className="relative group">
              {!cartItems[item.id] ? (
                <img
                  className="cursor-pointer w-10 h-10"
                  onClick={() => addToCart(item.id)}
                  src={assets.add_icon_green}
                  alt="Add to Cart"
                />
              ) : (
                <div className="flex items-center space-x-2">
                  <img
                    className="cursor-pointer w-8 h-8"
                    onClick={() => removeFromCart(item.id)}
                    src={assets.remove_icon_red}
                    alt="Remove from Cart"
                  />
                  <p className="text-lg">{cartItems[item.id]}</p>
                  <img
                    className="cursor-pointer w-8 h-8"
                    onClick={() => addToCart(item.id)}
                    src={assets.add_icon_green}
                    alt="Add to Cart"
                  />
                </div>
              )}
            </div>
            <div className="relative group">
              <button
                onClick={handleChatClick}
                className="bg-yellow-100 hover:bg-yellow-200 rounded-full p-3 transition duration-200 flex items-center justify-center"
                aria-label="Chat"
              >
                <ChatBubbleBottomCenterTextIcon className="h-6 w-6 text-yellow-600" />
              </button>
              <span className="absolute bottom-full mb-1 hidden group-hover:block text-sm text-white bg-gray-700 rounded-md px-2 py-1 w-32 text-center">
                Chat with store
              </span>
            </div>
          </div>
        )}
      </div>

      {isChatting && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-11/12 max-w-lg">
            <h3 className="text-xl font-semibold">Chat with Store Owner</h3>
            <div className="mt-4 max-h-64 overflow-y-auto p-2 border-b border-gray-300">
              <div>
                {Array.isArray(messages) && messages.length > 0 ? (
                  messages
                    .filter((msg) => msg.from === email || msg.to === email)
                    .map((msg, index) => (
                      <div
                        key={index}
                        className={`my-2 ${
                          msg.from === email ? "text-right" : "text-left"
                        }`}
                      >
                        <p
                          className={`inline-block p-2 rounded-lg ${
                            msg.from === email ? "bg-blue-200" : "bg-gray-200"
                          }`}
                        >
                          {msg.message}
                        </p>
                      </div>
                    ))
                ) : (
                  <p className="text-center text-gray-500">
                    No messages yet. Start chatting!
                  </p>
                )}
              </div>
            </div>

            <div className="mt-4 flex items-center">
              <input
                type="text"
                value={newMessage}
                onChange={(e) => setNewMessage(e.target.value)}
                className="flex-1 p-2 border border-gray-300 rounded-lg"
                placeholder="Type your message..."
              />
              <button
                onClick={handleSendMessage}
                className="ml-2 bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg"
              >
                Send
              </button>
              <button
                onClick={handleCloseChat}
                className="ml-2 bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-lg"
              >
                Close Chat
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default FoodItemModal;
