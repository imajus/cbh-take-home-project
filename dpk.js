const crypto = require("crypto");

exports.deterministicPartitionKey = (event) => {
  const TRIVIAL_PARTITION_KEY = "0";
  const MAX_PARTITION_KEY_LENGTH = 256;
  if (event) {
    let data;
    if (event.partitionKey) {
      data = event.partitionKey;
      if (typeof data !== "string") {
        data = JSON.stringify(data);
      }
      if (data.length <= MAX_PARTITION_KEY_LENGTH) {
        return data;
      }
    } else {
      data = JSON.stringify(event);
    }
    return crypto.createHash("sha3-512").update(data).digest("hex");
  } else {
    return TRIVIAL_PARTITION_KEY;
  }
};