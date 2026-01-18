import type { Page } from '@playwright/test';

const PROGRESS_ID = 'e2e-demo-progress';

export const showProgress = async (page: Page, current: number, total: number, stepName: string): Promise<void> => {
    await page.evaluate(
        ({ current, total, stepName, id }) => {
            let container = document.getElementById(id);
            if (!container) {
                container = document.createElement('div');
                container.id = id;
                Object.assign(container.style, {
                    position: 'fixed',
                    top: '20px',
                    right: '20px',
                    padding: '8px 16px',
                    background: 'rgba(0, 0, 0, 0.6)',
                    backdropFilter: 'blur(10px)',
                    WebkitBackdropFilter: 'blur(10px)',
                    color: 'white',
                    borderRadius: '20px',
                    fontFamily: "ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace",
                    fontSize: '14px',
                    zIndex: '999999',
                    pointerEvents: 'none',
                    boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
                    transition: 'all 0.3s ease',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px'
                });
                document.body.appendChild(container);
            }

            const percent = Math.round((current / total) * 100);

            container.innerHTML = `
        <div style="font-weight: 600; color: #a5f3fc;">${current}/${total}</div>
        <div style="width: 1px; height: 12px; background: rgba(255,255,255,0.3);"></div>
        <div style="max-width: 200px; white-space: nowrap; overflow: hidden; text-overflow: ellipsis;">${stepName}</div>
        <div style="
          position: absolute; 
          bottom: 0; 
          left: 0; 
          height: 2px; 
          background: #22d3ee; 
          width: ${percent}%; 
          transition: width 0.5s ease;
          border-radius: 0 0 0 20px;
        "></div>
      `;
        },
        { current, total, stepName, id: PROGRESS_ID }
    );
};

export const hideProgress = async (page: Page): Promise<void> => {
    await page.evaluate((id) => {
        const el = document.getElementById(id);
        if (el) el.remove();
    }, PROGRESS_ID);
};
