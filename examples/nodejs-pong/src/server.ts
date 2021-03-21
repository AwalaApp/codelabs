require('make-promises-safe');

import { fastify } from 'fastify';
import fs from 'fs'
import { join } from 'path'

const IS_DEV = process.env.IS_DEV === 'true';
const PORT = process.env.PORT || 8080;

const ROUTES_DIR = join(__dirname, 'routes');

async function main(): Promise<void> {
    const server = fastify({ logger: true });

    const routes = await getAllRouteFiles();
    await Promise.all(routes.map((r) => server.register(import(r))));

    await server.ready();
    await server.listen(PORT);

    if (IS_DEV) {
        console.info(`The server is listening on http://127.0.0.1:${PORT}`);
        console.info('Press Ctrl+C to quit.');
    }
}

async function getAllRouteFiles() {
    const allFiles = await fs.promises.readdir(ROUTES_DIR);
    const routeFiles = allFiles.filter((f) => f.endsWith('.js'));
    return routeFiles.map((fileName) => join(ROUTES_DIR, fileName));
}

main();
