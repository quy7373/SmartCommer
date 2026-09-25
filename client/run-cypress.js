import cypress from 'cypress';
import { spawn } from 'child_process';
import http from 'http';

delete process.env.ELECTRON_RUN_AS_NODE;

const PORT = 5188;

function checkServer() {
  return new Promise((resolve) => {
    const req = http.get(`http://localhost:${PORT}/`, (res) => {
      res.resume();
      resolve(true);
    });
    req.on('error', () => resolve(false));
    req.setTimeout(1000, () => {
      req.destroy();
      resolve(false);
    });
  });
}

async function waitForServer(timeout = 30000) {
  const start = Date.now();
  while (Date.now() - start < timeout) {
    if (await checkServer()) return true;
    await new Promise((r) => setTimeout(r, 500));
  }
  return false;
}

async function run() {
  let viteProcess = null;
  const isRunning = await checkServer();

  if (!isRunning) {
    console.log(`Starting Vite server on port ${PORT}...`);
    viteProcess = spawn('npx', ['vite', '--port', String(PORT), '--strictPort'], {
      shell: true,
      stdio: 'pipe',
    });
    const ready = await waitForServer();
    if (!ready) {
      console.error(`Failed to start Vite dev server on port ${PORT} within 30s.`);
      if (viteProcess) viteProcess.kill();
      process.exit(1);
    }
  }

  try {
    const results = await cypress.run({
      browser: 'chrome',
      config: {
        video: false,
        screenshotOnRunFailure: false,
      },
    });

    if (results.status === 'failed') {
      console.error('Cypress run failed:', results.message);
      process.exit(1);
    }

    console.log(`\nCypress Finished: ${results.totalPassed} passed, ${results.totalFailed} failed.`);
    if (results.runs) {
      for (const run of results.runs) {
        console.log(`\nSpec: ${run.spec.name}`);
        if (run.error) {
          console.error(`  Compile Error: ${run.error}`);
        }
        for (const test of run.tests || []) {
          console.log(`  - [${test.state}] ${test.title.join(' > ')}`);
          if (test.displayError) {
            console.error(`    Error: ${test.displayError}`);
          }
        }
      }
    }

    if (results.totalFailed > 0) {
      process.exit(1);
    }
  } catch (err) {
    console.error('Unexpected error running Cypress:', err);
    process.exit(1);
  } finally {
    if (viteProcess) {
      console.log('Shutting down Vite server...');
      viteProcess.kill();
    }
  }
}

run();
