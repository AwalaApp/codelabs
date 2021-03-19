require('make-promises-safe');

import { fastify } from 'fastify';

const IS_DEV = process.env.IS_DEV === 'true';
const PORT = process.env.PORT || 8080;

async function main(): Promise<void> {
    const server = fastify();

    await server.register(import('./routes'));
    await server.ready();
    await server.listen(PORT);

    if (IS_DEV) {
        console.info(`The server is listening on http://127.0.0.1:${PORT}`);
        console.info('Press Ctrl+C to quit.');
    }
}

main();
