import React, { useState } from "react";
import axios from "axios";
import toast, { Toaster } from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import { BASE_URL } from "../utils/constant";

function AdminDashboard() {
  const [title, setTitle] = useState("");
  const [date, setDate] = useState("");
  const [eventType, setEventType] = useState("image");
  const [eventFile, setEventFile] = useState(null);
  const [attendeeFile, setAttendeeFile] = useState(null);
  const [eventLink, setEventLink] = useState("");
  const navigate = useNavigate();

  const handleFileChange = (e, setter) => {
    setter(e.target.files[0]);
  };

  const handleAddEvent = async (e) => {
    e.preventDefault();

    const formData = new FormData();
    formData.append("title", title);
    formData.append("date", date);
    formData.append("eventType", eventType);
    formData.append("media", eventFile);
    formData.append("attendeeList", attendeeFile);
    formData.append("eventLink", eventLink);
    try {
      await axios.post(BASE_URL + "events/add", formData, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
          "Content-Type": "multipart/form-data",
        },
      });
      toast.success("Event added successfully");
      navigate("/events");
    } catch (error) {
      toast.error("Failed to add event");
    }
  };

  return (
    <>
      <Toaster />
      <div className="container mt-5 col-5">
        <h2>Add an Event</h2>
        <form onSubmit={handleAddEvent}>
          <input
            type="text"
            placeholder="Event Name"
            className="form-control mb-2"
            onChange={(e) => setTitle(e.target.value)}
            required
          />
          <input
            type="date"
            className="form-control mb-2"
            onChange={(e) => setDate(e.target.value)}
            required
          />

          <label>Event Type:</label>
          <div className="mb-2">
            <input
              type="radio"
              value="image"
              checked={eventType === "image"}
              onChange={() => setEventType("image")}
            />{" "}
            Image
            <input
              type="radio"
              value="video"
              checked={eventType === "video"}
              onChange={() => setEventType("video")}
              className="ml-2"
            />{" "}
            Video
          </div>

          <label>Upload Event File:</label>
          <input
            type="file"
            className="form-control mb-2"
            onChange={(e) => handleFileChange(e, setEventFile)}
            required
          />

          <label>Upload Attendee List (Excel):</label>
          <input
            type="file"
            className="form-control mb-2"
            onChange={(e) => handleFileChange(e, setAttendeeFile)}
          />

          <input
            type="url"
            placeholder="Event Web Link"
            className="form-control mb-2"
            onChange={(e) => setEventLink(e.target.value)}
          />

          <button className="btn btn-success">Submit</button>
        </form>
      </div>
    </>
  );
}

export default AdminDashboard;
