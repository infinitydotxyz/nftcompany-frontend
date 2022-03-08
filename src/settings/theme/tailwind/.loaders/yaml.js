const yaml = require("js-yaml")
const fs = require("fs")

exports.read = path => {
  try {
    const file = yaml.load(fs.readFileSync(`${path}`, "utf8"))
    const indentedJson = JSON.stringify(file, null, 2)
    return file
  } catch (e) {
    console.log(e)
  }
}
