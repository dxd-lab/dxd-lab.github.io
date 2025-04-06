import React, { useEffect } from "react";
import { Navbar } from "../../Components/Navbar/navbar";
import { Footer } from "../../Components/Footer/footer";
import { NewsCard } from "../../Components/NewsCard/NewsCard";
import newsdata from "../../Data/news.json";

/**
 * NewsPage Component - Displays all news items from the lab
 * Shows a comprehensive list of news in chronological order
 */
export const NewsPage = () => {
  // Scroll to top when component mounts
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  // Callback ref for Intersection Observer implementation
  const element = React.useCallback((node) => {
    // Configuration options for the Intersection Observer
    const options = {
      root: null, // Use the viewport as the root
      rootMargin: "0px", // No margin around the root
      threshold: 0.1, // Trigger when 10% of the element is visible
    };

    // Only proceed if a valid DOM node is provided
    if (node && node.nodeType === Node.ELEMENT_NODE) {
      // Create observer to add/remove animation class based on visibility
      const observer = new IntersectionObserver((entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            // Add animation class when element enters viewport
            entry.target.classList.add("animation");
          } else {
            // Remove animation class when element leaves viewport
            entry.target.classList.remove("animation");
          }
        });
      }, options);

      // Start observing the node
      observer.observe(node);
    }
  }, []);

  return (
    <>
      <Navbar />
      <div className="page">
        {/* Page title */}
        <div ref={element} className="title">
          • NEWS •
        </div>

        {/* News container displaying all news items */}
        <div className="newsContainer">
          {newsdata.map((news) => (
            <NewsCard
              key={news.content + news.date}
              image={news.image}
              date={news.date}
              content={news.content}
              elementRef={element}
            />
          ))}
        </div>
      </div>
      <Footer />
    </>
  );
};
