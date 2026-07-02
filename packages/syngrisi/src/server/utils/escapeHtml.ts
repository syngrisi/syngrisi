// Escape a value for safe interpolation into HTML text and double-quoted attributes.
export const escapeHtml = (value: unknown): string =>
    String(value ?? '').replace(/[&<>"']/g, (ch) => (
        { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[ch] as string
    ));
