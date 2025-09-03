declare module '@joplin/turndown' {
    export { default } from 'turndown';
}

declare module '@joplin/turndown-plugon-gfm' {
    import type { Plugin } from 'turndown';
    const gfm: Plugin;
}
