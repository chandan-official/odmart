"use client";
import React from "react";
import "../styles/filterbar.css";

interface FilterBarProps {
  categories: string[];
  onFilter: (category: string) => void;
}

export default function FilterBar({ categories, onFilter }: FilterBarProps) {
  return (
    <div className="filter-bar">
      <button onClick={() => onFilter("All")}>All</button>
      {categories.map((cat) => (
        <button key={cat} onClick={() => onFilter(cat)}>
          {cat}
        </button>
      ))}
    </div>
  );
}
