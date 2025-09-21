import React, { useState, useEffect, useRef, useCallback } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  CircularProgress,
} from "@mui/material";

const StudentTable = ({ fetchStudents, pageSize = 10 }) => {
  const [students, setStudents] = useState([]);
  const [page, setPage] = useState(0);
  const [loading, setLoading] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const observer = useRef();

  const loadStudents = useCallback(async () => {
    setLoading(true);
    const { data, total } = await fetchStudents(page, pageSize);
    setStudents((prev) => [...prev, ...data]);
    setHasMore((page + 1) * pageSize < total);
    setLoading(false);
  }, [page, fetchStudents, pageSize]);

  useEffect(() => {
    loadStudents();
  }, [loadStudents]);

  const lastRowRef = useCallback(
    (node) => {
      if (loading) return;
      if (observer.current) observer.current.disconnect();

      observer.current = new IntersectionObserver((entries) => {
        if (entries[0].isIntersecting && hasMore) {
          setPage((prev) => prev + 1);
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
    height: '100%',      // explicitly fill parent container
    maxHeight: 'calc(100vh - 64px - 40px)', // optional: adjust for navbar + padding
    overflowY: 'auto'
  }}      >
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
          </TableBody>
        </Table>
        {loading && (
          <div style={{ textAlign: "center", padding: 10 }}>
            <CircularProgress />
          </div>
        )}
      </TableContainer>
    </div>
  );
};

export default StudentTable;
