# Awala Codelabs

Codelabs for Awala service providers. A live version is available on [codelabs.awala.network](https://codelabs.awala.network).

## Setup

You need the following system requirements:

- Node.js.
- Go.

Then you need to install the Node.js and Go dependencies. If you run Linux or macOS, you can just run the script `bin/setup.sh`. If you use Windows, run:

```shell
go get github.com/googlecodelabs/tools/claat
cd site
npm install
```

## Repository organisation

### `/codelabs`

[`/codelabs`](./codelabs) contains the source code for the codelabs, which are to be processed by [Claat](https://github.com/googlecodelabs/tools/tree/master/claat).

### `/site`

[`/site`](./site) is a fork of https://github.com/googlecodelabs/tools/tree/master/site. See [#1](https://github.com/AwalaNetwork/codelabs/issues/1).

## Development

To work on codelabs locally, run the following commands from the root of this repository:

```shell
cd site
node_modules/.bin/gulp serve
```

Then visit http://localhost:8000/.
