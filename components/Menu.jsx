import React from "react";

const Menu = ({ selectedSource, handleFilter }) => {
  return (
    <div className="menu">
      <div>
        <h1 className="logo">
          <a href="/" style={{ letterSpacing: "-1px", color: "black" }}>
            <span style={{ paddingRight:"10px" }}>newsflow</span> | 
          </a>
          <select>
            <option>Actualitate</option>
            <option>Economie</option>
            <option>Sport</option>    
            <option>Sănătate</option>                              
            <option>Monden</option>                  
          </select>
        </h1>
      </div>
      <div>
        <button
          style={{ border:"1px solid red", color:"red", padding: "0 10px" }}
          onClick={() => handleFilter("all")}
          className={selectedSource === "all" ? "active" : ""}
        >
        <img
          src="/images/giphy_transparent.gif"
          alt="Loading"
          className="giphy"
        />          
          Ultima oră
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
