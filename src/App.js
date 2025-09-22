import React, { useContext } from "react";
import Navbar from "./component/NavBar";
import StudentTable from "./component/StudentTable";
import AuthPage from "./component/AuthPage";
import { AuthContext } from "./component/AuthContext";

function App() {
  const { token, logout } = useContext(AuthContext);
  if (!token) return <AuthPage />;

  return (
    <div style={{ display: "flex", flexDirection: "column", height: "100vh" }}>
      <Navbar
        title="Student Management"
        links={[
          { label: "Home", onClick: () => alert("Home clicked") },
          { label: "About", onClick: () => alert("About clicked") },
          { label: "Logout", onClick: logout },
        ]}
      />
      <div style={{ flex: 1, padding: 20, minHeight: 0 }}>
        <StudentTable pageSize={10} />
      </div>
    </div>
  );
}

export default App;
