interface Props {
  params: Promise<{ slug: string }>;
}

export default async function PublicProfilePage({ params }: Props) {
  const { slug } = await params;

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-background p-8">
      <h1 className="text-3xl font-bold">/{slug}</h1>
      <p className="mt-2 text-muted-foreground">
        Public profile page coming soon.
      </p>
    </div>
  );
}
