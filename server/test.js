const bcrypt = require("bcryptjs");

const hash = "$2b$10$Lgy9fPomSm8KVbQ6caudl.12pkk69EhvDYi.Z5Dufsu.DXI.UTfSm";

bcrypt.compare("Admin@1234", hash).then(console.log);