import { FastifyInstance } from 'fastify';
import fs from 'fs';
import { dirname, join } from 'path'

const ROOT_DIR = dirname(dirname(__dirname));
const CERT_PATH = join(ROOT_DIR, 'identity-certificate.der');

export default async function registerRoutes(
    fastify: FastifyInstance,
    _options: any,
): Promise<void> {
    fastify.route({
        method: ['GET'],
        url: '/identity.der',
        async handler(_req, reply): Promise<void> {
            const certificate = await fs.promises.readFile(CERT_PATH);
            reply
                .type('application/vnd.etsi.tsl.der')
                .send(certificate);
        },
    });
}
