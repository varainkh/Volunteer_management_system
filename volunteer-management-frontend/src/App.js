import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';

import LoginPage from './pages/Login';
import RegisterPage from './pages/Register';
import VolunteerDashboard from './pages/VolunteerDashboard';
import AdminDashboard from './pages/AdminDashboard';
import ListVolunteers from './pages/AdminVolunteerList';
import AddEvent from './pages/AddEvent';
import ListEvents from './pages/ListEvents';
import PrivateRoute from './components/PrivateRoute';
import AssignHours from './pages/AssignHours';
import RequireAuth from './components/RequireAuth';
import MarkAttendance from "./pages/MarkAttendance";

function App() {
  const token = localStorage.getItem('token');
  const role = localStorage.getItem('role');

  return (
    <Router>
      <Routes>
        {/* Public Routes */}
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />

        {/* Role-based redirect from root */}
        <Route
          path="/"
          element={
            token ? (
              role === 'admin' ? <Navigate to="/admin/dashboard" /> : <Navigate to="/volunteer/dashboard" />
            ) : (
              <Navigate to="/login" />
            )
          }
        />

        {/* Volunteer Protected Routes */}
        <Route element={<RequireAuth allowedRole="volunteer" />}>
          <Route path="/volunteer/dashboard" element={<VolunteerDashboard />} />
        </Route>

        {/* Admin Protected Routes */}
        <Route element={<RequireAuth allowedRole="admin" />}>
          <Route path="/admin/dashboard" element={<AdminDashboard />} />
          <Route path="/admin/volunteers" element={<ListVolunteers />} />
          <Route path="/admin/events/add" element={<AddEvent />} />
          <Route path="/admin/events" element={<PrivateRoute><ListEvents /></PrivateRoute>} />
          <Route path="/admin/hours/assign" element={<PrivateRoute role="admin"> <AssignHours /></PrivateRoute>} />
          <Route path="/admin/attendance/mark" element={<MarkAttendance />} />

        </Route>
      </Routes>
    </Router>
  );
}

export default App;

