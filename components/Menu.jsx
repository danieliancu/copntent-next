import React from "react";

const Menu = ({ selectedSource, selectedCategory, handleFilter, handleCategoryFilter, availableSources }) => {
  return (
    <div className="menu">
      <div>
        <h1 className="logo">
          <a href="/" style={{ letterSpacing: "-1px", color: "black" }}>
            <span style={{ paddingRight: "10px" }}>newsflow.ro</span> |
          </a>
          <select onChange={(e) => handleCategoryFilter(e.target.value)} value={selectedCategory}>
            <option value="Actualitate">Actualitate</option>
            <option value="Economie">Economie</option>
            <option value="Sport">Sport</option>
            <option value="Sănătate">Sănătate</option>
            <option value="Monden">Monden</option>
          </select>
        </h1>
      </div>
      <div>
        <button
          style={{ border: "1px solid red", color: "red", padding: "0 10px" }}
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
