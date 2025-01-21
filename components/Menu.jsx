import React from "react";

const Menu = ({ selectedSource, handleFilter }) => {
  return (
    <div className="menu">
      <div>
        <h1>
          <a href="/" style={{ letterSpacing: "-1px", color: "black" }}>
            contents
          </a>
        </h1>
      </div>
      <div>
        <button
          style={{ background: "red", color: "white", padding: "0 5px" }}
          onClick={() => handleFilter("all")}
          className={selectedSource === "all" ? "active" : ""}
        >
          Toate știrile
        </button>
        {["g4media", "hotnews", "ziare", "digi24", "spotmedia", "libertatea", "stirileprotv", "news", "gsp", "prosport"].map((source) => (
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
