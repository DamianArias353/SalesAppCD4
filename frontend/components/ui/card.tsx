interface CardProps {
  title: string;
  description: string;
  children?: React.ReactNode;
}

export function Card({ title, description, children }: CardProps) {
  return (
    <article className="card">
      <div>
        <h2>{title}</h2>
        <p className="muted">{description}</p>
      </div>
      {children}
    </article>
  );
}
