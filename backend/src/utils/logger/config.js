// sorted by severity
const logLevels = {
    levels: {
      error: 0,
      warn: 1,
      audit: 2,
      info: 3,
      debug: 4,
    },
    colors: {
      error: 'red',
      warn: 'yellow',
      audit: 'cyan',
      info: 'magenta',
      debug: 'white',
    },
  };
  
  const mandatoryKeys = ['message', 'level'];

  const validLogKeys = new Set([...mandatoryKeys]);

  module.exports = {
    logLevels,
    validLogKeys,
  };