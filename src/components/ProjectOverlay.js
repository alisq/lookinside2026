import { useEffect, useRef } from "react";
import Gallery from "./Gallery";

export default function ProjectOverlay({ project, closing, onClose }) {
  const closeRef = useRef(null);

  useEffect(() => {
    closeRef.current?.focus();

    const onKeyDown = (event) => {
      if (event.key === "Escape") onClose();
    };

    document.body.classList.add("overlay-open");
    window.addEventListener("keydown", onKeyDown);

    return () => {
      document.body.classList.remove("overlay-open");
      window.removeEventListener("keydown", onKeyDown);
    };
  }, [onClose, project.id]);

  return (
    <div
      className={`project-full${closing ? " is-closing" : ""}`}
      role="dialog"
      aria-modal="true"
      aria-label={project.title}
      onClick={onClose}
    >
      <button
        ref={closeRef}
        type="button"
        className="close"
        aria-label="Close"
        onClick={(event) => {
          event.stopPropagation();
          onClose();
        }}
      >
        &times;
      </button>
      <div className="interior" onClick={(event) => event.stopPropagation()}>
        {project.isFaculty ? (
          <div className="image">
            <div className="embed-container">
              <iframe
                src={`https://www.youtube.com/embed/${project.facultyVideoId}?autoplay=1`}
                title={project.title}
                allow="autoplay; fullscreen"
                allowFullScreen
              />
            </div>
          </div>
        ) : (
          <Gallery
            title={project.title}
            images={project.images}
            video={project.video}
            externalLink={project.externalLink}
          />
        )}

        <div className="project-details">
          {project.isFaculty ? (
            <h2 className="faculty-title">{project.title}</h2>
          ) : (
            <>
              <h2>{project.title}</h2>
              {project.student ? <h3>{project.student}</h3> : <span />}
              <div
                className="description"
                dangerouslySetInnerHTML={{ __html: project.description }}
              />
              <div className="meta">
                {project.instructor ? (
                  <div className="instructor">
                    <span className="label">Instructor:</span> {project.instructor}
                  </div>
                ) : null}
                {project.course ? (
                  <div className="class">
                    <span className="label">Course:</span> {project.course}
                  </div>
                ) : null}
                {project.year ? (
                  <div className="year">
                    <span className="label">Year:</span> {project.year}
                  </div>
                ) : null}
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
