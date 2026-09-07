import { Routes, Route } from "react-router-dom";
import Login from "./pages/Login.jsx";
import Dashboard from "./pages/Dashboard.jsx";
import Channels from "./pages/Channels.jsx";
import PopularChannels from "./pages/PopularChannels.jsx";
import Genres from "./pages/Genres.jsx";
import Banners from "./pages/Banners.jsx";
import Advertisements from "./pages/Advertisements.jsx";
import Settings from "./pages/Settings.jsx";
import Help from "./pages/Help.jsx";
import Layout from "./components/Layout.jsx";
import ProtectedRoute from "./components/ProtectedRoute.jsx";

export default function App() {
  return (
    <Routes>
      <Route path="/login" element={<Login />} />
      <Route
        path="/"
        element={
          <ProtectedRoute>
            <Layout>
              <Dashboard />
            </Layout>
          </ProtectedRoute>
        }
      />
      <Route
        path="/channels"
        element={
          <ProtectedRoute>
            <Layout>
              <Channels />
            </Layout>
          </ProtectedRoute>
        }
      />
      <Route
        path="/popular-channels"
        element={
          <ProtectedRoute>
            <Layout>
              <PopularChannels />
            </Layout>
          </ProtectedRoute>
        }
      />
      <Route
        path="/genres"
        element={
          <ProtectedRoute>
            <Layout>
              <Genres />
            </Layout>
          </ProtectedRoute>
        }
      />
      <Route
        path="/banners"
        element={
          <ProtectedRoute>
            <Layout>
              <Banners />
            </Layout>
          </ProtectedRoute>
        }
      />
      <Route
        path="/advertisements"
        element={
          <ProtectedRoute>
            <Layout>
              <Advertisements />
            </Layout>
          </ProtectedRoute>
        }
      />
      {/* <Route
        path="/settings"
        element={
          <ProtectedRoute>
            <Layout>
              <Settings />
            </Layout>
          </ProtectedRoute>
        }
      /> */}
      <Route
        path="/help"
        element={
          <ProtectedRoute>
            <Layout>
              <Help />
            </Layout>
          </ProtectedRoute>
        }
      />
    </Routes>
  );
}