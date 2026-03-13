import ensure from '@quentinadam/ensure';
import { concat, fromUintBE } from '@quentinadam/uint8array-extension';

export type ValueOrArray = number | bigint | Uint8Array<ArrayBuffer> | ValueOrArray[];

export function encode(value: ValueOrArray): Uint8Array<ArrayBuffer> {
  if (typeof value === 'number' || typeof value === 'bigint') {
    return encode(fromUintBE(value));
  }
  if (value instanceof Uint8Array) {
    if (value.length === 1 && ensure(value[0]) < 0x80) {
      return value;
    } else if (value.length <= 55) {
      return concat([new Uint8Array([0x80 + value.length]), value]);
    } else {
      const lengthBuffer = fromUintBE(value.length);
      return concat([new Uint8Array([0xb7 + lengthBuffer.length]), lengthBuffer, value]);
    }
  }
  const buffer = concat(value.map((value) => encode(value)));
  if (buffer.length <= 55) {
    return concat([new Uint8Array([0xc0 + buffer.length]), buffer]);
  } else {
    const lengthBuffer = fromUintBE(buffer.length);
    return concat([new Uint8Array([0xf7 + lengthBuffer.length]), lengthBuffer, buffer]);
  }
}
