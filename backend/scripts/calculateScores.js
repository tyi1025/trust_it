const { calculateScores } = require('../utils/scores');

(async () => {
  await calculateScores();
  process.exit();
})();
