import { cp, mkdir } from 'node:fs/promises';
await mkdir('public/practice', { recursive: true });
await cp('apps/practice', 'public/practice', { recursive: true });
console.log('ML Practice copied to public/practice');
