export class CmsError extends Error {
  constructor(
    message: string,
    readonly code: "CONFIG" | "NETWORK" | "NOT_FOUND" | "PARSE",
    readonly cause?: unknown,
  ) {
    super(message);
    this.name = "CmsError";
  }
}
