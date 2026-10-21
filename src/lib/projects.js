const MEDIA_HOST = "https://lookinside.iamasq.works";

export const PROJECTS_URL = `${MEDIA_HOST}/json/projects`;

export function decodeEntities(value) {
  if (!value) return "";
  const el = document.createElement("textarea");
  el.innerHTML = value;
  return el.value;
}

export function mediaUrl(path) {
  const trimmed = (path || "").trim();
  if (!trimmed) return "";
  if (/^https?:\/\//i.test(trimmed)) {
    return trimmed.replace(/^http:\/\//i, "https://");
  }
  return `${MEDIA_HOST}${trimmed.startsWith("/") ? "" : "/"}${trimmed}`;
}

export function parseYouTubeId(url) {
  const trimmed = (url || "").trim();
  if (!trimmed) return "";
  const match = trimmed.match(
    /(?:youtu\.be\/|youtube\.com\/(?:watch\?v=|embed\/|v\/|shorts\/))([A-Za-z0-9_-]{11})/
  );
  return match ? match[1] : "";
}

export function parseVimeoId(url) {
  const trimmed = (url || "").trim();
  if (!/vimeo/i.test(trimmed)) return "";
  const match = trimmed.match(/vimeo\.com\/(?:video\/)?(\d+)/i);
  return match ? match[1] : "";
}

export function parseVideo(url) {
  const trimmed = (url || "").trim();
  if (!trimmed) return null;

  if (/vimeo/i.test(trimmed)) {
    const id = parseVimeoId(trimmed);
    if (!id) return null;
    return {
      kind: "vimeo",
      src: `https://player.vimeo.com/video/${id}`,
    };
  }

  if (/youtu/i.test(trimmed)) {
    const id = parseYouTubeId(trimmed);
    if (!id) return null;
    return {
      kind: "youtube",
      src: `https://www.youtube.com/embed/${id}`,
    };
  }

  return null;
}

export function normalizeProject(raw, index) {
  const images = (raw.field_project_images || "")
    .split(", ")
    .map(mediaUrl)
    .filter(Boolean);
  const course = decodeEntities(raw.field_course_title || "").trim();
  const facultyVideoId = parseYouTubeId(raw.field_youtube_url || "");

  return {
    id: `${index}-${raw.title || "project"}`,
    title: decodeEntities(raw.title || "Untitled"),
    teaserImage: mediaUrl(raw.field_project_images_1),
    images,
    description: raw.body || "",
    student: decodeEntities(raw.field_student_name || "").trim(),
    instructor: decodeEntities(raw.field_instructor || "").trim(),
    year: decodeEntities(raw.field_project_year || "").trim(),
    course,
    facultyVideoId,
    isFaculty: Boolean(facultyVideoId),
    externalLink: (raw.field_external_link || "").trim(),
    video: parseVideo(raw.field_project_),
  };
}

export function courseFilters(projects) {
  return [...new Set(projects.map((project) => project.course).filter(Boolean))].sort(
    (a, b) => a.localeCompare(b)
  );
}

export function projectMatchesFilter(project, filter) {
  if (filter === "all") return true;
  if (filter === "faculty") return project.isFaculty;
  return project.course === filter;
}
