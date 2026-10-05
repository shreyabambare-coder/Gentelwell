export default function VideoCard({
  title,
  category,
  description,
  id ,
}) {
  return (
    <article className="video-card">
      <div className="video-frame">
        <iframe
          src={`https://www.youtube.com/embed/${id}`}
          title={title}
          loading="lazy"
          allowFullScreen
        />
      </div>
      <span className="pill">{category}</span>
      <h3>{title}</h3>
      <p>{description}</p>
    </article>
  );
}
