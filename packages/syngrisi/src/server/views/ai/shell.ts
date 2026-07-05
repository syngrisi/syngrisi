import { escapeHtml } from '@utils';

// The full HTML document wrapper (doctype, head with inline style, header nav,
// main, footer) shared by every AI HTML page. Moved verbatim from
// ai.controller.ts's `htmlShell` — output is unchanged.
export const renderShell = (title: string, content: string) => {
    const safeTitle = escapeHtml(title);
    return `
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>${safeTitle}</title>
    <style>
        body { font-family: system-ui, sans-serif; max-width: 800px; margin: 0 auto; padding: 1rem; }
        header, footer { margin-bottom: 1rem; border-bottom: 1px solid #ccc; padding-bottom: 0.5rem; }
        article { border: 1px solid #eee; padding: 1rem; margin-bottom: 1rem; border-radius: 4px; }
        .pagination { margin-top: 1rem; display: flex; gap: 1rem; }
        .actions { margin-bottom: 1rem; padding: 0.5rem; background: #f9f9f9; }
        figure { margin: 0; }
        img { max-width: 100%; height: auto; border: 1px solid #ddd; }
        .status-new { color: blue; }
        .status-passed { color: green; }
        .status-failed { color: red; }
        .meta { font-size: 0.9em; color: #666; }
        .sr-only { position: absolute; width: 1px; height: 1px; padding: 0; margin: -1px; overflow: hidden; clip: rect(0,0,0,0); white-space: nowrap; border-width: 0; }
    </style>
</head>
<body>
    <header>
        <h1>${safeTitle}</h1>
        <nav><a href="/ai/checks">Checks</a></nav>
    </header>
    <main>
        ${content}
    </main>
    <footer>
        <p>Syngrisi AI View</p>
    </footer>
</body>
</html>
`;
};
