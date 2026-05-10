import { useState } from "react";
import SideNav from "./Components/SideNav";
import LoginPage from "./Pages/LoginPage";
import DashboardPage from "./Pages/DashboardPage";
import CreateTripPage from "./Pages/CreateTripPage";
import TripsPage from "./Pages/TripsPage";
import ItineraryBuilderPage from "./Pages/ItineraryBuilderPage";
import ItineraryViewPage from "./Pages/ItineraryViewPage";
import CitySearchPage from "./Pages/CitySearchPage";
import ActivitySearchPage from "./Pages/ActivitySearchPage";
import BudgetPage from "./Pages/BudgetPage";
import PackingPage from "./Pages/PackingPage";
import SharedPage from "./Pages/SharedPage";
import ProfilePage from "./Pages/ProfilePage";
import NotesPage from "./Pages/NotesPage";
import AdminPage from "./Pages/AdminPage";

export default function App() {
  const [page, setPage] = useState("login");
  const [currentTrip, setCurrentTrip] = useState(() => {
    try {
      const id = localStorage.getItem("currentTripId");
      return id ? { id: JSON.parse(id) } : null;
    } catch { return null; }
  });

  // Wrap setCurrentTrip to also persist to localStorage
  const selectTrip = (trip) => {
    setCurrentTrip(trip);
    if (trip?.id) localStorage.setItem("currentTripId", JSON.stringify(trip.id));
  };

  if (page === "login") return <LoginPage setPage={setPage} />;

  const pageMap = {
    dashboard:           <DashboardPage setPage={setPage} setCurrentTrip={selectTrip} />,
    trips:               <TripsPage setPage={setPage} setCurrentTrip={selectTrip} />,
    "create-trip":       <CreateTripPage setPage={setPage} />,
    "itinerary-builder": <ItineraryBuilderPage setPage={setPage} currentTrip={currentTrip} />,
    "itinerary-view":    <ItineraryViewPage setPage={setPage} currentTrip={currentTrip} />,
    "city-search":       <CitySearchPage setPage={setPage} />,
    "activity-search":   <ActivitySearchPage setPage={setPage} />,
    budget: <BudgetPage setPage={setPage} currentTrip={currentTrip} />,
    packing:             <PackingPage setPage={setPage} currentTrip={currentTrip} />,
    shared:              <SharedPage setPage={setPage} currentTrip={currentTrip} />,
    profile:             <ProfilePage setPage={setPage} />,
    notes:               <NotesPage setPage={setPage} currentTrip={currentTrip} />,
    admin:               <AdminPage setPage={setPage} />,
  };

  return (
    <div style={{ display: "flex", minHeight: "100vh", fontFamily: "system-ui, -apple-system, sans-serif", background: "#f8f8f6" }}>
      <SideNav page={page} setPage={setPage} />
      <main style={{ flex: 1, padding: "32px 36px", overflowY: "auto" }}>
        {pageMap[page] || <DashboardPage setPage={setPage} />}
      </main>
    </div>
  );
}