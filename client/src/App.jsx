import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { AuthProvider }      from './context/AuthContext';
import { ThemeProvider }     from './context/ThemeContext';
import { FavoritesProvider } from './context/FavoritesContext';
import ErrorBoundary from './components/ErrorBoundary';
import PrivateRoute  from './components/PrivateRoute';
import Layout        from './components/Layout';

import Home         from './pages/Home';
import Metrics      from './pages/Metrics';
import MetricDetail from './pages/MetricDetail';
import Favorites    from './pages/Favorites';
import About        from './pages/About';
import Login        from './pages/Login';
import Dashboard    from './pages/Dashboard';
import NotFound     from './pages/NotFound';
import Forbidden    from './pages/Forbidden';
import ServerError  from './pages/ServerError';

export default function App() {
  return (
    <BrowserRouter>
      <ThemeProvider>
      <AuthProvider>
      <FavoritesProvider>
        <ErrorBoundary>
          <Routes>
            <Route element={<Layout />}>
              <Route path="/"           element={<Home />} />
              <Route path="/metrics"    element={<Metrics />} />
              <Route path="/metrics/:id" element={<MetricDetail />} />
              <Route path="/favorites"  element={<Favorites />} />
              <Route path="/about"      element={<About />} />
              <Route path="/login"      element={<Login />} />
              <Route path="/dashboard"  element={
                <PrivateRoute><Dashboard /></PrivateRoute>
              } />
              <Route path="/403"        element={<Forbidden />} />
              <Route path="/500"        element={<ServerError />} />
              <Route path="*"           element={<NotFound />} />
            </Route>
          </Routes>
        </ErrorBoundary>
      </FavoritesProvider>
      </AuthProvider>
      </ThemeProvider>
    </BrowserRouter>
  );
}
