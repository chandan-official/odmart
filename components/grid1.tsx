// ScrollMarquee.tsx
"use client";
import React from "react";
import "../styles/grid1.css"; // the CSS above

export default function ScrollableCircles() {
  const icons = ["🛍️", "📦", "🚚", "💳", "📈", "💼", "🎁", "⚙️", "💡", "⭐"];

  return (
    <div className="grid1-container">
      {icons.map((icon, i) => (
        <div className="grid1-item" key={i}>
          {icon}
        </div>
      ))}
    </div>
  );
}
