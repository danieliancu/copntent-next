import React, { useState, useEffect } from "react";
import Carousel from "./Carousel";
import Menu from "./Menu";

const App = () => {
  const [allData, setAllData] = useState([]);
  const [filteredData, setFilteredData] = useState([]);
  const [error, setError] = useState("");
  const [selectedSource, setSelectedSource] = useState("all");

  const shuffleArray = (array) => array.sort(() => Math.random() - 0.5);

  useEffect(() => {
    const fetchAllData = async () => {
      try {
        const response = await fetch("/api/articles"); // Ruta pentru API-ul nostru
        const result = await response.json();

        if (response.ok) {
          const shuffledData = shuffleArray(result.data);
          setAllData(shuffledData);
          setFilteredData(shuffledData);
        } else {
          setError(result.error || "Failed to fetch data");
        }
      } catch (err) {
        setError("Request failed");
      }
    };

    fetchAllData();
  }, []);

  const handleFilter = (source) => {
    setSelectedSource(source);
    if (source === "all") {
      setFilteredData([...allData]); // Creează un array nou
    } else {
      const filtered = allData.filter((item) => item.source === source);
      setFilteredData([...filtered]);
    }
  };

  return (
    <div>
      <Menu selectedSource={selectedSource} handleFilter={handleFilter} />
      {error && (
        <div style={{ color: "red" }}>
          <h3>Error:</h3>
          <p>{error}</p>
        </div>
      )}
      {filteredData.length > 0 && (
        <div className="container grid-layout">
          {filteredData.length > 4 && (
            <Carousel key={selectedSource} items={filteredData.slice(0, 4)} />
          )}
          {filteredData.slice(4).map((item, index) => (
            <div className="container-news" key={index}>
              {item.imgSrc && (
                <img
                  src={item.imgSrc}
                  alt={item.text || "Image"}
                  className="news-image"
                />
              )}
              <strong className="news-source">{item.source}</strong>
              {item.href && (
                <a href={item.href} target="_blank" rel="noopener noreferrer">
                  <h3>{item.text}</h3>
                </a>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default App;
