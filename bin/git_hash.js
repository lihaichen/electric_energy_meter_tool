const execSync = require('child_process').execSync;
let gitHash = '';
try {
  const result = execSync('git log --pretty=format:"%h" -1');
  gitHash = result.toString();
} catch (error) {
  gitHash = '';
}
module.exports = {
  gitHash: gitHash
};
