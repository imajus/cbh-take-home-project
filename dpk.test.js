const crypto = require("crypto");
const chai = require("chai");
const { deterministicPartitionKey } = require("./dpk");
const { expect } = chai;

describe("deterministicPartitionKey", () => {
  it("Returns the literal '0' when given no input", () => {
    const trivialKey = deterministicPartitionKey();
    expect(trivialKey).to.be.equal("0");
  });
  it("Returns custom partition key passed (non-empty string)", () => {
    const result = deterministicPartitionKey({
      partitionKey: 'custom-partition-key',
    });
    expect(result).to.be.equal('custom-partition-key');
  });
  [
    [true, 'true'],
    [123, '123'],
    [123.567, '123.567'],
    [-1, '-1'],
    [-1.23456, '-1.23456'],
    [[], '[]'],
    [{}, '{}'],
    [{ xxx: 'yyy' }, '{"xxx":"yyy"}'],
  ].forEach(([partitionKey, expected]) => {
    it(`Converts non-string custom partition key to JSON (${JSON.stringify(partitionKey)})`, () => {
      const result = deterministicPartitionKey({ partitionKey });
      expect(result).to.be.equal(expected);
    });
  });
  it('Throws an error if function is passed for partition key', () => {
    const partitionKey = () => {};
    expect(() => deterministicPartitionKey({ partitionKey })).to.throw('Cannot read properties of undefined');
  });
  it("Generates partition key using SHA3-512 algorithm from JSON value of argument (missing `partitionKey`)", () => {
    const event = {
      aaa: 'bbb',
      ccc: { 'ddd': 123 },
      eee: ['fff', true, null, -1],
    };
    const eventStr = JSON.stringify(event);
    const result = deterministicPartitionKey(event);
    const expected = crypto.createHash("sha3-512").update(eventStr).digest("hex");
    expect(result).to.be.equal(expected);
  });
  it("Generates partition key using SHA3-512 algorithm from JSON value of argument (empty string as `partitionKey`)", () => {
    const event = { partitionKey: '' };
    const eventStr = JSON.stringify(event);
    const result = deterministicPartitionKey(event);
    const expected = crypto.createHash("sha3-512").update(eventStr).digest("hex");
    expect(result).to.be.equal(expected);
  });
  it("Re-generates partition key in case if passed key length exceeds the limit (string key)", () => {
    const partitionKey = 'A'.repeat(257);
    const result = deterministicPartitionKey({ partitionKey });
    const expected = crypto.createHash("sha3-512").update(partitionKey).digest("hex");
    expect(result).to.be.equal(expected);
  });
  it("Re-generates partition key in case if passed key length exceeds the limit (non-string key)", () => {
    const aaa = 'A'.repeat(247);
    const partitionKey = { aaa };
    const partitionKeyStr = JSON.stringify(partitionKey);
    const result = deterministicPartitionKey({ partitionKey });
    const expected = crypto.createHash("sha3-512").update(partitionKeyStr).digest("hex");
    expect(partitionKeyStr).to.have.lengthOf(257);
    expect(result).to.be.equal(expected);
  });
});
