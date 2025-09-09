// src/App.jsx
import './App.css';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import LoginScreen from './screens/LoginScreen.jsx';
import Layout from './components/Layout.jsx';
import Overview from './screens/Overview.jsx';
import Analytics from './screens/Analytics.jsx';
import Projects from './screens/Projects.jsx';
import Settings from './screens/Settings.jsx';
import HomeScreen from './screens/HomeScreen.jsx';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Login page */}
        <Route path="/" element={<LoginScreen />} />

        {/* Optional Home page */}
        <Route path="/home" element={<HomeScreen />} />

        {/* Dashboard with persistent sidebar */}
        <Route path="/dashboard" element={<Layout />}>
          {/* Redirect /dashboard to /dashboard/overview */}
          <Route index element={<Navigate to="overview" replace />} />

          {/* Nested routes */}
          <Route path="overview" element={<Overview />} />
          <Route path="analytics" element={<Analytics />} />
          <Route path="projects" element={<Projects />} />
          <Route path="settings" element={<Settings />} />
        </Route>

        {/* Catch-all redirect to login */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
