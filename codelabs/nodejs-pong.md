summary: Build a public endpoint using Node.js
id: nodejs-pong
categories: nodejs
tags: medium
status: Published
authors: Gus Narea
Feedback Link: https://github.com/AwalaNetwork/codelabs

# Build a public endpoint using Node.js

## Overview

Duration: 10:00

An _Awala service_ is a collection of mobile, desktop, server-side and/or CLI apps that exchange mutually-intelligible messages using _endpoints_. Server-side apps exposed as Internet hosts will have _public endpoints_ (e.g., `your-service.com`), whilst all other apps (e.g., mobile, desktop) will have _private endpoints_.

You're going to work with the [Awala Ping](https://specs.awala.network/RS-014) service in this codelab. Ping is a trivial service used to test Awala itself by having private endpoints send _pings_ to other endpoints and getting _pongs_ in response. The recipient of the ping can be public or private, but here you'll only use a public endpoint.

### What you'll build

You'll build a Node.js HTTP server that will act as a public endpoint in the Ping service, and you'll deploy it to [Google App Engine](https://cloud.google.com/appengine) (GAE).

Say your public endpoint address is `ping.awala.services` and a private endpoint in an Android app sends you a ping, as illustrated in the picture below. When the private endpoint sends the ping, the message will pass through the [private gateway](https://play.google.com/store/apps/details?id=tech.relaycorp.gateway), then on to a public gateway (such as `frankfurt.relaycorp.cloud`), and it'll finally arrive at your public endpoint.

![](images/ping-service/service-architecture-ping.png)

On the other hand, pong messages do the same route in reverse:

![](images/ping-service/service-architecture-pong.png)

Awala requires messages bound for private endpoints to be pre-authorised by the recipient, so each ping message includes an authorisation for the recipient (e.g., `ping.awala.services`) to reply with a pong message. In most services, authorisations would be issued once and renewed periodically, but public endpoints in the Ping service are meant to be stateless, so private endpoints have to issue an authorisation each time.

Positive
: The Ping service uses a request-response pattern because its sole purpose is to test that endpoints can send and receive data. However, **endpoints in your own services can send messages at any time** and there's no requirement to respond to messages. Your endpoints should just push data to their peers whenever new data is available, without waiting for anyone else to "initiate" the communication.

### What you'll need

- Basic understanding of Node.js and JavaScript/TypeScript.
- [Node.js](https://nodejs.org/en/download/) 14+. We'll assume that `npm`, `npx` and `node` are on your `$PATH`.
- A [Google Cloud Platform](https://cloud.google.com/) (GCP) account. As of this writing, running this codelab alone won't exceed your [free quota](https://cloud.google.com/appengine/quotas).
- A domain name with DNSSEC enabled and the ability to create SRV records. If you don't have one already, register a cheap one with your favourite registrar. Alternatively, if you know of a service offering this for free, use it and please [let us know about it](https://github.com/AwalaNetwork/codelabs/issues/5).
- An Android phone or tablet running Android 5+.
- The [private gateway](https://play.google.com/store/apps/details?id=tech.relaycorp.gateway) installed on that Android device.

### In case you need help

If you have any issues in the course of this codelab, please post a message on [our forum](https://community.awala.network/) and we'll help you out! You can also check out the [final version of the app you're going to build](https://github.com/AwalaNetwork/codelabs/tree/main/examples/nodejs-pong).

## Set up Google App Engine

Duration: 10:00

### Set up a new GCP project

1. [Create a new GCP project](https://console.cloud.google.com/projectcreate) and give it any name you'd like.
1. Make sure that billing is enabled for the project. [Learn how to confirm that billing is enabled](https://cloud.google.com/billing/docs/how-to/modify-project).
1. Enable the [Cloud Build API](https://console.cloud.google.com/apis/library/cloudbuild.googleapis.com).

### Set up the GCP SDK

[Install and initialize the GCP SDK](https://cloud.google.com/sdk/docs/install), and then make the new project the default:

```shell
gcloud config set project [YOUR_PROJECT_ID]
```

Negative
: It's important not to skip the command above if you're already using GCP. Otherwise, you'll end up modifying one of your existing projects.

### Deploy the app template

You're now going to deploy a trivial app to GAE to make sure everything is working so far. You're going to build on this app to implement the public endpoint later.

Start by creating the GAE app for your project in the region of your choosing:

```shell
gcloud app create
```

Next, [download the app template](/examples/nodejs-pong-template.zip), unzip it and change into its directory. On Linux and macOS, you can do this with the following commands:

```shell
wget https://codelabs.awala.network/examples/nodejs-pong-template.zip
unzip nodejs-pong-template.zip
cd nodejs-pong-template
```

Then install the app and build it:

```shell
npm install
npm run build
```

Let's make sure everything has worked so far by starting the server:

```shell
npm run start:dev
```

You should see the message `It works!` when you open [`http://localhost:8080`](http://localhost:8080/).

That's great! So now it's time to deploy the app to GAE, but first quit the server by pressing `Ctrl`+`C` (or `Cmd`+`C` on macOS), and then run the following:

```shell
gcloud app deploy
```

### Test the app!

Run the following command to open the app in your browser:

```shell
gcloud app browse
```

You should see something like this:

![](images/nodejs-pong/app-template-remote.png)

## Create the SRV record for the endpoint

Duration: 5:00

We don't need this DNS record just yet, but DNS propagation can sometimes take a while, so it's best to get it going now.

### Make sure your domain has DNSSEC properly configured

Go to [dnssec-analyzer.verisignlabs.com](https://dnssec-analyzer.verisignlabs.com) and check that your domain has DNSSEC properly configured. If that's the case, you'll see a screen like this:

![](images/nodejs-pong/dnssec-successful-analysis.png)

If any issues are reported, check the documentation of your DNS hosting provider and/or registrar to resolve them.

Negative
: For security reasons, Awala gateways will communicate with your public endpoint if and only if DNS answers have valid DNSSEC signatures.

### Create the record

Create an SRV record under the domain you wish to use using the following parameters:

- Domain name: `_rpdc._tcp.your-domain.com` if you want `your-domain.com` to be the public address, or `_rpdc._tcp.subdomain.your-domain.com` if you want `subdomain.your-domain.com` to be the public address. Alternatively, if you have to specify these fields separately, use:
  - Service: `_rpdc`.
  - Protocol: `_tcp` or TCP.
  - Name: `your-domain.com` or `subdomain.your-domain.com`.
- Value: `0 5 443 [YOUR-GAE-APP-DOMAIN]`. Alternatively, if you have to specify these fields separately, use:
 - Priority: `0`.
 - Weight: `5`.
 - Port: `443`.
 - Target: Your GAE app domain (e.g., `pong-codelab.nw.r.appspot.com`).

For example, if you were to map the public address `pong-codelab.awala.services` to `https://pong-codelab.nw.r.appspot.com` using Cloudflare as the DNS provider, you'd do the following:

![](images/nodejs-pong/srv-record-cloudflare.png)

You can use [dnschecker.org](https://dnschecker.org/#SRV/_rpdc._tcp.ping.awala.services) to monitor the propagation of the new DNS record in a new web browser tab, so that you can continue with the rest of the codelab.

## Generate an identity certificate

Duration: 5:00

Awala requires _nodes_ (i.e., gateways and endpoints) to have long-term _identity certificates_ in order for nodes to authenticate and authorise each other. Consequently, each message must be signed by the sender, and the sender's certificate must be attached to the message. Additionally, messages bound for private endpoints must contain a _certificate chain_ that includes the recipient's private gateway certificate.

Whilst this certainly impacts performance, it allows Awala to prevent abuse whilst protecting the privacy of end users in a highly-scalable manner: Nodes can verify that messages are authorised to reach the destination without leaking the identity of the human user behind private endpoints -- and without having to store any authorisation data.

You're going to use [`relaydev`](https://www.npmjs.com/package/@relaycorp/relaydev) to generate the identity certificate for your endpoint.

Positive
: In addition to high-level libraries and tools like `relaydev`, we're planning to take things further by [completely taking the key management off your plate](https://github.com/relaycorp/relayverse/issues/28).

### Generate a key pair

First, you need to generate the identity key:

```shell
npx @relaycorp/relaydev key gen-rsa > private-key.der
```

Negative
: You're about to deploy this app along with the private key above for expediency, but in production you should absolutely use a secret management tool instead. We recommend [Vault](https://www.vaultproject.io/) and offer an [official library](https://github.com/relaycorp/keystore-vault-js) that integrates seamlessly in Awala.

### Self-issue a certificate

Extract the public key from the key pair above:

```shell
npx @relaycorp/relaydev key get-rsa-pub < private-key.der > public-key.der
```

Then you can self-issue an identity certificate as shown below. Make sure to use an end date in the future.

```shell
npx @relaycorp/relaydev cert issue \
  --type=endpoint \
  --end-date=2022-01-01 \
  private-key.der \
  < public-key.der > identity-certificate.der
```

You won't need the public key anymore, so you can delete it now:

```shell
rm public-key.der
```

### Serve the certificate

You're going to serve the endpoint certificate so that other endpoints can use it to communicate with it. Awala doesn't currently offer a [standard way to distribute such certificates](https://github.com/AwalaNetwork/specs/issues/30), so you're just going to make it available at `/identity.der` in this codelab.

To do this, create the file `src/routes/identityCert.ts` with the following contents:

```typescript
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
```

### Test the new route

Start the server locally (`npm start:dev`) and check that the new route is working as expected by checking the certificate it outputs. On Linux/macOS you can run the following:

```shell
curl -s http://127.0.0.1:8080/identity.der | npx @relaycorp/relaydev cert inspect
```

You should see an output like this:

```
Common Name: 0224281a7b5bcf0aa0db4b48baf43b6f03905bc884fd9483ee6445a900f255fea
Private address: 0224281a7b5bcf0aa0db4b48baf43b6f03905bc884fd9483ee6445a900f255fea
Certificate is valid

Use `openssl` to get the full details:
openssl x509 -noout -text -inform DER -in /path/to/cert.der
```

## Process incoming pings

Duration: 10:00

## Send pongs

Duration: 10:00

## Test it with an Android app

Duration: 10:00

## That's it!

Duration: 5:00

Well done! You've just built an Android app for a centralised Awala service.

### Delete the GCP project

When you're done testing the public endpoint you created, do the following to delete the resources you created:

Negative
: If you created other GCP resources outside this codelab, those will be deleted too.

1. Go to the [GCP resource manager](https://console.cloud.google.com/cloud-resource-manager).
1.  In the project list, select the project that you want to delete, and then click _Delete_.
1.  In the dialog, type the project ID, and then click _Shut down_ to delete the project.

### What's next?

- Learn more about the [architecture of Awala services](https://awala.network/service-providers/implementation/architecture).
- Read the [API documentation for awaladroid](https://docs.relaycorp.tech/awala-endpoint-android/).
- [Join the Awala community](https://community.awala.network/) and give us some feedback on the codelab.
- [Share what you've just done on Twitter](https://twitter.com/intent/tweet?url=https%3A%2F%2Fawala.network%2Fservice-providers%2F&via=AwalaNetwork&text=I%27ve%20just%20built%20an%20app%20that%20can%20sync%20with%20the%20Internet%20even%20if%20the%20user%20is%20disconnected%20from%20it%21).
