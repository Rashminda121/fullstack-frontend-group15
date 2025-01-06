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

//--------------------React Imports-------------------------
import React, { useEffect, useState } from "react";
import { ChatBubbleBottomCenterTextIcon } from "@heroicons/react/24/outline";

//--------------------App Imports-------------------------
import { socket } from "../../socket/socket";
import StoreLayout from "../Layout";

//--------------------Other Imports-------------------------
import axios from "axios";
import { jwtDecode } from "jwt-decode";

const Chats = () => {
  const [storeEmail, setStoreEmail] = useState("");
  const [chats, setChats] = useState([]);
  const [selectedChat, setSelectedChat] = useState(null);
  const [newMessage, setNewMessage] = useState("");
  const [token, setToken] = useState("");

  useEffect(() => {
    if (localStorage.getItem("token")) {
      setToken(localStorage.getItem("token"));
    }
  }, []);

  //UseEffect to fetch the store email
  useEffect(() => {
    if (token) {
      const decoded = jwtDecode(token);
      axios
        .get(`/api/user/email/${decoded.id}`, { headers: { token } })
        .then((response) => {
          setStoreEmail(response.data.email);
        })
        .catch((error) => {
          console.error("Error fetching role:", error);
        });
    }
  }, [token]);

  //UseEffect to fetch all chats for the store
  useEffect(() => {
    const fetchAllChatsForStore = async () => {
      if (storeEmail) {
        try {
          const response = await axios.get(`/api/chat/${storeEmail}`, {
            headers: { token },
          });

          const combinedChats = response.data.data.reduce((acc, chat) => {
            const participants = [chat._id.from, chat._id.to].sort();
            const key = `${chat._id.foodItemId}_${participants.join("_")}`;

            if (!acc[key]) {
              acc[key] = { ...chat, messages: [] };
            }
            acc[key].messages.push(...chat.messages);

            return acc;
          }, {});

          const sortedChats = Object.values(combinedChats).map((chat) => ({
            ...chat,
            messages: chat.messages.sort(
              (a, b) => new Date(a.timestamp) - new Date(b.timestamp)
            ),
          }));

          setChats(sortedChats);
        } catch (error) {
          console.error("Error fetching chats:", error);
        }
      }
    };

    fetchAllChatsForStore();
  }, [storeEmail, token]);

  useEffect(() => {
    socket.on("receive_message", (data) => {
      const { message, foodItemId, from, to, timestamp } = data;

      setChats((prevChats) => {
        const updatedChats = [...prevChats];
        const chatIndex = updatedChats.findIndex(
          (chat) => chat._id.foodItemId === foodItemId
        );

        if (chatIndex !== -1) {
          updatedChats[chatIndex].messages.push({
            from,
            to,
            message,
            timestamp: timestamp || new Date().toISOString(),
          });

          updatedChats[chatIndex].messages.sort(
            (a, b) => new Date(a.timestamp) - new Date(b.timestamp)
          );
        } else {
          updatedChats.push({
            _id: { foodItemId, from, to },
            messages: [
              {
                from,
                to,
                message,
                timestamp: timestamp || new Date().toISOString(),
              },
            ],
          });
        }

        return updatedChats;
      });

      if (selectedChat && selectedChat._id.foodItemId === foodItemId) {
        setSelectedChat((prevChat) => ({
          ...prevChat,
          messages: [
            ...(prevChat.messages || []),
            {
              from,
              to,
              message,
              timestamp: timestamp || new Date().toISOString(),
            },
          ].sort((a, b) => new Date(a.timestamp) - new Date(b.timestamp)),
        }));
      }
    });

    return () => {
      socket.off("receive_message");
    };
  }, [storeEmail, selectedChat, token]);

  //Function to handle chat click
  const handleChatClick = (chat) => {
    const matchingChat = chats.find(
      (c) =>
        c._id.foodItemId === chat._id.foodItemId && c._id.from === chat._id.from
    );
    if (matchingChat) {
      setSelectedChat(matchingChat);
    }
  };

  //Function to handle send message
  const handleSendMessage = async () => {
    if (newMessage.trim() !== "" && selectedChat) {
      const messageData = {
        foodItemId: selectedChat._id.foodItemId,
        foodName: selectedChat._id.foodName,
        to: selectedChat._id.from,
        from: storeEmail,
        message: newMessage,
      };

      if (
        messageData.foodItemId &&
        messageData.foodName &&
        messageData.to &&
        messageData.from &&
        messageData.message
      ) {
        setSelectedChat((prevChat) => ({
          ...prevChat,
          messages: [
            ...(prevChat.messages || []),
            { from: storeEmail, message: newMessage, timestamp: new Date() },
          ].sort((a, b) => new Date(a.timestamp) - new Date(b.timestamp)),
        }));

        socket.emit("send_message", messageData);

        await axios.post("/api/chat/send", messageData, { headers: { token } });

        setChats((prevChats) => {
          return prevChats.map((chat) => {
            if (chat._id.foodItemId === selectedChat._id.foodItemId) {
              return {
                ...chat,
                messages: [
                  ...(chat.messages || []),
                  {
                    from: storeEmail,
                    message: newMessage,
                    timestamp: new Date(),
                  },
                ].sort((a, b) => new Date(a.timestamp) - new Date(b.timestamp)),
              };
            }
            return chat;
          });
        });

        setNewMessage("");
      } else {
        console.error("Missing required fields:", messageData);
      }
    }
  };

  return (
    <StoreLayout>
      {/* <div className="flex justify-center py-6">
        <h1 className="text-3xl font-semibold text-slate-800">Store Orders</h1>
      </div> */}
      <div className="p-6 mt-16">
        <div className="flex space-x-6">
          <div className="w-1/3 bg-white p-4 rounded-lg shadow-lg">
            <h2 className="text-xl font-semibold mb-4">Customer Chats</h2>
            {chats.length > 0 ? (
              <ul>
                {chats.map((chat) => (
                  <li
                    key={chat._id.foodItemId + chat._id.from}
                    className="flex items-center justify-between p-3 border-b cursor-pointer hover:bg-gray-100 transition-colors duration-200 rounded-lg"
                    onClick={() => handleChatClick(chat)}
                  >
                    <div>
                      <p className="font-medium text-gray-800">
                        {chat._id.foodName}
                      </p>
                      <p className="text-sm text-gray-500">{chat._id.from}</p>
                    </div>
                    <ChatBubbleBottomCenterTextIcon className="h-5 w-5 text-gray-500" />
                  </li>
                ))}
              </ul>
            ) : (
              <p className="text-gray-500">No chats available.</p>
            )}
          </div>

          <div className="w-2/3 bg-white p-4 rounded-lg shadow-lg">
            {selectedChat ? (
              <>
                <h2 className="text-xl font-semibold mb-4 text-gray-800">
                  Chat with {selectedChat._id.from}
                </h2>
                <div className="max-h-64 overflow-y-auto border-b p-4 mb-4 bg-gray-50 rounded-lg shadow-inner">
                  {selectedChat.messages.map((message, index) => (
                    <div
                      key={index}
                      className={`my-2 flex ${
                        message.from === storeEmail
                          ? "justify-end"
                          : "justify-start"
                      }`}
                    >
                      <p
                        className={`p-2.5 max-w-xs rounded-lg shadow-md ${
                          message.from === storeEmail
                            ? "bg-blue-500 text-white"
                            : "bg-gray-200 text-gray-800"
                        }`}
                      >
                        {message.message}
                      </p>
                    </div>
                  ))}
                </div>

                <div className="flex items-center">
                  <input
                    type="text"
                    value={newMessage}
                    onChange={(e) => setNewMessage(e.target.value)}
                    className="flex-1 p-3 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Type your message..."
                  />
                  <button
                    onClick={handleSendMessage}
                    className="ml-2 bg-blue-600 hover:bg-blue-700 text-white px-5 py-2 rounded-lg shadow-lg transition-all duration-200"
                  >
                    Send
                  </button>
                </div>
              </>
            ) : (
              <p className="text-gray-500">Select a chat to view details.</p>
            )}
          </div>
        </div>
      </div>
    </StoreLayout>
  );
};

export default Chats;
