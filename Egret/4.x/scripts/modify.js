var fs = require("fs");
var filePath = "./out/dragonBones.d.ts";
fs.writeFileSync(
    filePath,
    fs.readFileSync(filePath).toString().replace("declare var __extends: any;", "")
);