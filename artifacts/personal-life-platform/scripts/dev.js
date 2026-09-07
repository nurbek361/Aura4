const { spawnSync } = require('child_process');

const isReplit = Boolean(process.env.REPLIT_DEV_DOMAIN);

function run(command, args, extraEnv) {
  const result = spawnSync(command, args, {
    stdio: 'inherit',
    shell: process.platform === 'win32',
    env: { ...process.env, ...extraEnv },
  });
  if (result.status !== 0 && result.status !== null) {
    process.exit(result.status);
  }
}

if (isReplit) {
  if (process.env.REPLIT_EXPO_SESSION_SECRET) {
    run('pnpm', ['exec', 'create-launch', 'login', '--session', process.env.REPLIT_EXPO_SESSION_SECRET]);
  }
  run('pnpm', ['exec', 'expo', 'start', '--localhost', '--port', process.env.PORT || '8081'], {
    EXPO_PACKAGER_PROXY_URL: `https://${process.env.REPLIT_EXPO_DEV_DOMAIN}`,
    EXPO_PUBLIC_DOMAIN: process.env.REPLIT_DEV_DOMAIN,
    EXPO_PUBLIC_REPL_ID: process.env.REPL_ID,
    REACT_NATIVE_PACKAGER_HOSTNAME: process.env.REPLIT_DEV_DOMAIN,
  });
} else {
  run('pnpm', ['exec', 'expo', 'start']);
}