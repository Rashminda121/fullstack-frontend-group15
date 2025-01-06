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

import axios from "axios";
import { jwtDecode } from "jwt-decode";
import React, { useEffect, useState } from "react";
import { FaEdit, FaTrash } from "react-icons/fa";
import "./UserReview.css";

/**
 * Reviews component allows users to view, add, edit, and delete reviews.
 * 
 * State Variables:
 * - reviews: Array of review objects fetched from the server.
 * - newReview: String representing the new review text input by the user.
 * - thankYouMessage: String for displaying a thank you message after an action.
 * - editingReviewId: ID of the review currently being edited.
 * - editingReviewText: String representing the text of the review being edited.
 * - currentUser: String representing the name of the currently logged-in user.
 * 
 * useEffect Hooks:
 * - Fetches the current user's profile using a token from localStorage.
 * - Fetches all reviews from the server when the component mounts.
 * 
 * Functions:
 * - handleSubmit: Handles the submission of a new review.
 * - handleDelete: Handles the deletion of a review.
 * - handleEdit: Sets the state for editing a review.
 * - submitEdit: Handles the submission of an edited review.
 * 
 * Returns:
 * - JSX for rendering the review form, list of reviews, and thank you message modal.
 */
const Reviews = () => {
  const [reviews, setReviews] = useState([]);
  const [newReview, setNewReview] = useState("");
  const [thankYouMessage, setThankYouMessage] = useState("");
  const [editingReviewId, setEditingReviewId] = useState(null);
  const [editingReviewText, setEditingReviewText] = useState("");
  const [currentUser, setCurrentUser] = useState("");

  useEffect(() => {
    if (localStorage.getItem("token")) {
      const token = localStorage.getItem("token");
      const decoded = jwtDecode(token);
      axios
        .get(`/api/user/profile/${decoded.id}`, { headers: { token: token } })
        .then((response) => setCurrentUser(response.data.name))
        .catch((error) => console.error("Error fetching current user:", error));
    }
  }, []);

  useEffect(() => {
    axios
      .get("/api/reviews/get")
      .then((response) => {
        setReviews(response.data);
      })
      .catch((error) => {
        console.error("Error fetching reviews:", error);
      });
  }, []);

  const handleSubmit = (e) => {
    e.preventDefault();

    if (newReview.trim() === "") {
      alert("Review cannot be empty!");
      return;
    }

    if (!currentUser) {
      alert("User not identified. Please log in again.");
      return;
    }

    axios
      .post("/api/reviews/add", { review: newReview, reviewedBy: currentUser })
      .then((response) => {
        setReviews([response.data, ...reviews]);
        setNewReview("");
        setThankYouMessage("Thanks for your review!");
        setTimeout(() => setThankYouMessage(""), 5000);
      })
      .catch((error) => {
        console.error("Error posting review:", error);
      });
  };

  const handleDelete = (id) => {
    if (window.confirm("Are you sure you want to delete this review?")) {
      axios
        .delete(`/api/reviews/delete/${id}`)
        .then(() => {
          setReviews(reviews.filter((review) => review._id !== id));
          setThankYouMessage("Review deleted successfully!");
          setTimeout(() => setThankYouMessage(""), 5000);
        })
        .catch((error) => {
          console.error("Error deleting review:", error);
        });
    }
  };

  const handleEdit = (id, reviewText) => {
    setEditingReviewId(id);
    setEditingReviewText(reviewText);
  };

  const submitEdit = (e) => {
    e.preventDefault();
    axios
      .put(`/api/reviews/update/${editingReviewId}`, {
        review: editingReviewText,
      })
      .then((response) => {
        setReviews(
          reviews.map((review) =>
            review._id === editingReviewId ? response.data : review
          )
        );
        setEditingReviewId(null);
        setEditingReviewText("");
        setThankYouMessage("Review updated successfully!");
        setTimeout(() => setThankYouMessage(""), 5000);
      })
      .catch((error) => {
        console.error("Error editing review:", error);
      });
  };

  return (
    <div className="reviews-container">
      <div className="review-form">
        <h2>Write a Review</h2>
        <form onSubmit={handleSubmit}>
          <textarea
            value={newReview}
            onChange={(e) => setNewReview(e.target.value)}
            placeholder="Write your review here..."
            rows="3"
          />
          <button type="submit" className="submit-btn">
            Submit
          </button>
        </form>
      </div>

      <div className="reviews-list">
        <h2>What Others Are Saying</h2>
        {reviews.length > 0 ? (
          reviews.map((review) => (
            <div key={review._id} className="review-card">
              {editingReviewId === review._id ? (
                <form onSubmit={submitEdit}>
                  <textarea
                    value={editingReviewText}
                    onChange={(e) => setEditingReviewText(e.target.value)}
                    rows="3"
                    className="edit-review"
                  />
                  <button type="submit" className="submit-btn">
                    Save
                  </button>
                  <button
                    onClick={() => setEditingReviewId(null)}
                    className="cancel-btn"
                  >
                    Cancel
                  </button>
                </form>
              ) : (
                <>
                  <p>{review.review}</p>
                  <p className="reviewed-by">- {review.reviewedBy}</p>
                  {review.reviewedBy === currentUser && (
                    <div className="review-actions">
                      <button
                        onClick={() => handleEdit(review._id, review.review)}
                        className="edit-btn"
                      >
                        <FaEdit />
                      </button>
                      <button
                        onClick={() => handleDelete(review._id)}
                        className="delete-btn"
                      >
                        <FaTrash />
                      </button>
                    </div>
                  )}
                </>
              )}
            </div>
          ))
        ) : (
          <p className="no-reviews">
            No reviews yet. Be the first to leave one!
          </p>
        )}
      </div>

      {thankYouMessage && (
        <div className="modal">
          <div className="modal-content">
            <p>{thankYouMessage}</p>
          </div>
        </div>
      )}
    </div>
  );
};

export default Reviews;
