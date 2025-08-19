import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { SignInForm } from "@/components/SignInForm";
import { useAuth } from "@/contexts/AuthContext";
import { useRequireAuth } from "@/hooks/useRequireAuth";

function Dashboard() {
  const { user, signOut } = useAuth();
  useRequireAuth(); // protect this route

  return (
    <div className="p-4">
      <h1 className="text-xl">Dashboard</h1>
      <p>Welcome {user?.email}</p>
      <button onClick={signOut} className="px-4 py-2 bg-red-500 text-white rounded">
        Sign Out
      </button>
    </div>
  );
}

export default function App() {
  return (
    <Router>
      <Routes>
        <Route path="/login" element={<SignInForm />} />
        <Route path="/" element={<Dashboard />} />
      </Routes>
    </Router>
  );
}
