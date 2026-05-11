import { html, $state, useInsert, runEffect, useValidateComponent } from "pawajs";
import { cn } from "./utils";

export const DthemeToggle = ({ className, ...props }) => {
    const theme = $state('system','store-theme'); // 'light', 'dark', 'system'

    const getSystemTheme = () => {
        if (typeof window !== 'undefined' && window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
            return 'dark';
        }
        return 'light';
    };

    const applyTheme = (newTheme) => {
        const root = document.documentElement;
        root.classList.remove('light', 'dark');

        if (newTheme === 'system') {
            const system = getSystemTheme();
            root.classList.add(system);
            localStorage.removeItem('theme');
        } else {
            root.classList.add(newTheme);
            localStorage.setItem('theme', newTheme);
        }
        theme.value = newTheme;
    };

    const toggleTheme = () => {
        const current = theme.value;
        if (current === 'light') {
            applyTheme('dark');
        } else if (current === 'dark') {
            applyTheme('system');
        } else { // current === 'system'
            applyTheme('light');
        }
    };

    // Initialize theme on mount
    runEffect(() => {
    applyTheme(theme.value)
        // Listen for system theme changes
        const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
        const handler = (e) => {
            if (theme.value === 'system') {
                applyTheme('system'); // Re-apply system theme if preference changes
            }
        };
        mediaQuery.addEventListener('change', handler);
        return () => mediaQuery.removeEventListener('change', handler);
    });

    const classActive = () => cn(
        "inline-flex items-center justify-center rounded-md text-sm font-medium transition-colors hover:bg-accent hover:text-accent-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 h-9 w-9",
        className()
    );

    useInsert({ classActive, toggleTheme, theme });

    return html`
        <button on-click="toggleTheme()" class="@{classActive()}" type="button" aria-label="Toggle theme">
            <span if="theme.value === 'light'"><svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-sun"><circle cx="12" cy="12" r="4"/><path d="M12 2v2"/><path d="M12 20v2"/><path d="M4.93 4.93l1.41 1.41"/><path d="M17.66 17.66l1.41 1.41"/><path d="M2 12h2"/><path d="M20 12h2"/><path d="M4.93 19.07l1.41-1.41"/><path d="M17.66 6.34l1.41-1.41"/></svg></span>
            <span if="theme.value === 'dark'"><svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-moon"><path d="M12 3a6 6 0 0 0 9 9 9 9 0 1 1-9-9Z"/></svg></span>
            <span if="theme.value === 'system'"><svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-laptop"><path d="M20 16V7a2 2 0 0 0-2-2H6a2 2 0 0 0-2 2v9m16 0H4m16 0 1.28 2.55a1 1 0 0 1-.91 1.45H3.63a1 1 0 0 1-.91-1.45L4 16"/></svg></span>
            <span class="sr-only">Toggle theme</span>
        </button>
    `;
};

useValidateComponent(DthemeToggle, {
    className: { type: String, default: '' },
});