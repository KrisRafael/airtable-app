import React, { useEffect, useState } from "react";
import './App.css';

function App() {
  const [records, setRecords] = useState([]);

  // Načítání dat z Airtable
  useEffect(() => {
    const fetchData = async () => {
      const url = `https://api.airtable.com/v0/${process.env.REACT_APP_AIRTABLE_BASE}/${process.env.REACT_APP_TABLE}`;
      const resp = await fetch(url, {
        headers: {
          Authorization: `Bearer ${process.env.REACT_APP_AIRTABLE_TOKEN}`,
        },
      });
      const data = await resp.json();
      setRecords(data.records || []);
    };

    fetchData();

    const interval = setInterval(fetchData, 10000);
    return () => clearInterval(interval);
  }, []);

  const getStatusColor = (status) => {
    if (!status) return "#9e9e9e"; // šedá pro neznámý status
    const s = status.toString().trim().toLowerCase();
    switch (s) {
      case "done":
        return "#4caf50"; 
      case "in progress":
        return "#ff9800"; 
      case "not started":
        return "dodgerblue"; 
      case "blocked":
        return "#d32f2f"; 
      default:
        return "#9e9e9e"; 
    }
  };

  return (
    <div>
      <h1>Project Table</h1>
      <div className="cards-container">
        {records.map((rec) => (
          <div key={rec.id} className="card">
            {Object.entries(rec.fields).map(([field, value]) => {
              const fieldName = field ? field.toString().trim().toLowerCase() : "";
              const fieldValue = value !== undefined && value !== null ? value.toString() : "";
              return (
                <p key={field}>
                  <strong>{field}:</strong>{" "}
                  {fieldName === "project status" ? (
                    <span
                      className="status-badge"
                      style={{ backgroundColor: getStatusColor(fieldValue) }}
                    >
                      {fieldValue}
                    </span>
                  ) : Array.isArray(value) ? value.join(", ") : fieldValue}
                </p>
              );
            })}
          </div>
        ))}
      </div>
    </div>
  );
}

export default App;






