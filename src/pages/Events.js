import React, { useEffect, useState } from "react";
import axios from "axios";
import toast, { Toaster } from "react-hot-toast";
import { BASE_URL } from "../utils/constant";
function Events() {
  const [events, setEvents] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [editingEvent, setEditingEvent] = useState(null);
  const [editTitle, setEditTitle] = useState("");
  const [editDate, setEditDate] = useState("");
  const [editEventType, setEditEventType] = useState("image");
  const [editEventLink, setEditEventLink] = useState("");
  const role = localStorage.getItem("role");

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const res = await axios.get(BASE_URL + "events");
        setEvents(res.data);
      } catch (error) {
        toast.error("Failed to fetch events");
      }
    };
    fetchEvents();
  }, []);

  const handleDelete = async (eventId) => {
    try {
      await axios.delete(BASE_URL + `events/${eventId}`, {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      });

      setEvents(events.filter((event) => event._id !== eventId));
      toast.success("Event deleted successfully");
    } catch (error) {
      console.error("Error deleting event:", error);
      toast.error("Failed to delete event");
    }
  };

  const handleEditClick = (event) => {
    setEditingEvent(event);
    setEditTitle(event.title);
    setEditDate(event.date.split("T")[0]);
    setEditEventType(event.eventType);
    setEditEventLink(event.webLink || "");
  };

  const handleEditSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.put(
        BASE_URL + `events/${editingEvent._id}`,
        {
          title: editTitle,
          date: editDate,
          eventType: editEventType,
          webLink: editEventLink,
        },
        {
          headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
        }
      );

      setEvents(
        events.map((event) =>
          event._id === editingEvent._id ? res.data.event : event
        )
      );
      toast.success("Event updated successfully");
      setEditingEvent(null);
    } catch (error) {
      console.error("Error updating event:", error);
      toast.error("Failed to update event");
    }
  };

  const filteredEvents = events.filter((event) =>
    event.title.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <>
      <Toaster />
      <div className="container mt-5">
        <h2 className="mb-4">All Events</h2>

        <input
          type="text"
          className="form-control mb-4"
          placeholder="Search events..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />

        <div className="row">
          {filteredEvents.length > 0 ? (
            filteredEvents.map((event) => (
              <div key={event._id} className="col-md-4 mb-4">
                <div className="card shadow-sm">
                  {event.eventType === "image" ? (
                    <img
                      src={`http://localhost:5000/${event.mediaURL}`}
                      className="card-img-top"
                      alt={event.title}
                      style={{ height: "200px", objectFit: "cover" }}
                    />
                  ) : (
                    <video
                      controls
                      className="card-img-top"
                      style={{ height: "200px", objectFit: "cover" }}
                    >
                      <source
                        src={`http://localhost:5000/${event.mediaURL}`}
                        type="video/mp4"
                      />
                      Your browser does not support the video tag.
                    </video>
                  )}

                  <div className="card-body">
                    <h5 className="card-title">{event.title}</h5>
                    <p className="card-text">
                      📅 <strong>{new Date(event.date).toDateString()}</strong>
                    </p>
                    <p className="card-text">
                      👥 Attendees:{" "}
                      {event.attendees.length > 0
                        ? event.attendees.join(", ")
                        : "No attendees yet"}
                    </p>
                    {event.webLink && (
                      <p>
                        🔗{" "}
                        <a
                          href={event.webLink}
                          target="_blank"
                          rel="noopener noreferrer"
                        >
                          Event Link
                        </a>
                      </p>
                    )}

                    {role === "admin" && (
                      <div className="d-flex justify-content-between">
                        <button
                          className="btn btn-sm btn-primary me-2"
                          onClick={() => handleEditClick(event)}
                        >
                          Edit
                        </button>
                        <button
                          className="btn btn-sm btn-danger"
                          onClick={() => handleDelete(event._id)}
                        >
                          Delete
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            ))
          ) : (
            <p className="text-center">No events found.</p>
          )}
        </div>

        {editingEvent && (
          <div
            className="modal show d-block"
            tabIndex="-1"
            style={{ background: "rgba(0, 0, 0, 0.5)" }}
          >
            <div className="modal-dialog">
              <div className="modal-content">
                <div className="modal-header">
                  <h5 className="modal-title">Edit Event</h5>
                  <button
                    type="button"
                    className="btn-close"
                    onClick={() => setEditingEvent(null)}
                  ></button>
                </div>
                <div className="modal-body">
                  <form onSubmit={handleEditSubmit}>
                    <input
                      type="text"
                      className="form-control mb-2"
                      value={editTitle}
                      onChange={(e) => setEditTitle(e.target.value)}
                      required
                    />
                    <input
                      type="date"
                      className="form-control mb-2"
                      value={editDate}
                      onChange={(e) => setEditDate(e.target.value)}
                      required
                    />
                    <select
                      className="form-control mb-2"
                      value={editEventType}
                      onChange={(e) => setEditEventType(e.target.value)}
                    >
                      <option value="image">Image</option>
                      <option value="video">Video</option>
                    </select>
                    <input
                      type="url"
                      className="form-control mb-2"
                      value={editEventLink}
                      onChange={(e) => setEditEventLink(e.target.value)}
                      placeholder="Event Web Link (optional)"
                    />
                    <button className="btn btn-success w-100">
                      Save Changes
                    </button>
                  </form>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </>
  );
}

export default Events;
