import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import ProjectOverlay from "./components/ProjectOverlay";
import {
  PROJECTS_URL,
  courseFilters,
  normalizeProject,
  projectMatchesFilter,
} from "./lib/projects";
import "./App.css";

function App() {
  const [projects, setProjects] = useState([]);
  const [filter, setFilter] = useState("all");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [selected, setSelected] = useState(null);
  const [closing, setClosing] = useState(false);
  const triggerRef = useRef(null);
  const closeTimer = useRef(null);
  const selectedRef = useRef(null);
  const closingRef = useRef(false);

  useEffect(() => {
    let cancelled = false;

    async function load() {
      try {
        const response = await fetch(PROJECTS_URL);
        if (!response.ok) {
          throw new Error(`Could not load projects (${response.status})`);
        }
        const data = await response.json();
        if (!cancelled) {
          setProjects(data.map(normalizeProject));
        }
      } catch (err) {
        if (!cancelled) {
          setError(err.message || "Could not load projects");
        }
      } finally {
        if (!cancelled) setLoading(false);
      }
    }

    load();
    return () => {
      cancelled = true;
    };
  }, []);

  useEffect(() => {
    return () => window.clearTimeout(closeTimer.current);
  }, []);

  const courses = useMemo(() => courseFilters(projects), [projects]);
  const visibleProjects = projects.filter((project) =>
    projectMatchesFilter(project, filter)
  );

  function openProject(project, event) {
    window.clearTimeout(closeTimer.current);
    closingRef.current = false;
    selectedRef.current = project;
    triggerRef.current = event.currentTarget;
    setClosing(false);
    setSelected(project);
  }

  const closeProject = useCallback(() => {
    if (!selectedRef.current || closingRef.current) return;
    closingRef.current = true;
    setClosing(true);
    closeTimer.current = window.setTimeout(() => {
      selectedRef.current = null;
      closingRef.current = false;
      setSelected(null);
      setClosing(false);
      triggerRef.current?.focus();
    }, 280);
  }, []);

  return (
    <>
      <header>
        <h1 className="site-title">OCADU GRAPHIC DESIGN: LOOK INSIDE</h1>
        <p className="site-date">OCTOBER 24, 2026</p>
        <nav id="menu-classes" aria-label="Filter projects">
          <button
            type="button"
            className={`filter-button${filter === "all" ? " active" : ""}`}
            onClick={() => setFilter("all")}
          >
            <strong>See all</strong>
          </button>
          <button
            type="button"
            className={`filter-button${filter === "faculty" ? " active" : ""}`}
            onClick={() => setFilter("faculty")}
          >
            <strong>Faculty profiles</strong>
          </button>
          {courses.map((course) => (
            <button
              type="button"
              key={course}
              className={`filter-button${filter === course ? " active" : ""}`}
              onClick={() => setFilter(course)}
            >
              {course}
            </button>
          ))}
        </nav>
      </header>

      <main id="container">
        {loading ? <p className="status">Loading projects…</p> : null}
        {error ? <p className="status">{error}</p> : null}
        {!loading && !error && visibleProjects.length === 0 ? (
          <p className="status">No projects in this group.</p>
        ) : null}
        {visibleProjects.map((project) => (
          <button
            type="button"
            key={project.id}
            className="project-teaser"
            onClick={(event) => openProject(project, event)}
          >
            {project.teaserImage ? (
              <img src={project.teaserImage} alt="" loading="lazy" />
            ) : null}
            <h2>{project.title}</h2>
          </button>
        ))}
      </main>

      {selected ? (
        <ProjectOverlay
          project={selected}
          closing={closing}
          onClose={closeProject}
        />
      ) : null}
    </>
  );
}

export default App;
