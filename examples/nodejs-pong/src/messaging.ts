import {
    Certificate,
    Parcel,
    ServiceMessage,
    SessionlessEnvelopedData
} from "@relaycorp/relaynet-core";

import { bufferToArrayBuffer } from "./utils";

export interface Ping {
    id: string;
    pda: Certificate;
    pdaChain: Certificate[];
}

export async function extractPingFromParcel(parcel: Parcel, privateKey: CryptoKey): Promise<Ping> {
    const { payload: serviceMessage } = await parcel.unwrapPayload(privateKey);
    if (serviceMessage.type !== 'application/vnd.awala.ping-v1.ping') {
        throw new Error(`Invalid service message type: ${serviceMessage.type}`);
    }
    return deserializePing(serviceMessage.content);
}

function deserializePing(pingSerialized: Buffer): Ping {
    const pingJson = JSON.parse(pingSerialized.toString());

    if (typeof pingJson.id !== 'string') {
        throw new Error('Ping id is missing or it is not a string');
    }

    let pda: Certificate;
    try {
        pda = deserializeCertificate(pingJson.pda);
    } catch (err) {
        throw new Error(`Invalid PDA: ${err.message}`);
    }

    if (!Array.isArray(pingJson.pda_chain)) {
        throw new Error('PDA chain is not an array');
    }
    let pdaChain: Certificate[];
    try {
        pdaChain = pingJson.pda_chain.map(deserializeCertificate);
    } catch (err) {
        throw new Error(`PDA chain contains invalid item: ${err.message}`);
    }

    return { id: pingJson.id, pda, pdaChain };
}

function deserializeCertificate(certificateDerBase64: any): Certificate {
    if (typeof certificateDerBase64 !== 'string') {
        throw new Error('Certificate is missing');
    }

    const certificateDer = Buffer.from(certificateDerBase64, 'base64');
    if (certificateDer.byteLength === 0) {
        throw new Error('Certificate is not base64-encoded');
    }

    try {
        return Certificate.deserialize(bufferToArrayBuffer(certificateDer));
    } catch (error) {
        throw new Error('Certificate is base64-encoded but not DER-encoded');
    }
}

export async function createPongParcel(
    ping: Ping,
    pingSenderCertificate: Certificate,
    privateKey: CryptoKey
): Promise<Buffer> {
    const pongMessage = new ServiceMessage(
        'application/vnd.awala.ping-v1.pong',
        Buffer.from(ping.id),
    );
    const pongParcelPayload = await SessionlessEnvelopedData.encrypt(
        pongMessage.serialize(),
        pingSenderCertificate,
    );
    const pongParcel = new Parcel(
        await pingSenderCertificate.calculateSubjectPrivateAddress(),
        ping.pda,
        Buffer.from(pongParcelPayload.serialize()),
        { senderCaCertificateChain: ping.pdaChain },
    );
    return Buffer.from(await pongParcel.serialize(privateKey));
}
