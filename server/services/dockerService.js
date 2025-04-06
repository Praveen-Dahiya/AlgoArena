const { spawn } = require('child_process');
const fs = require('fs').promises;
const path = require('path');
const { v4: uuidv4 } = require('uuid');
const os = require('os');

const TMP_DIR = path.join(os.tmpdir(), 'algoArena');

const ensureTempDir = async () => {
  try {
    await fs.mkdir(TMP_DIR, { recursive: true });
  } catch (err) {
    console.error('Error creating temp directory:', err);
    throw err;
  }
};

const createCodeFile = async (code, language) => {
  await ensureTempDir();
  const id = uuidv4();
  const dirPath = path.join(TMP_DIR, id);
  await fs.mkdir(dirPath, { recursive: true });

  const ext = language === 'cpp' ? '.cpp' : '.txt';
  const filePath = path.join(dirPath, `main${ext}`);
  
  await fs.writeFile(filePath, code);
  
  return { id, dirPath, filePath };
};


const writeInputFile = async (dirPath, input) => {
  const inputPath = path.join(dirPath, 'input.txt');
  await fs.writeFile(inputPath, input);
  return inputPath;
};


const executeDocker = (dirPath, timeLimit, memoryLimit) => {
  return new Promise((resolve, reject) => {
    const dockerCommand = 'docker';
    const args = [
      'run',
      '--rm',
      '--network=none',
      `--memory=${memoryLimit}m`,
      '--cpus=0.5',
      '-v', `${dirPath}:/app`,
      'cpp-execution',
      '/bin/bash',
      '-c',
      'cd /app && g++ -std=c++17 -Wall -o main main.cpp && timeout 5s ./main < input.txt'
    ];

    if (process.platform === 'linux') {
      args.splice(4, 0, 
        `--ulimit=cpu=${timeLimit}`,
        '--ulimit=nofile=64:64',
        '--ulimit=nproc=32:32'
      );
    }

    const docker = spawn(dockerCommand, args);

    let stdout = '';
    let stderr = '';
    let startTime = Date.now();

    docker.stdout.on('data', (data) => {
      stdout += data.toString();
    });

    docker.stderr.on('data', (data) => {
      stderr += data.toString();
    });

    docker.on('close', (code) => {
      const executionTime = Date.now() - startTime;

      let status = 'Accepted';
      if (code === 124) {
        status = 'Time Limit Exceeded';
      } else if (code === 1) {
        if (stderr.includes('error:')) {
          status = 'Compilation Error';
        } else {
          status = 'Runtime Error';
        }
      } else if (code !== 0) {
        status = 'Runtime Error';
      }

      resolve({
        status,
        stdout,
        stderr,
        executionTime
      });
    });

    docker.on('error', (err) => {
      reject(err);
    });
  });
};

exports.runCode = async (code, language, input, timeLimit = 2000, memoryLimit = 128) => {
  try {
    
    const { id, dirPath, filePath } = await createCodeFile(code, language);
    
    await writeInputFile(dirPath, input);
    
    const result = await executeDocker(dirPath, Math.ceil(timeLimit / 1000), memoryLimit);
    
    try {
      await fs.rm(dirPath, { recursive: true, force: true });
    } catch (err) {
      console.error('Error cleaning up files:', err);
    }
    
    return result;
  } catch (err) {
    console.error('Error running code:', err);
    throw err;
  }
};

exports.testCodeAgainstCases = async (code, language, testCases, timeLimit = 2000, memoryLimit = 128) => {
  const results = [];
  let allPassed = true;
  
  for (const testCase of testCases) {
    const result = await this.runCode(code, language, testCase.input, timeLimit, memoryLimit);
    
    const outputMatches = result.stdout.trim() === testCase.expectedOutput.trim();

    if (!outputMatches && result.status === 'Accepted') {
      result.status = 'Wrong Answer';
      allPassed = false;
    }

    if (result.status !== 'Accepted') {
      allPassed = false;
    }
    
    results.push({
      ...result,
      passed: outputMatches && result.status === 'Accepted',
      testCase: testCase.isHidden ? { input: '(hidden)', expectedOutput: '(hidden)' } : testCase
    });
  }
  
  return {
    overall: allPassed ? 'Accepted' : 'Wrong Answer',
    results,
    testCasesPassed: results.filter(r => r.passed).length,
    totalTestCases: testCases.length
  };
};