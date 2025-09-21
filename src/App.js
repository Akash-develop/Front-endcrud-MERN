import React, { useCallback } from "react";
import Navbar from "./component/NavBar";
import StudentTable from "./component/StudentTable";

function App() {
  const fetchStudents = useCallback(async (page, pageSize) => {
    const res = await fetch(
      `http://localhost:6969/students/list?page=${page}&pageSize=${pageSize}`
    );
    if (!res.ok) throw new Error("Failed to fetch students");
    return await res.json(); // backend returns { data, total }
  }, []);

  return (
    <div style={{ display: "flex", flexDirection: "column", height: "100vh" }}>
      <Navbar
        title="Student Management"
        links={[
          { label: "Home", onClick: () => alert("Home clicked") },
          { label: "About", onClick: () => alert("About clicked") },
        ]}
      />
      <div style={{ flex: 1, padding: 20, minHeight: 0 }}>
        <StudentTable fetchStudents={fetchStudents} pageSize={10} />
      </div>
    </div>
  );
}

export default App;
