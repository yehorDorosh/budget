export class ProjectError extends Error {
  statusCode: number = 500
  details?: string | object | unknown

  constructor(message: string) {
    super(message)
  }
}
