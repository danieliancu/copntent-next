import React, { useState } from "react";

const Menu = ({
  selectedSource,
  selectedCategory,
  handleFilter,
  handleCategoryFilter,
  availableSources,
}) => {
  const [dropdownOpen, setDropdownOpen] = useState(false); // Controlăm starea dropdown-ului
  const categories = ["Actualitate", "Economie", "Sport", "Sănătate", "Monden"];

  const toggleDropdown = () => setDropdownOpen((prev) => !prev);

  return (
    <div className="menu">
      <div style={{ display: "flex", alignItems: "center" }}>
        <h1 className="logo">
          <a href="/" style={{ letterSpacing: "-1px", color: "black" }}>
            <span style={{ paddingRight: "10px" }}>newsflow.ro</span> 
          </a>
        </h1>
        <div className="dropdown">
          <div
            className="dropdown-trigger"
            onClick={toggleDropdown}
          >
            {selectedCategory}
            <span
              style={{
                marginLeft: "10px",
                transform: dropdownOpen ? "rotate(180deg)" : "rotate(0)",
                transition: "transform 0.2s ease",
              }}
            >
              ▼
            </span>
          </div>
          {dropdownOpen && (
            <div className="dropdown-menu">
              {categories.map((category) => (
                <div
                  key={category}
                  onClick={() => {
                    handleCategoryFilter(category);
                    setDropdownOpen(false); // Închide dropdown-ul după selecție
                  }}
                  style={{
                    padding: "10px",
                    cursor: "pointer",
                    backgroundColor:
                      selectedCategory === category ? "black" : "white",
                    color: selectedCategory === category ? "white" : "black",
                  }}
                  className={`dropdown-item ${
                    selectedCategory === category ? "active" : ""
                  }`}
                >
                  {category}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
      <div>
        <button
          style={{ color: "red", padding: "0 10px" }}
          onClick={() => handleFilter("all")}
          className={selectedSource === "all" ? "active" : ""}
        >
          Toate sursele
        </button>
        {availableSources.map((source) => (
          <button
            key={source}
            onClick={() => handleFilter(source)}
            className={selectedSource === source ? "active" : ""}
          >
            {source}
          </button>
        ))}
      </div>
    </div>
  );
};

export default Menu;
