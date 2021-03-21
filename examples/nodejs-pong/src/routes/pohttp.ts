import { derDeserializeRSAPrivateKey, Parcel } from "@relaycorp/relaynet-core";
import { deliverParcel } from "@relaycorp/relaynet-pohttp";
import { FastifyInstance } from "fastify";
import * as process from "process";
import fs from 'fs';
import { dirname, join } from 'path';

import { createPongParcel, extractPingFromParcel, Ping } from "../messaging";
import { bufferToArrayBuffer } from "../utils";

const ROOT_DIR = dirname(dirname(__dirname));
const PRIVATE_KEY_PATH = join(ROOT_DIR, 'private-key.der');

export default async function registerRoutes(
    fastify: FastifyInstance,
    _options: any,
): Promise<void> {
    const privateKeySerialized = await fs.promises.readFile(PRIVATE_KEY_PATH);
    const privateKey = await derDeserializeRSAPrivateKey(privateKeySerialized);

    // Enable the request content type "application/vnd.awala.parcel"
    fastify.addContentTypeParser(
        'application/vnd.awala.parcel',
        { parseAs: 'buffer' },
        async (_req: any, buffer: Buffer) => {
            return bufferToArrayBuffer(buffer);
        },
    );

    fastify.route<{ readonly Body: Buffer }>({
        method: ['POST'],
        url: '/',
        async handler(request, reply): Promise<void> {
            // Validate the request
            if (request.headers['content-type'] !== 'application/vnd.awala.parcel') {
                return reply.code(415).send({ message: 'Invalid Content-Type' });
            }
            const gatewayAddress = request.headers['x-awala-gateway'] || '';
            if (gatewayAddress.length === 0) {
                return reply
                    .code(400)
                    .send({ message: 'X-Awala-Gateway header is missing' });
            }

            // Validate the parcel
            let parcel;
            try {
                parcel = await Parcel.deserialize(request.body);
                await parcel.validate();
            } catch (err) {
                request.log.info({ err }, 'Refusing malformed or invalid parcel');
                return reply.code(403).send({ message: 'Parcel is malformed or invalid' });
            }
            if (parcel.recipientAddress !== `https://${process.env.PUBLIC_ADDRESS}`) {
                request.log.info(
                    { recipient: parcel.recipientAddress },
                    'Refusing parcel bound for another endpoint'
                );
                return reply.code(403).send({ message: 'Invalid parcel recipient' });
            }

            // Get the ping message
            let ping: Ping;
            try {
                ping = await extractPingFromParcel(parcel, privateKey);
            } catch (err) {
                request.log.info(
                    { err },
                    'Ignoring invalid/malformed service message or ping'
                );
                // Don't return a 40X because the gateway did nothing wrong
                return reply.code(202).send({});
            }

            // Send the pong message
            const pongParcel =
                await createPongParcel(ping, parcel.senderCertificate, privateKey);
            try {
                await deliverParcel(gatewayAddress as string, pongParcel);
            } catch (err) {
                request.log.error({ err, gatewayAddress }, 'Failed to send pong');
                return reply.code(500).send({ message: 'Internal server error' });
            }
            return reply.code(202).send({});
        },
    });
}
