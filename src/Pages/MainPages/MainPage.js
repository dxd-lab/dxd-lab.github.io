import React, { useCallback, useState, useEffect } from "react";
import { Navbar } from "../../Components/Navbar/navbar";
import { Footer } from "../../Components/Footer/footer";
import coursedata from "../../Data/course.json";
import newsdata from "../../Data/news.json";
import bibdata from "../../Data/bib.json";
import { Link } from "react-router-dom";

/**
 * MainPage Component - The primary landing page for the DxD Lab website
 * Displays information about the lab, recent news, course offerings, and contact details
 * Implements responsive design and scroll-based animations
 */
export const MainPage = (props) => {
  // State to control news section expansion/collapse
  const [newsOn, setNewsOn] = useState(false);
  // State to control how many news items to display based on screen width
  const [newsNum, setNewsNum] = useState(4);
  // State to control how many publications to display based on screen width
  const [pubNum, setPubNum] = useState(4);

  // Get the most recent publications from the bibliography data
  // Filter out items with empty titles and sort by year
  const recentPublications = bibdata
    .filter((pub) => pub.title !== "")
    .sort((a, b) => b.year - a.year); // Sort publications by year in descending order

  /**
   * Effect hook to handle responsive layout for news items and publications
   * Adjusts the number of visible items based on window width
   */
  useEffect(() => {
    // Function to update items count based on screen size
    const handleResize = () => {
      if (window.innerWidth >= 1200) {
        setNewsNum(4); // Large screens - show 4 news items
        setPubNum(4); // Large screens - show 4 publications
      } else if (window.innerWidth >= 800) {
        setNewsNum(3); // Medium screens - show 3 news items
        setPubNum(3); // Medium screens - show 3 publications
      } else {
        setNewsNum(4); // Small screens - show 4 news items (2x2)
        setPubNum(4); // Small screens - show 2 publications (2x2)
      }
    };

    // Initialize with current window size
    handleResize();

    // Add event listener for window resize
    window.addEventListener("resize", handleResize);

    // Clean up the event listener when the component unmounts
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  /**
   * Callback ref for Intersection Observer implementation
   * Adds animation classes to elements when they become visible in the viewport
   * Memoized with useCallback to prevent unnecessary re-creation
   */
  const element = useCallback((node) => {
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

  /**
   * Toggles the expanded/collapsed state of the news section
   */
  function newsToggle() {
    setNewsOn(!newsOn);
  }

  return (
    <>
      {/* Navigation component */}
      <Navbar />

      {/* Banner section with lab name and brief description */}
      <div className="banner">
        <div ref={element} className="title">
          DATA &nbsp;INTERACTION &nbsp;DESIGN
        </div>
        <div ref={element} className="description">
          DxD Lab is a human-computer interaction research <br /> group in the
          Industrial Design Department at KAIST{" "}
        </div>
        <img src={"/images/banner.png"} alt="banner" />
      </div>

      {/* Main content container */}
      <div className="page aboutpage">
        {/* About section with lab description and research areas */}
        <div className="abouts">
          <div className="description">
            <div ref={element} className="maintext">
              <b>
                DxD stands for Design, Interaction, and Data where we explore
                design from, with, and by data.
              </b>
              <br />
              Our mission is to build a more inclusive society by understanding
              the social impact of data and AI and by making technology
              accountable and accessible. We seek to explore where data and
              design intersect, with current research projects mainly lying
              within the subjects of digital health, inclusive AI/algorithms,
              and design futures.
            </div>
            <div className="researcharea">
              <div ref={element} className="title">
                RESEARCH AREAS
              </div>
              <div className="areas">
                <div ref={element} className="area">
                  HCI
                </div>
                <div ref={element} className="area">
                  AI
                </div>
                <div ref={element} className="area">
                  DIGITAL HEALTH
                </div>
              </div>
            </div>
          </div>
          <img ref={element} src={"/images/thumbnail.png"} alt="thumbnail" />
        </div>

        {/* News section */}
        <div ref={element} className="title">
          • NEWS •
        </div>
        <div className="newsContainer">
          {newsdata.slice(0, newsNum).map((news) => (
            <div className="news" key={news.content + news.date}>
              <img
                ref={element}
                className="image"
                src={"/images/news/" + news.image}
                alt={news.content}
              />
              <div ref={element} className="date">
                {news.date}
              </div>
              <div ref={element} className="newscontents">
                {news.content}
              </div>
            </div>
          ))}
        </div>
        {/* Show More button to navigate to the news page */}
        <Link
          to="/news"
          ref={element}
          className="newstoggle"
          style={{ marginBottom: "90px" }}
        >
          Show More
        </Link>

        {/* Recent Publications section */}
        <div ref={element} className="title">
          • RECENT PUBLICATIONS •
        </div>
        <div className={"recentPubContainer"}>
          {recentPublications.map((publication, index) => {
            return index < pubNum ? (
              <div ref={element} className="recentPub" key={publication.title}>
                <div className="recentPubImageContainer">
                  <img
                    ref={element}
                    className="recentPubImage"
                    src={
                      publication.pdf
                        ? `/images/publications/${publication.pdf}.jpg`
                        : "/images/thumbnail.png"
                    }
                    alt={publication.title}
                    onError={(e) => {
                      // Fallback image if the publication image is not found
                      e.target.src = "/images/thumbnail.png";
                    }}
                  />
                </div>
                <div className="recentPubInfo">
                  <div ref={element} className="recentPubConference">
                    {publication.venue}
                  </div>
                  <div ref={element} className="recentPubTitle">
                    {publication.title}
                  </div>
                  <div ref={element} className="recentPubAuthors">
                    {publication.author}
                  </div>
                  <div ref={element} className="recentPubLinks">
                    {publication.doi && (
                      <a
                        className="recentPubDoi"
                        href={publication.doi}
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        DOI
                      </a>
                    )}
                    {publication.pdf && (
                      <a
                        className="recentPubPdf"
                        href={`/pdf/${publication.pdf}.pdf`}
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        PDF
                      </a>
                    )}
                  </div>
                </div>
              </div>
            ) : null;
          })}
        </div>
        {/* Show More button to navigate to the publication page */}
        <Link
          to="/publication"
          ref={element}
          className="newstoggle"
          style={{ marginBottom: "90px" }}
        >
          Show More
        </Link>

        {/* Courses section */}
        <div ref={element} className="title">
          • COURSE •
        </div>
        <div className="courseContainer">
          {coursedata.map((course) => (
            <div className="course" key={course.title}>
              <div ref={element} className="title">
                {course.id}
              </div>
              <div ref={element} className="title">
                {course.title}
              </div>
              <div ref={element} className="description">
                {course.description}
              </div>
              <div ref={element} className="periodlist">
                {/* Conditionally render links or plain text based on URL availability */}
                {course.courses.map((period) =>
                  period.url ? (
                    <div
                      className="period"
                      href={period.url}
                      key={period.period}
                    >
                      • &nbsp;{period.period}
                    </div>
                  ) : (
                    <div className="period" key={period.period}>
                      • &nbsp;{period.period}
                    </div>
                  ),
                )}
              </div>
            </div>
          ))}
        </div>
        {/* Contact information section */}
        <div ref={element} className="title">
          • CONTACT US •
        </div>
        <div className="contactContainer">
          <div ref={element} className="contact">
            <div className="title">DxD Lab</div>
            <div>
              Room 304, Dept. of Industrial Design, KAIST 291 Daehak-ro,
              Yuseong-gu, Daejeon 34141, Republic of Korea
            </div>
            <a
              className="button"
              href="https://maps.app.goo.gl/sP7Bp7KrpDLca7ec6"
            >
              Google Map
            </a>
            <div className="title">Email</div>
            <div>Prof. Hwajung Hong : hwajung@kaist.ac.kr</div>
            <div>Lab Mail: dxd.kaist@gmail.com</div>
          </div>
          <img
            ref={element}
            className="map"
            src={"/images/map.png"}
            alt="map"
          />
        </div>
      </div>

      {/* Footer component */}
      <Footer />
    </>
  );
};
