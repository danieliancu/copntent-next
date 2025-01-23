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
  const [isRotated, setIsRotated] = useState(false); // Stare pentru rotația SVG-ului
  const [showScrollTop, setShowScrollTop] = useState(false); // Stare pentru săgeata de scroll-top


  // const shuffleArray = (array) => array.sort(() => Math.random() - 0.5);

  const handleSvgClick = () => {
    setIsRotated((prev) => !prev); // Inversează starea
  };  

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

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 200) {
        setShowScrollTop(true);
      } else {
        setShowScrollTop(false);
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const handleScrollTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };  

  const handleFilter = (source) => {
    setSelectedSource(source);
    filterData(source, selectedCategory);
  };

  const handleCategoryFilter = (category) => {
    setSelectedCategory(category);
    setSelectedSource("all"); // Resetează sursa la "all" când se schimbă categoria
    filterData("all", category); // Resetează filtrarea

    // Derulează la începutul paginii
    window.scrollTo({ top: 0, behavior: "smooth" });   
    
    setIsRotated(false); // Resetează rotația SVG-ului
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
    // Filtrăm articolele pentru categoria selectată
    const articlesInCategory = allData.filter((item) => item.cat === selectedCategory);
  
    // Filtrăm articolele cu imgSrc valid
    const validArticles = articlesInCategory.filter((item) => item.imgSrc);
  
    // Numărăm articolele cu imagini pentru fiecare sursă
    const sourceCounts = {};
    validArticles.forEach((item) => {
      sourceCounts[item.source] = (sourceCounts[item.source] || 0) + 1;
    });
  
    // Returnăm sursele cu cel puțin 4 articole cu imgSrc valid
    return Object.keys(sourceCounts).filter((source) => sourceCounts[source] >= 5);
  };
  
  
  
  

  

return (
<div>
  <Menu
    selectedSource={selectedSource}
    selectedCategory={selectedCategory}
    handleFilter={handleFilter}
    handleCategoryFilter={handleCategoryFilter}
    availableSources={getSourcesForCategory()}
  />
  {loading && (
    <div className="loading">
      <div className="spinner"></div>
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
      {filteredData.filter((item) => item.imgSrc).length > 4 && (
        <Carousel
          key={selectedSource}
          items={filteredData
            .filter((item) => item.imgSrc) // Filtrăm articolele cu imgSrc valid
            .slice(0, 4)} // Limităm la primele 4 articole
        />
      )}
      {filteredData.filter((item) => !item.imgSrc).length > 0 && ( // Verificăm dacă există articole fără imgSrc
        
        <div className="container-news container-news-no-img">
          <div className="container-news-no-img-top">
            Top știri
            <span
            className="caret-news-top"
            onClick={handleSvgClick} // Adaugă handler-ul de click
            style={{ cursor: "pointer" }} // Pointer pentru interacțiune
          >
            <svg
              width="13"
              height="13"
              xmlns="http://www.w3.org/2000/svg"
              className={isRotated ? "rotated" : ""} // Adaugă clasa în funcție de stare
            >
              <polygon points="6,0 0,12 12,12" fill="white" />
            </svg>
            <span
              style={{
                  fontSize:"14px",
                  textTransform:"lowercase",
                  fontWeight:"lighter",
                  paddingLeft:"5px"
              }}>
              (click pentru {isRotated ? "a ascunde" : "a vizualiza"})
              </span>
          </span>
          </div>

          <div
          className={`news-item-container ${
            isRotated ? "show-items" : "hide-items"
          }`} // top stiri dinamic
          >
          {filteredData
            .filter((item) => !item.imgSrc) // Elemente fără imgSrc
            .sort((a, b) => new Date(b.date) - new Date(a.date))
            .map((item, index) => (
              <div className="news-item" key={index}>
                
                {selectedSource === "all" && (
                  <strong className="news-source">{item.source} | </strong>
                )}

                <p
                  className="ago"
                  style={{
                    paddingLeft: selectedSource !== "all" ? "20px" : "0",
                  }}
                >
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
                      return diffMinutes > 19
                        ? `Acum ${diffMinutes} de minute`
                        : `Acum ${diffMinutes} minute`;
                    } else {
                      const hours = Math.floor(diffMinutes / 60);
                      const minutes = diffMinutes % 60;
                    
                      const hourText =
                        hours === 1
                          ? "o oră"
                          : hours === 2
                          ? "două ore"
                          : `${hours} ore`;
                    
                      const minuteText =
                        minutes === 0
                          ? ""
                          : minutes > 19
                          ? `${minutes} de minute`
                          : `${minutes} minute`;
                    
                      return `Acum ${hourText}${minuteText ? ` și ${minuteText}` : ""}`;
                    }                    
                  })()}
                </p>
              



                {item.href && (
                  <a href={item.href} target="_blank" rel="noopener noreferrer">
                    <h3>{item.text}</h3>

                  </a>
                )}
              </div>
            ))}
        </div>
        </div>
      )}
      {filteredData
        .filter((item) => item.imgSrc) // Elemente cu imgSrc valid
        .sort((a, b) => new Date(b.date) - new Date(a.date))
        .slice(4)
        .map((item, index) => (
          <div className="container-news" key={index}>
            <img
              src={item.imgSrc}
              alt={item.text || "Image"}
              className="news-image"
            />


            {selectedSource === "all" && (
              <strong className="news-source">{item.source}</strong>
            )}

            
            
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
                          return diffMinutes > 19
                            ? `Acum ${diffMinutes} de minute`
                            : `Acum ${diffMinutes} minute`;
                        } else {
                          const hours = Math.floor(diffMinutes / 60);
                          const minutes = diffMinutes % 60;
                        
                          const hourText =
                            hours === 1
                              ? "o oră"
                              : hours === 2
                              ? "două ore"
                              : `${hours} ore`;
                        
                          const minuteText =
                            minutes === 0
                              ? ""
                              : minutes > 19
                              ? `${minutes} de minute`
                              : `${minutes} minute`;
                        
                          return `Acum ${hourText}${minuteText ? ` și ${minuteText}` : ""}`;
                        }
                        
                      })()}
                    </p>
              </a>
            )}
          </div>
        ))}
    </div>
  )}

  {/* Săgeata scroll-top */}
  {showScrollTop && (
    <div onClick={handleScrollTop} className="scroll-top" title="Scroll to top">▲</div>
  )}

  </div>
  );
};

export default App;
