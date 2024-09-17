/**
 * Converts a string to a slug format (lowercase, spaces replaced with dashes, non-alphanumeric characters removed, and multiple dashes collapsed)
 *
 * @param {string} inputString
 * @returns {string}
 */
export function slugify(inputString: string, separator = "-"): string {
  return inputString
    .normalize("NFKD") // Unicode normalization to handle accented characters
    .toLowerCase()
    .replace(/[^a-z0-9]/g, separator) // Replace non-alphanumeric characters with dashes
    .replace(/-+/g, "-"); // Collapse multiple dashes
}
