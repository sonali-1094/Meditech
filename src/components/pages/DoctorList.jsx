import React, { useState } from "react";
import doctors from "../../assets/doctorList";
import AppointmentModal from "../AppointmentModal";
import "./DoctorList.css";

const DoctorList = () => {
  const [showAll, setShowAll] = useState(false);
  const [selectedDoctor, setSelectedDoctor] = useState(null);

  const visibleDoctors = showAll ? doctors : doctors.slice(0, 3);

  const handleBook = (doctor) => {
    setSelectedDoctor(doctor);
  };

  return (
    <div className="doctor-container">
      <h2 className="doctor-heading">Available Doctors</h2>

      <div className="doctor-list">
        {visibleDoctors.map((doc) => (
          <div className="doctor-card" key={doc.id}>
            <img src={doc.image} alt={doc.name} className="doctor-img" />
            <h3>{doc.name}</h3>
            <p className="doctor-spec">{doc.specialization}</p>
            <button className="book-btn" onClick={() => handleBook(doc)}>
              Book Appointment
            </button>
          </div>
        ))}
      </div>

      {!showAll && (
        <button className="show-more-btn" onClick={() => setShowAll(true)}>
          Show More
        </button>
      )}

      {selectedDoctor && (
        <AppointmentModal
          doctor={selectedDoctor}
          onClose={() => setSelectedDoctor(null)}
        />
      )}
    </div>
  );
};

export default DoctorList;
