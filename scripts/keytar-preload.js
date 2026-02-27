const Module = require('module');
const orig = Module._load;
Module._load = function(request, parent, isMain) {
  if (request === 'keytar') {
    const creds = process.env._CLAUDE_CREDS;
    process.stderr.write('[mock-keytar] loaded\n');
    return {
      getPassword: async (service, account) => {
        process.stderr.write('[mock-keytar] getPassword: ' + service + ' / ' + account + '\n');
        if (service === 'Claude Code-credentials' && creds) return creds;
        return null;
      },
      setPassword: async () => {},
      deletePassword: async () => false,
      findCredentials: async () => [],
    };
  }
  return orig.apply(this, arguments);
};
