const originArgv = process.argv.slice();

let processExit;
const exitErrorText = 'process.exit prevented in tests. Code:';

beforeEach(() => {
  jest.resetModules();
  jest.restoreAllMocks();

  processExit = jest
    .spyOn(process, 'exit')
    .mockName('processExit')
    .mockImplementation((code) => {
      throw Error(`${exitErrorText} ${code}`);
    });
});

afterEach(() => {
  process.argv = originArgv;
});

describe('run check', () => {
  let check;
  const checkName = 'some-check-name';

  beforeEach(() => {
    jest.mock('../check');
    check = require('../check');
  });

  test('default options', () => {
    process.argv = [process.argv[0], './cli-check.js', checkName];

    require('../cli-check');

    expect(check.run).toBeCalledTimes(1);
    expect(check.run).toBeCalledWith(checkName, {
      hideActions: false,
      shorten: true,
    });
    expect(processExit).not.toBeCalled();
  });

  test('changed options', () => {
    process.argv = [
      process.argv[0],
      './cli-check.js',
      checkName,
      '--hide-actions',
    ];

    require('../cli-check');

    expect(check.run).toBeCalledTimes(1);
    expect(check.run).toBeCalledWith(checkName, {
      hideActions: true,
      shorten: true,
    });
    expect(processExit).not.toBeCalled();
  });

  test('changed options to false', () => {
    process.argv = [
      process.argv[0],
      './cli-check.js',
      checkName,
      '--hide-actions',
      '--no-shorten',
    ];

    require('../cli-check');

    expect(check.run).toBeCalledTimes(1);
    expect(check.run).toBeCalledWith(checkName, {
      hideActions: true,
      shorten: false,
    });
    expect(processExit).not.toBeCalled();
  });
});
