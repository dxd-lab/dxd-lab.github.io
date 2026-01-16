/**
 * PeoplePage Component
 * A React component that displays information about current members and alumni of the organization.
 * Features include:
 * - Responsive grid layout of people cards
 * - Intersection Observer animations for scroll effects
 * - Filtering between current members and alumni
 * - Research interest tags overlay on hover
 * - Homepage links for each person
 */

import React, { useCallback } from "react";
import { Navbar } from "../../Components/Navbar/navbar";
import { Footer } from "../../Components/Footer/footer";
import peopledata from "../../Data/people.json";
import "./page.css";

export const PeoplePage = (props) => {
  // Custom intersection observer hook for scroll animations
  // Creates a reusable callback ref that adds/removes 'animation' class based on viewport visibility
  const element = useCallback((node) => {
    // Configure the Intersection Observer options
    const options = {
      root: null, // Use the viewport as the root
      rootMargin: "0px", // No margin around the root
      threshold: 0.1, // Trigger when 10% of the element is visible
    };

    // Only create observer for valid DOM elements
    if (node && node.nodeType === Node.ELEMENT_NODE) {
      const observer = new IntersectionObserver((entries) => {
        entries.forEach((entry) => {
          // Add animation class when element enters viewport
          if (entry.isIntersecting) {
            entry.target.classList.add("animation");
          } else {
            // Remove animation class when element leaves viewport
            entry.target.classList.remove("animation");
          }
        });
      }, options);

      observer.observe(node);
    }
  }, []);

  return (
    <>
      <Navbar />
      {/* <div className='banner'>
                <div ref={element} className='title'>We Are DxD</div>
                <img src={"/images/banner.png"} alt="banner"/>
            </div> */}
      <div className="page">
        {/* Page title with animation effect */}
        <div ref={element} className="title">
          <span>• PEOPLE •</span>
        </div>
        <div className="container">
          {/* Filter and map through people data to show only current members */}
          {peopledata
            .filter((person) => person.current === true)
            .map((person) => (
              <div className="person" key={person.name}>
                {/* Image container with research interests overlay */}
                <div className="image-container">
                  <img
                    ref={element}
                    className="image"
                    src={"/images/people/" + person.image}
                    alt={person.name}
                  />
                  {/* Conditional render of research interests overlay */}
                  {person.research_interest && (
                    <div className="research-overlay">
                      {/* Split research interests by comma and create individual tags */}
                      {person.research_interest
                        .split(",")
                        .map((interest, index) => (
                          <span key={index} className="research-tag">
                            # {interest.trim()}
                          </span>
                        ))}
                    </div>
                  )}
                </div>
                {/* Person details with animation effects */}
                <p ref={element} className="name">
                  {person.name}
                </p>
                <p ref={element} className="position">
                  {person.position}
                </p>
                {/* Conditional render of homepage link */}
                {person.homepage === "" ? null : (
                  <a
                    className="link"
                    href={person.homepage}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <img
                      className="linkBtn"
                      ref={element}
                      src={`${process.env.PUBLIC_URL}/icons/home.svg`}
                      alt="home link"
                    />
                  </a>
                )}
              </div>
            ))}
        </div>
        {/* Divider line between current members and alumni sections */}
        <img
          className="line"
          ref={element}
          src={`${process.env.PUBLIC_URL}/icons/line.svg`}
          alt="line"
        />
        {/* Alumni section title with animation effect */}
        <div ref={element} className="title">
          • Alumni •
        </div>
        {/* Alumni section grouped by position categories - KIXLAB style layout */}
        <div className="alumni-section">
          {/* Define position categories in order of seniority for grouping alumni */}
          {[
            // Category object for Postdoctoral Researchers
            { category: "Postdoctoral Researcher", match: "Postdoctoral", exclude: null },
            // Category object for Ph.D. Students (excluding visiting)
            { category: "Ph.D. Student", match: "Ph.D.", exclude: "Visiting" },
            // Category object for Master's Students (excluding visiting)
            { category: "Master's Student", match: "Master", exclude: "Visiting" },
            // Category object for Visiting Researchers (Ph.D. and Master's)
            { category: "Visiting Researcher", match: "Visiting", exclude: null },
            // Category object for Undergraduate and general Interns
            { category: "Intern", match: "Intern", exclude: null },
          ].map(({ category, match, exclude }) => {
            // Filter alumni data to find those matching the current category
            const categoryAlumni = peopledata.filter(
              (person) =>
                // Must be an alumni (not current member)
                person.current === false &&
                // Position must include the category match string
                person.position.includes(match) &&
                // Exclude positions containing the exclude string if specified
                (exclude === null || !person.position.includes(exclude)),
            );
            // Only render the category section if there are alumni in it
            return categoryAlumni.length > 0 ? (
              // Container for each position category group
              <div key={category} className="alumni-category">
                {/* Category heading (e.g., "Ph.D. Students") */}
                <h3 ref={element} className="alumni-category-title">
                  {category}
                </h3>
                {/* Two-column grid container for alumni entries */}
                {/* Add 'single' class when only one alumni to center them */}
                <div className={`alumni-grid${categoryAlumni.length === 1 ? " single" : ""}`}>
                  {/* Map through each alumni in this category */}
                  {categoryAlumni.map((person) => (
                    // Individual alumni entry container
                    <div
                      key={person.name}
                      ref={element}
                      className="alumni-entry"
                    >
                      {/* Alumni name - render as link if homepage exists, otherwise plain text */}
                      {person.homepage ? (
                        // Clickable name linking to alumni's homepage
                        <a
                          href={person.homepage}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="alumni-name"
                        >
                          {person.name}
                        </a>
                      ) : (
                        // Plain text name when no homepage is available
                        <span className="alumni-name">{person.name}</span>
                      )}
                      {/* Display current position if the "now" field has content */}
                      {/* If "now" contains "at", line break before "at" */}
                      {person.now && (
                        <span className="alumni-now">
                          {person.now.includes(" at ") ? (
                            <>
                              {/* Part before "at" */}
                              Now {person.now.split(" at ")[0]}
                              <br />
                              {/* Part after "at" (join in case of multiple "at") */}
                              at {person.now.split(" at ").slice(1).join(" at ")}
                            </>
                          ) : (
                            // No "at" found, display as-is
                            `Now ${person.now}`
                          )}
                        </span>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            ) : null; // Return null if no alumni in this category
          })}
        </div>
      </div>
      <Footer />
    </>
  );
};
