import { useEffect, useState } from "react";

function Arrow({ direction }) {
  const points =
    direction === "previous"
      ? "68,18 32,50 68,82 78,72 52,50 78,28"
      : "32,18 68,50 32,82 22,72 48,50 22,28";

  return (
    <svg viewBox="0 0 100 100" aria-hidden="true">
      <polygon points={points} />
    </svg>
  );
}

function MediaCell({ cell, title }) {
  if (cell.type === "video") {
    return (
      <div className="image">
        <div className="embed-container">
          <iframe
            src={cell.src}
            title={title}
            allow="fullscreen; picture-in-picture"
            allowFullScreen
          />
        </div>
      </div>
    );
  }

  const image = <img src={cell.src} alt={title} />;

  return (
    <div className="image">
      {cell.href ? (
        <a href={cell.href} target="_blank" rel="noopener noreferrer">
          {image}
        </a>
      ) : (
        image
      )}
    </div>
  );
}

export default function Gallery({ title, images, video, externalLink }) {
  const cells = [];

  if (video) {
    cells.push({ type: "video", src: video.src });
  }

  images.forEach((src) => {
    cells.push({
      type: "image",
      src,
      href: externalLink || "",
    });
  });

  const [index, setIndex] = useState(0);
  const count = cells.length;

  const go = (delta) => {
    setIndex((current) => (current + delta + count) % count);
  };

  useEffect(() => {
    if (count < 2) return undefined;

    const onKeyDown = (event) => {
      if (event.key === "ArrowRight") {
        setIndex((current) => (current + 1) % count);
      }
      if (event.key === "ArrowLeft") {
        setIndex((current) => (current - 1 + count) % count);
      }
    };

    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [count]);

  if (count === 0) return null;

  if (count === 1) {
    return (
      <div className="gallery">
        <MediaCell cell={cells[0]} title={title} />
      </div>
    );
  }

  return (
    <div className="gallery carousel">
      <button
        type="button"
        className="carousel-button previous"
        aria-label="Previous image"
        onClick={() => go(-1)}
      >
        <Arrow direction="previous" />
      </button>
      <div className="carousel-viewport">
        <div
          className="carousel-track"
          style={{ transform: `translateX(-${index * 100}%)` }}
        >
          {cells.map((cell, cellIndex) => (
            <MediaCell
              key={`${cell.type}-${cell.src}-${cellIndex}`}
              cell={cell}
              title={title}
            />
          ))}
        </div>
      </div>
      <button
        type="button"
        className="carousel-button next"
        aria-label="Next image"
        onClick={() => go(1)}
      >
        <Arrow direction="next" />
      </button>
    </div>
  );
}
