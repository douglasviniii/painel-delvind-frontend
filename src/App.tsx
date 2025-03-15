import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { DataProvider } from './context/DataContext';
import Login from './pages/Login';
import ResetPassword from './pages/ResetPassword';
import Dashboard from './pages/Dashboard';
import CreateReport from './pages/CreateReport';
import Tasks from './pages/Tasks';
import Tickets from './pages/Tickets';
import Alerts from './pages/Alerts';
import Admin from './pages/Admin';
import AdminTeams from './pages/AdminTeams';
import AdminUsers from './pages/AdminUsers';
import AdminBudget from './pages/AdminBudget';
import AdminFinance from './pages/Finance';
import Github from './pages/Github';

function App() {
  return (
    <Router>
      <AuthProvider>
        <DataProvider>
          <Routes>
            <Route path="/login" element={<Login />} />
            <Route path="/reset-password" element={<ResetPassword />} />
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/reports/new" element={<CreateReport />} />
            <Route path="/tasks" element={<Tasks />} />
            <Route path="/tickets" element={<Tickets />} />
            <Route path="/alerts" element={<Alerts />} />
            <Route path="/admin" element={<Admin />} />
            <Route path="/admin/teams" element={<AdminTeams />} />
            <Route path="/admin/users" element={<AdminUsers />} />
            <Route path="/AdminFinance" element={<AdminFinance />} />
            <Route path="/admin/budget" element={<AdminBudget />} />
            <Route path="/github" element={<Github/>}/>
                        <Route path="/" element={<Navigate to="/login" replace />} />
            <Route path="*" element={<Navigate to="/login" replace />} />
          </Routes>
        </DataProvider>
      </AuthProvider>
    </Router>
  );
}

export default App;