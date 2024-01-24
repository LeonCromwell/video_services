const { v4: uuidv4 } = require("uuid");

function generateUniqueNumber() {
  const uuidv4String = uuidv4();
  const timestamp = Date.now();

  // Trích xuất 12 ký tự cuối cùng từ UUIDv4 và nối thêm timestamp
  const uuidv6String = `${uuidv4String.slice(0, -12)}${timestamp}`;

  return uuidv6String;
}

module.exports = generateUniqueNumber;
