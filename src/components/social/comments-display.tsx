interface Comment {
  id: string;
  body: string;
  createdAt: Date;
  author: {
    id: string;
    name: string;
    slug: string;
  };
}

interface Props {
  comments: Comment[];
  accentColor: string;
}

export function CommentsDisplay({ comments, accentColor }: Props) {
  if (comments.length === 0) return null;

  return (
    <div className="space-y-3">
      <h2
        className="text-lg font-semibold uppercase tracking-wider"
        style={{ color: accentColor }}
      >
        Coworker Comments ({comments.length})
      </h2>
      <div className="space-y-3">
        {comments.map((c) => (
          <div
            key={c.id}
            className="rounded-lg border border-border bg-card/50 p-4"
          >
            <div className="flex items-center justify-between">
              <a
                href={`/p/${c.author.slug}`}
                className="text-sm font-medium hover:underline"
                style={{ color: accentColor }}
              >
                {c.author.name}
              </a>
              <span className="text-xs text-muted-foreground">
                {new Date(c.createdAt).toLocaleDateString()}
              </span>
            </div>
            <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
              {c.body}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}
