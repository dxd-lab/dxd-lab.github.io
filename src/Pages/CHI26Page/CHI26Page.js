import React, { useMemo } from "react";
import { Navbar } from "../../Components/Navbar/navbar";
import { Footer } from "../../Components/Footer/footer";
import chi26Data from "../../Data/chi26.json";
import peopleData from "../../Data/people.json";
import "./chi26.css";

const normalizeAuthorName = (name) =>
  name.replace(/\*/g, "").trim().toLowerCase();

const splitAuthors = (authorString) => {
  if (!authorString) {
    return [];
  }

  return authorString
    .split(",")
    .flatMap((chunk) => chunk.split(" and "))
    .map((name) => name.trim())
    .filter(Boolean);
};

const isValidTimeRange = (timeRange) =>
  typeof timeRange === "string" &&
  /^\d{2}:\d{2} - \d{2}:\d{2}$/.test(timeRange);

const CENTRAL_EUROPE_TIME_ZONE = "Europe/Paris";

const normalizeTimeRange = (paper) => {
  const candidate = (paper.time || "").trim();
  if (isValidTimeRange(candidate)) {
    return candidate;
  }
  return "TBA-TBA";
};

const getWeekdayInCentralEurope = (dateText) => {
  if (!dateText) {
    return "TBA";
  }

  const safeMiddayUTC = new Date(`${dateText}T12:00:00Z`);
  if (Number.isNaN(safeMiddayUTC.getTime())) {
    return "TBA";
  }

  return new Intl.DateTimeFormat("en-US", {
    weekday: "long",
    timeZone: CENTRAL_EUROPE_TIME_ZONE,
  }).format(safeMiddayUTC);
};

const getDateTimeSortKey = (paper) => {
  if (!paper.date) {
    return "9999-99-99T99:99";
  }

  const timeRange = normalizeTimeRange(paper);
  const startTime = isValidTimeRange(timeRange)
    ? timeRange.split("-")[0]
    : "99:99";
  return `${paper.date}T${startTime}`;
};

const isVideoPresentation = (paper) =>
  /video presentations?/i.test(paper.session || "");

export const CHI26Page = () => {
  const peopleByName = useMemo(
    () =>
      new Map(
        peopleData.map((person) => [normalizeAuthorName(person.name), person]),
      ),
    [],
  );

  const labMemberNames = useMemo(
    () => new Set(peopleByName.keys()),
    [peopleByName],
  );

  const attendeesInPerson = useMemo(
    () =>
      (chi26Data.attendingInPerson || []).map((name) => {
        const person = peopleByName.get(normalizeAuthorName(name));
        return (
          person || {
            name,
            position: "DxD Lab",
            image: "human-placeholder.png",
            homepage: "",
          }
        );
      }),
    [peopleByName],
  );

  const chi26Papers = useMemo(
    () =>
      [...(chi26Data.papers || [])].sort((a, b) => {
        const aIsVideo = isVideoPresentation(a);
        const bIsVideo = isVideoPresentation(b);
        if (aIsVideo !== bIsVideo) {
          return aIsVideo ? 1 : -1;
        }

        const sortKeyDiff = getDateTimeSortKey(a).localeCompare(
          getDateTimeSortKey(b),
        );
        if (sortKeyDiff !== 0) {
          return sortKeyDiff;
        }

        return (a.title || "").localeCompare(b.title || "");
      }),
    [],
  );

  return (
    <>
      <Navbar />
      <main className="chi26-page">
        <div className="chi26-container">
          <h1 className="chi26-title">DxD Lab @CHI2026</h1>
          <p className="chi26-description">
            <b>DxD Lab</b> at ID KAIST is excited to present{" "}
            <b>8 full papers</b> including 4 paper awards at CHI2026! <br />
            Take a look at our schedule and drop by our sessions if you can.
            <br />
            If there's a paper you'd like to learn more about, feel free to
            reach out to the author.
          </p>
          <p className="chi26-description">
            The following lab members will be attending the conference in
            person.
            <br />
            So come say hi👋 if you see us around!
          </p>
          {/* <h2 className="chi26-attendees-title">Attending CHI2026 In Person</h2> */}
          <section
            className="chi26-attendees-container"
            aria-label="CHI 2026 in-person attendees"
          >
            {attendeesInPerson.map((person) => (
              <div className="chi26-person" key={person.name}>
                <div className="chi26-person-image-container">
                  <img
                    className="chi26-person-image"
                    src={`/images/people/${person.image || "human-placeholder.png"}`}
                    alt={person.name}
                  />
                </div>
                <p className="chi26-person-name">{person.name}</p>
                <p className="chi26-person-position">{person.position}</p>
                {person.homepage ? (
                  <a
                    className="chi26-person-link"
                    href={person.homepage}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <img
                      className="chi26-person-link-icon"
                      src={`${process.env.PUBLIC_URL}/icons/home.svg`}
                      alt="Homepage"
                    />
                  </a>
                ) : null}
              </div>
            ))}
          </section>

          <h2 className="chi26-section-title">Papers</h2>
          {/* <p className="chi26-note">Bold names indicate DxD Lab members.</p>
          <p className="chi26-timezone-note">
            All presentation times are shown in {CENTRAL_EUROPE_LABEL}.
          </p> */}

          <section className="chi26-paper-list" aria-label="CHI 2026 papers">
            {chi26Papers.map((paper, index) => {
              const authors = Array.isArray(paper.authors)
                ? paper.authors
                : splitAuthors(paper.author);
              const session = paper.session?.trim() || "TBA";
              const venue = paper.venue?.trim() || "TBA";
              const timeRange = normalizeTimeRange(paper);
              const weekday = getWeekdayInCentralEurope(paper.date).substr(
                0,
                3,
              );
              const dateText = paper.date
                ? `${paper.date} (${weekday})`
                : "TBA";
              const dateTime = `${dateText} ${timeRange}`;

              const links = [];
              if (typeof paper.program === "string" && paper.program) {
                links.push({
                  label: "PROGRAM",
                  href: paper.program,
                });
              }
              if (paper.pdf) {
                links.push({
                  label: "PDF",
                  href: `/pdf/${paper.pdf}.pdf`,
                });
              }
              if (typeof paper.web === "string" && paper.web) {
                links.push({
                  label: "WEB",
                  href: paper.web,
                });
              }

              return (
                <div
                  className="chi26-paper-item"
                  key={`${paper.title}-${dateTime}-${index}`}
                >
                  <aside
                    className="chi26-schedule-rail"
                    aria-label="Date and time"
                  >
                    <div className="chi26-schedule-node">
                      <div className="chi26-schedule-date">{dateText}</div>
                      <div className="chi26-schedule-time">{timeRange}</div>
                    </div>
                  </aside>

                  <article className="chi26-paper-card">
                    {paper.award && (
                      <div className="chi26-award-row">
                        <span className="chi26-award">🏆 {paper.award}</span>
                      </div>
                    )}

                    <h3 className="chi26-paper-title">{paper.title}</h3>

                    <div className="chi26-detail-row">
                      <dt>Authors</dt>
                      <dd>
                        {authors.map((author, authorIndex) => {
                          const isLabMember = labMemberNames.has(
                            normalizeAuthorName(author),
                          );

                          return (
                            <React.Fragment key={`${author}-${authorIndex}`}>
                              {authorIndex > 0 ? ", " : ""}
                              <span
                                className={
                                  isLabMember
                                    ? "chi26-lab-member"
                                    : "chi26-non-lab-member"
                                }
                              >
                                {author}
                              </span>
                            </React.Fragment>
                          );
                        })}
                      </dd>
                    </div>

                    <dl className="chi26-paper-details">
                      <div className="chi26-detail-row">
                        <dt>Session</dt>
                        <dd>{session}</dd>
                      </div>

                      <div className="chi26-detail-row">
                        <dt>Venue</dt>
                        <dd>{venue}</dd>
                      </div>

                      {/* <div className="chi26-detail-row chi26-abstract-row">
                        <dt>Abstract</dt>
                        <dd>
                          {paper.abstract?.trim() || "Abstract coming soon."}
                        </dd>
                      </div> */}

                      <div className="chi26-detail-row">
                        <dt>Links</dt>
                        <dd>
                          {links.length > 0 ? (
                            <div className="chi26-links">
                              {links.map((link) => (
                                <a
                                  key={`${paper.title}-${link.label}`}
                                  href={link.href}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="chi26-link"
                                >
                                  {link.label}
                                </a>
                              ))}
                            </div>
                          ) : (
                            <span className="chi26-link-pending">TBA</span>
                          )}
                        </dd>
                      </div>
                    </dl>
                  </article>
                </div>
              );
            })}
          </section>
        </div>
      </main>
      <Footer />
    </>
  );
};
