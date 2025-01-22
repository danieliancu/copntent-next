import React, { useState, useEffect } from "react";
import Carousel from "./Carousel";
import Menu from "./Menu";

const App = () => {
  const [allData, setAllData] = useState([]);
  const [filteredData, setFilteredData] = useState([]);
  const [error, setError] = useState("");
  const [selectedSource, setSelectedSource] = useState("all");
  const [selectedCategory, setSelectedCategory] = useState("Actualitate"); // Implicit "Actualitate"
  const [loading, setLoading] = useState(true);

  // const shuffleArray = (array) => array.sort(() => Math.random() - 0.5);

  useEffect(() => {
    const fetchAllData = async () => {
      setLoading(true); // Afișează spinnerul
      try {
        const response = await fetch("/api/articles");
        const result = await response.json();

        if (response.ok) {
          // const shuffledData = shuffleArray(result.data);
          setAllData(result.data);
          filterData("all", "Actualitate", result.data); // Filtrare implicită la încărcare
        } else {
          setError(result.error || "Failed to fetch data");
        }
      } catch (err) {
        setError("Request failed");
      } finally {
        setLoading(false); // Ascunde spinnerul
      }
    };

    fetchAllData();
  }, []);

  const handleFilter = (source) => {
    setSelectedSource(source);
    filterData(source, selectedCategory);
  };

  const handleCategoryFilter = (category) => {
    setSelectedCategory(category);
    filterData("all", category); // Resetează sursa la "all" când se schimbă categoria
  };

  const filterData = (source, category, data = allData) => {
    let filtered = data;

    if (source !== "all") {
      filtered = filtered.filter((item) => item.source === source);
    }

    if (category) {
      filtered = filtered.filter((item) => item.cat === category);
    }

    setFilteredData(filtered);
  };

  const getSourcesForCategory = () => {
    const sourcesInCategory = new Set(
      allData.filter((item) => item.cat === selectedCategory).map((item) => item.source)
    );
    return Array.from(sourcesInCategory);
  };

  return (
    <div>
      <Menu
        selectedSource={selectedSource}
        selectedCategory={selectedCategory}
        handleFilter={handleFilter}
        handleCategoryFilter={handleCategoryFilter}
        availableSources={getSourcesForCategory()} // Trimite sursele disponibile pentru categoria selectată
      />
      {loading && (
        <div className="loading">
          <div className="spinner"></div> {/* Spinnerul afișat în timpul încărcării */}
        </div>
      )}
      {!loading && error && (
        <div style={{ color: "red", textAlign: "center", padding: "20px" }}>
          <h3>Error:</h3>
          <p>{error}</p>
        </div>
      )}
      {!loading && filteredData.length > 0 && (
        <div className="container grid-layout">
          {filteredData.length > 4 && (
            <Carousel key={selectedSource} items={filteredData.slice(0, 4)} />
          )}
          {filteredData
            .sort((a, b) => new Date(b.date) - new Date(a.date))
            .slice(4)
            .map((item, index) => (
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
                    <p className="ago">
                      {(() => {
                        const now = new Date();
                        const date = new Date(item.date);
                        const diffMs = now - date;
                        const diffMinutes = Math.floor(diffMs / 60000);

                        if (diffMinutes === 0) {
                          return `Chiar acum`;
                        } else if (diffMinutes === 1) {
                          return `Acum 1 minut`;
                        } else if (diffMinutes < 60) {
                          return `Acum ${diffMinutes} minute`;
                        } else {
                          const hours = Math.floor(diffMinutes / 60);
                          const minutes = diffMinutes % 60;
                          return `Acum ${hours} ore și ${minutes} minute`;
                        }
                      })()}
                    </p>
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
