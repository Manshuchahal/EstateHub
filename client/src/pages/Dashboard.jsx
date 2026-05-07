import { useEffect, useState } from "react";
import API from "../services/api";

export default function Dashboard() {
  const [properties, setProperties] = useState([]);

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem("user"));

    API.get("/properties").then(res => {
      const myProps = res.data.filter(p => p.ownerId == user.id);
      setProperties(myProps);
    });
  }, []);

  return (
    <div>
      <h2>My Properties</h2>

      {properties.map(p => (
        <div key={p.id}>{p.title}</div>
      ))}
    </div>
  );
}