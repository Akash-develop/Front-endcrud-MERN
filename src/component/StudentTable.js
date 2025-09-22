import React, { useState, useEffect, useRef, useCallback, useContext } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
} from "@mui/material";
import { AuthContext } from "../component/AuthContext";
import "./StudentTable.css";

const StudentTable = ({ pageSize = 10 }) => {
  const [students, setStudents] = useState([]);
  const [page, setPage] = useState(0);
  const [loading, setLoading] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const observer = useRef();

  const { token } = useContext(AuthContext);
  const hasFetched = useRef(false);

  const fetchStudents = useCallback(
    async (page, pageSize) => {
      const res = await fetch(
        `http://localhost:6969/students/list?page=${page}&pageSize=${pageSize}`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      if (!res.ok) throw new Error("Failed to fetch students");
      return await res.json();
    },
    [token]
  );

const loadStudents = useCallback(async () => {
  try {
    const { data, total } = await fetchStudents(page, pageSize);
    setStudents((prev) => [...prev, ...data]);
    setHasMore((page + 1) * pageSize < total);
  } catch (err) {
    console.error(err);
  } finally {
    setLoading(false);
  }
}, [page, fetchStudents, pageSize]);


  useEffect(() => {
    if (!hasFetched.current) {
      loadStudents();
      hasFetched.current = true;
    }
  }, [loadStudents]);

  useEffect(() => {
    if (page === 0) return;
    loadStudents();
  }, [page, loadStudents]);

const lastRowRef = useCallback(
  (node) => {
    if (observer.current) observer.current.disconnect();

    observer.current = new IntersectionObserver((entries) => {
      if (entries[0].isIntersecting && hasMore && !loading) {
        // ✅ show loader immediately
        setLoading(true);

        setTimeout(() => {
          setPage((prev) => prev + 1);
        }, 1500); // delay page increment
      }
    });

    if (node) observer.current.observe(node);
  },
  [loading, hasMore]
);

  return (
    <div style={{ flex: 1, display: "flex", flexDirection: "column", minHeight: 0 }}>
      <TableContainer
        component={Paper}
        style={{
          height: "100%",
          maxHeight: "calc(100vh - 64px - 40px)",
          overflowY: "auto",
        }}
      >
        <Table stickyHeader>
          <TableHead>
            <TableRow>
              <TableCell>ID</TableCell>
              <TableCell>Name</TableCell>
              <TableCell>Age</TableCell>
              <TableCell>Grade</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {students.map((student, index) => {
              const isLastRow = index === students.length - 1;
              return (
                <TableRow key={student.id} ref={isLastRow ? lastRowRef : null}>
                  <TableCell>{student.sno}</TableCell>
                  <TableCell>{student.name}</TableCell>
                  <TableCell>{student.age}</TableCell>
                  <TableCell>{student.grade}</TableCell>
                </TableRow>
              );
            })}

            {loading && (
              <TableRow key="loading-row">
                <TableCell colSpan={4} align="center">
                  <div className="dots-loading">
                    <span>.</span>
                    <span>.</span>
                    <span>.</span>
                  </div>
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </TableContainer>
    </div>
  );
};

export default StudentTable;
