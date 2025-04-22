import { Config, ConfigOptions } from 'karma';

export default function (config: Config): void {
  const configuration: ConfigOptions = {
    frameworks: ['jasmine', '@angular-devkit/build-angular'],
    browsers: ['ChromeHeadlessNoSandbox'],
    customLaunchers: {
      ChromeHeadlessNoSandbox: {
        base: 'ChromeHeadless',
        flags: ['--no-sandbox', '--disable-gpu']
      }
    },
    singleRun: true,
    reporters: ['progress'],
  };

  config.set(configuration);
}
