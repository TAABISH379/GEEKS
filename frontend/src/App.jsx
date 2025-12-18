import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Header from './components/Header';
import Footer from './components/Footer';
import PrivateRoute from './components/PrivateRoute';
import { ThemeProvider } from './context/ThemeContext';
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import RestaurantList from './pages/RestaurantList'; // Will create this
import RestaurantDetail from './pages/RestaurantDetail'; // Will create this
import MyBookings from './pages/MyBookings'; // Will create this
import AdminDashboard from './pages/AdminDashboard'; // Will create this

function App() {
  return (
    <ThemeProvider>
      <Router>
        <div className="flex flex-col min-h-screen bg-white dark:bg-gray-900 transition-colors duration-300">
          <Header />
          <main className="flex-grow container mx-auto p-4 sm:p-6 md:p-8 bg-white dark:bg-gray-800 rounded-lg shadow-inner my-4 transition-colors duration-300">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/restaurants" element={<RestaurantList />} />
            <Route path="/restaurants/:id" element={<RestaurantDetail />} />

            {/* User Private Routes */}
            <Route
              path="/bookings"
              element={
                <PrivateRoute roles={['user', 'admin']}>
                  <MyBookings />
                </PrivateRoute>
              }
            />

            {/* Admin Private Routes */}
            <Route
              path="/admin/dashboard"
              element={
                <PrivateRoute roles={['admin']}>
                  <AdminDashboard />
                </PrivateRoute>
              }
            />
          </Routes>
        </main>
        <Footer />
      </div>
    </Router>
    </ThemeProvider>
  );
}

export default App;