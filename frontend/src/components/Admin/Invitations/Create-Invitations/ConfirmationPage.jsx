import React, { useState } from "react";
import axios from "axios";
import "./ConfirmationPage.css";

const ConfirmationPage = () => {
  const [isEditing, setIsEditing] = useState(false);

  const [eventData, setEventData] = useState({
    title: "your event title",
    tagline: "your event tagline",
    date: "your event date",
    time: "your event time",
    venue: "your event venue",
    registrationTime: "your registration time",
    website: "your webiste"
  });

  const handleChange = (e) => {
    setEventData({ ...eventData, [e.target.name]: e.target.value });
  };

 
  const handleSave = async () => {
    try {
      if (eventData._id) {
        // If _id exists, it's an update
        const response = await axios.put(`https://register-event-cwsv.onrender.com/api/invitations/${eventData._id}`, eventData);
        console.log("Updated successfully:", response.data);
        alert("✏️ Invitation updated successfully!");
      } else {
        // Else it's a new creation
        const response = await axios.post("https://register-event-cwsv.onrender.com/api/invitations", eventData);
        console.log("Created successfully:", response.data);
        alert("🎉 Invitation saved to MongoDB successfully!");
        setEventData({ ...response.data }); // store _id in eventData so further edits become updates
      }
      setIsEditing(false);
    } catch (error) {
      console.error("Save failed:", error);
      alert("❌ Something went wrong while saving. Please check the console for more details.");
    }
  };
  

  return (
    <div className="container">
      <div className="card">
        {isEditing ? (
          <div className="invitation-edit-form">
            <div className="input-field">
              <label htmlFor="title">Event Title:</label>
              <input name="title" value={eventData.title} onChange={handleChange} />
            </div>
            <div className="input-field">
              <label htmlFor="tagline">Tagline:</label>
              <textarea name="tagline" value={eventData.tagline} onChange={handleChange} />
            </div>
            <div className="input-field">
              <label htmlFor="date">Event Date:</label>
              <input name="date" value={eventData.date} onChange={handleChange} />
            </div>
            <div className="input-field">
              <label htmlFor="time">Event Time:</label>
              <input name="time" value={eventData.time} onChange={handleChange} />
            </div>
            <div className="input-field">
              <label htmlFor="venue">Event Venue:</label>
              <textarea name="venue" value={eventData.venue} onChange={handleChange} />
            </div>
            <div className="input-field">
              <label htmlFor="registrationTime">Registration Time:</label>
              <input name="registrationTime" value={eventData.registrationTime} onChange={handleChange} />
            </div>
            <div className="input-field">
              <label htmlFor="website">Company Website:</label>
              <input name="website" value={eventData.website} onChange={handleChange} />
            </div>
            <button onClick={handleSave} className="save-button">Save</button>
          </div>
        ) : (
          <>
            <h1 className="title">{eventData.title}</h1>
            <p className="subtitle">COME, EXPLORE</p>
            <p className="tagline">{eventData.tagline}</p>

            <p><strong>Date:</strong> {eventData.date}</p>
            <p><strong>Time:</strong> {eventData.time}</p>
            <p><strong>Venue:</strong><br />{eventData.venue}</p>
            <p className="italic">Registrations begin at {eventData.registrationTime}</p>

            <p className="thankyou">THANK YOU FOR YOUR REGISTRATION!</p>
            <div className="qr-placeholder">QR CODE</div>

            <p className="qr-info">
              PLEASE KEEP THIS QR CODE ON HAND TO EASE<br />
              YOUR REGISTRATION PROCESS ON THE DAY OF EVENT
            </p>
            <p className="website">{eventData.website}</p>

            <div className="center-edit-btn">
              <button onClick={() => setIsEditing(true)} className="edit-button">Edit</button>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default ConfirmationPage;
