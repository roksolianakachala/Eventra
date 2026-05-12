import { Routes, Route } from "react-router-dom";

import MainLayout from "../widgets/Layout/MainLayout";

import HomePage from "../pages/Home/HomePage";
import EventsPage from "../pages/Events/EventsPage"; 
import EventDetailsPage from "../pages/EventDetails/EventDetailsPage.jsx"; 
import TutorsPage from "../pages/Tutors/TutorsPage";
import ProfilePage from "../pages/Profile/ProfilePage";
import LoginPage from "../pages/Auth/LoginPage";
import OAuthCallbackPage from "../pages/Auth/OAuthCallbackPage";
import RegisterPage from "../pages/Auth/RegisterPage";
import BecomeTutorPage from "../pages/BecomeTutor/BecomeTutorPage";
import CreateEventPage from "../pages/CreateEvent/CreateEventPage";
import PeoplePage from "../pages/People/PeoplePage";
import SavedPage from "../pages/Saved/SavedPage";
import MessagesPage from "../pages/Messages/MessagesPage";
import SettingsPage from "../pages/Settings/SettingsPage";
import PrivacyPage from "../pages/Auth/PrivacyPage";
import DataDeletionPage from "../pages/Auth/DataDeletionPage";


function AppRoutes() {
  return (
    <Routes>
      <Route path="/" element={<MainLayout />}>
        <Route index element={<HomePage />} />
        <Route path="events" element={<EventsPage />} /> 
        <Route path="events/:id" element={<EventDetailsPage />} /> 
        <Route path="tutors" element={<TutorsPage />} />
        <Route path="profile" element={<ProfilePage />} />
        <Route path="login" element={<LoginPage />} />
        <Route path="auth/callback" element={<OAuthCallbackPage />} />
        <Route path="become-tutor" element={<BecomeTutorPage />} />
        <Route path="register" element={<RegisterPage />} />
        <Route path="create-event" element={<CreateEventPage />} />
        <Route path="people" element={<PeoplePage />} />
        <Route path="saved" element={<SavedPage />} />
        <Route path="messages" element={<MessagesPage />} />
        <Route path="settings" element={<SettingsPage />} /> 
        <Route path="privacy" element={<PrivacyPage />} />
        <Route path="data-deletion" element={<DataDeletionPage />} />
      </Route>
    </Routes>
  );
}

export default AppRoutes;
