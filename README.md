# @quentinadam/rlp

[![JSR][jsr-image]][jsr-url] [![NPM][npm-image]][npm-url] [![CI][ci-image]][ci-url]

A simple library to encode data using the Recursive Length Prefix (RLP) encoding scheme, commonly used in Ethereum.

## Usage

```ts
import * as rlp from '@quentinadam/rlp';

rlp.encode([0x11, new Uint8Array([0x22, 0x33])]); // returns new Uint8Array([ 0xc4, 0x11, 0x82, 0x22, 0x33 ])
```

[ci-image]: https://img.shields.io/github/actions/workflow/status/quentinadam/deno-rlp/ci.yml?branch=main&logo=github&style=flat-square
[ci-url]: https://github.com/quentinadam/deno-rlp/actions/workflows/ci.yml
[npm-image]: https://img.shields.io/npm/v/@quentinadam/rlp.svg?style=flat-square
[npm-url]: https://npmjs.org/package/@quentinadam/rlp
[jsr-image]: https://jsr.io/badges/@quentinadam/rlp?style=flat-square
[jsr-url]: https://jsr.io/@quentinadam/rlp
