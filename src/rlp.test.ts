import assert from '@quentinadam/assert';
import { equals } from '@quentinadam/uint8array-extension';
import { encode } from './rlp.ts';
import type { ValueOrArray } from './rlp.ts';

const vectors: { label: string; value: ValueOrArray; encoded: string }[] = [
  {
    label: 'empty string',
    value: new Uint8Array([]),
    encoded: '80',
  },
  {
    label: 'single byte < 0x80',
    value: new Uint8Array([0x42]),
    encoded: '42',
  },
  {
    label: 'single byte = 0x7f',
    value: new Uint8Array([0x7f]),
    encoded: '7f',
  },
  {
    label: 'single byte >= 0x80',
    value: new Uint8Array([0x80]),
    encoded: '8180',
  },
  {
    label: 'short string (< 56 bytes)',
    value: new Uint8Array([0x01, 0x02, 0x03, 0x04, 0x05]),
    encoded: '850102030405',
  },
  {
    label: 'string exactly 55 bytes',
    value: new Uint8Array(55).fill(0x42),
    encoded: 'b7' + '42'.repeat(55),
  },
  {
    label: 'long string (> 55 bytes)',
    value: new Uint8Array(100).fill(0x42),
    encoded: 'b864' + '42'.repeat(100),
  },
  {
    label: 'very long string (requires 2 bytes for length)',
    value: new Uint8Array(1000).fill(0x42),
    encoded: 'b903e8' + '42'.repeat(1000),
  },
  {
    label: 'empty list',
    value: [],
    encoded: 'c0',
  },
  {
    label: 'list with single element',
    value: [new Uint8Array([0x42])],
    encoded: 'c142',
  },
  {
    label: 'list with multiple elements',
    value: [new Uint8Array([0x01]), new Uint8Array([0x02]), new Uint8Array([0x03])],
    encoded: 'c3010203',
  },
  {
    label: 'nested list',
    value: [[new Uint8Array([0x01])], [new Uint8Array([0x02])]],
    encoded: 'c4c101c102',
  },
  {
    label: 'deeply nested list',
    value: [[[new Uint8Array([0x01])]]],
    encoded: 'c3c2c101',
  },
  {
    label: 'list with short string',
    value: [new Uint8Array([0x01, 0x02, 0x03])],
    encoded: 'c483010203',
  },
  {
    label: 'long list (> 55 bytes)',
    value: Array.from({ length: 30 }, () => new Uint8Array([0x01, 0x02])),
    encoded: 'f85a' + '820102'.repeat(30),
  },
  {
    label: 'very long list (requires 2 bytes for length)',
    value: Array.from({ length: 300 }, () => new Uint8Array([0x01, 0x02])),
    encoded: 'f90384' + '820102'.repeat(300),
  },
  {
    label: 'number (small)',
    value: 15,
    encoded: '0f',
  },
  {
    label: 'number (large)',
    value: 1024,
    encoded: '820400',
  },
  {
    label: 'bigint',
    value: 1000000000000n,
    encoded: '85e8d4a51000',
  },
  {
    label: 'mixed list',
    value: [
      new Uint8Array([0x01]),
      [new Uint8Array([0x02]), new Uint8Array([0x03])],
      new Uint8Array([0x04, 0x05, 0x06]),
    ],
    encoded: 'c801c2020383040506',
  },
  {
    label: 'Ethereum example: "dog"',
    value: new TextEncoder().encode('dog'),
    encoded: '83646f67',
  },
  {
    label: 'Ethereum example: ["cat", "dog"]',
    value: [new TextEncoder().encode('cat'), new TextEncoder().encode('dog')],
    encoded: 'c88363617483646f67',
  },
  {
    label: 'complex structure',
    value: [
      new Uint8Array([0x01]),
      [
        new Uint8Array([0x02, 0x03]),
        [
          new Uint8Array([0x04, 0x05, 0x06]),
        ],
      ],
      new Uint8Array(60).fill(0xff),
    ],
    encoded: 'f84801c8820203c483040506b83c' + 'ff'.repeat(60),
  },
];

for (const { label, value, encoded } of vectors) {
  Deno.test(`RLP encode - ${label}`, () => {
    const result = encode(value);
    assert(equals(result, Uint8Array.fromHex(encoded)));
  });
}
