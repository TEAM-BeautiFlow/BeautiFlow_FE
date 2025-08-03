import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import BookingPage from './pages/Consumer/BookingPage';
import AppointmentBooking from './pages/Consumer/AppointmentBooking';
import ArtDetailPage from './pages/Consumer/ArtDetailPage';
import Reservation from './pages/Consumer/Reservation';
import TreatmentOptionsPage from './pages/Consumer/TreatmentOptionsPage';
import TreatmentBookingPage from './pages/Consumer/TreatmentBookingPage';
import ReservationCheck from './pages/Consumer/ReservationCheck';
import OwnerVerificationPage from './pages/\bOwner/OwnerVerificationPage';
import OwnerStoreInfoPage from './pages/\bOwner/OwnerStoreInfopage';
import OwnerStoreIntroPage from './pages/\bOwner/OwnerStoreIntroPage';
import OwnerSalesPage from './pages/\bOwner/OwnerSalesPage';
import OwnerBusinessHoursPage from './pages/\bOwner/OwnerBusinessHoursPage';
import OwnerBusinessRegistrationPage from './pages/\bOwner/OwnerBusinessRegistrationPage';
import OwnerTreatmentsPage from './pages/\bOwner/OwnerTreatmentsPage';
import OwnerEditTreatmentPage from './pages/\bOwner/OwnerEditTreatmentPage';
import OwnerAnnouncementsPage from './pages/\bOwner/OwnerAnnouncementsPage';
import OwnerEditAnnouncementPage from './pages/\bOwner/OwnerEditAnnouncementPage';

function App() {
import { useState } from "react";
import reactLogo from "./assets/react.svg";
import viteLogo from "/vite.svg";

function App() {
  const [count, setCount] = useState(0);

  return (
    <>
      <div>
        <a href="https://vite.dev" target="_blank">
          <img src={viteLogo} className="logo" alt="Vite logo" />
        </a>
        <a href="https://react.dev" target="_blank">
          <img src={reactLogo} className="logo react" alt="React logo" />
        </a>
      </div>
      <h1>Vite + React</h1>
      <div className="card">
        <button onClick={() => setCount(count => count + 1)}>
          count is {count}
        </button>
        <p>
          Edit <code>src/App.tsx</code> and save to test HMR
        </p>
      </div>
      <p className="read-the-docs">
        Click on the Vite and React logos to learn more
      </p>
    </>
  );
}

export default App;
