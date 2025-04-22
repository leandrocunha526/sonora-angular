import { Config, ConfigOptions } from 'karma';

export default function (config: Config) {
  const configuration: ConfigOptions = {
    frameworks: ['jasmine', '@angular-devkit/build-angular'],
    browsers: ['ChromeHeadlessNoSandbox'],
    customLaunchers: {
      ChromeHeadlessNoSandbox: {
        base: 'ChromeHeadless',
        flags: ['--no-sandbox']
      }
    },
    reporters: ['progress'],
    singleRun: true
  };

  config.set(configuration);
}
