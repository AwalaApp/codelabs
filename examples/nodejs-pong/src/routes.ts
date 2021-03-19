import { FastifyInstance } from "fastify";

export default async function registerRoutes(
    fastify: FastifyInstance,
    _options: any,
): Promise<void> {
    fastify.route({
        method: ['HEAD', 'GET'],
        url: '/',
        async handler(_req, reply): Promise<void> {
            reply
                .code(200)
                .header('Content-Type', 'text/plain')
                .send('It works!');
        },
    });
}
