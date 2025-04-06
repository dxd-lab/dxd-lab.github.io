import React from "react";
import "./NewsCard.css";

/**
 * NewsCard Component - A reusable card component for displaying news items
 * @param {Object} props - Component props
 * @param {string} props.image - Image URL for the news item
 * @param {string} props.date - Date of the news item
 * @param {string} props.content - Content/description of the news item
 * @param {Function} props.elementRef - Ref callback for animation
 */
export const NewsCard = ({ image, date, content, elementRef }) => {
  return (
    <div className="news">
      <img
        ref={elementRef}
        className="image"
        src={"/images/news/" + image}
        alt={content}
      />
      <div ref={elementRef} className="date">
        {date}
      </div>
      <div ref={elementRef} className="newscontents">
        {content}
      </div>
    </div>
  );
};
