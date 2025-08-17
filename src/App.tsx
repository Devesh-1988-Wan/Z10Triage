import { useAuth } from './contexts/AuthContext';
import Spinner from './components/Spinner';
import AuthenticatedRoutes from './components/AuthenticatedRoutes';
import PublicRoutes from './components/PublicRoutes';

function App() {
  const { user, isInitialized } = useAuth();

  // THIS IS THE CRITICAL LOGIC
  // Wait until the AuthProvider has checked for a session.
  // Before it's initialized, show a loading spinner to prevent a "flash"
  // of the wrong screen or a blank page.
  if (!isInitialized) {
    return <Spinner />;
  }

  // Once initialized, render the correct routes based on user state.
  return user ? <AuthenticatedRoutes /> : <PublicRoutes />;
}

export default App;