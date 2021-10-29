export interface LinkBuilder {
  /**
   * Builds a link to the given path while keeping current course group query.
   */
  buildLink: (href: string, params?: Record<string, string>, includeStudyProgram?: boolean) => string
}
