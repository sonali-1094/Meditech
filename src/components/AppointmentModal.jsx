import React from "react";
import "./AppointmentModal.css";

const AppointmentModal = ({ doctor, onClose }) => {
  return (
    <div className="modal-overlay">
      <div className="modal-box">
        <h2>Book Appointment with <span>{doctor.name}</span></h2>
        <form className="modal-form">
          <input type="text" placeholder="Your Name" required />
          <input type="date" required />
          <input type="time" required />
          <textarea placeholder="Reason / Notes"></textarea>
          <div className="modal-buttons">
            <button type="submit">Confirm</button>
            <button type="button" onClick={onClose} className="cancel">Cancel</button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AppointmentModal;
