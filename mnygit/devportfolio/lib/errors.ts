export class AppError extends Error {
  constructor(
    message: string,
    public statusCode: number,
    public userMessage: string
  ) {
    super(message);
    this.name = "AppError";
  }
}

export function handleApiError(error: unknown): Response {
  console.error("[API Error]:", error);

  if (error instanceof AppError) {
    return Response.json(
      { error: error.userMessage },
      { status: error.statusCode }
    );
  }

  if (error instanceof Error && error.message === "Invalid GitHub username format") {
    return Response.json({ error: error.message }, { status: 400 });
  }

  if (error instanceof Error && error.message.startsWith("Invalid")) {
    return Response.json({ error: error.message }, { status: 400 });
  }

  // Never expose internal details to the client
  return Response.json(
    { error: "Something went wrong. Please try again." },
    { status: 500 }
  );
}
