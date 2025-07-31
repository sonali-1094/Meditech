import React from "react";
import "./index.css";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import DoctorList from "./components/pages/DoctorList";
import MentalHealth from "./components/Mentalhealth";
import Mentalwellness from "./components/pages/Mentalwellness";
import PublicHealth from "./components/pages/PublicHealth";
import HealthRecords from "./components/pages/HealthRecords";
import Emergency from "./components/pages/Emergency"; 




function App() {
  return (
    <Router>
      <Navbar />

      <main className="container">
        <Routes>
          <Route
            path="/"
            element={
              <>
                <h1 className="hero-title">Welcome to Meditech</h1>
                <p className="hero-subtitle">
                  Bridging the gap between patients and care — Online doctor consultations, mental health support, and digital health management.
                </p>

                <div className="hero-buttons">
                  <a href="/doctor-list" className="hero-button btn-blue">Book Appointment</a>
                  <a href="/mental-wellness" className="hero-button btn-green">Mental Wellness</a>
                  <a href="/health-records" className="hero-button btn-outline">My Health Records</a>
                </div>

                <img
                  className="hero-image"
                  src="https://img.freepik.com/free-vector/online-doctor-concept-illustration_114360-4768.jpg"
                  alt="Healthcare illustration"
                />

                <DoctorList />
              </>
            }
          />
          <Route path="/mental-wellness" element={<Mentalwellness />} />
          <Route path="/doctor-list" element={<DoctorList />} />
          <Route path="/mental-health" element={<MentalHealth />} />
          <Route path="/health-records" element={<HealthRecords />} />
          <Route path="/awareness" element={<PublicHealth />} />
          <Route path="/emergency" element={<Emergency />} /> 


          </Routes>
      </main>
      

      <Footer />
    </Router>
  );
}

export default App;
