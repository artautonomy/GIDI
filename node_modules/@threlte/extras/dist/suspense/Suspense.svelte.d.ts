import type { Snippet } from 'svelte';
declare const Suspense: import("svelte").Component<{
    final?: boolean;
    children?: Snippet<[{
        suspended: boolean;
        errors: Error[];
    }]>;
    error?: Snippet<[{
        errors: Error[];
    }]>;
    fallback?: Snippet;
    onload?: () => void;
    onerror?: (error: Error[]) => void;
    onsuspend?: () => void;
}, {}, "">;
export default Suspense;
