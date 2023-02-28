const crypto = require("crypto");

exports.deterministicPartitionKey = (event) => {
  const TRIVIAL_PARTITION_KEY = "0";
  const MAX_PARTITION_KEY_LENGTH = 256;

  if (!event) {
    return TRIVIAL_PARTITION_KEY;
  }

  let data = event.partitionKey ?? JSON.stringify(event);
  data = typeof data === "string" ? data : JSON.stringify(data);

  return data.length <= MAX_PARTITION_KEY_LENGTH
    ? data
    : crypto.createHash("sha3-512").update(data).digest("hex");
};
