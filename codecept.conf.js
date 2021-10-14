exports.config = {
  output: './output',
  helpers: {
    Playwright: {
      url: 'http://test.owlting.com',
      show: true,
      browser: 'chromium'
    }
  },
  include: {
    I: './steps_file.js'
  },
  mocha: {},
  bootstrap: null,
  teardown: null,
  hooks: [],
  gherkin: {
    features: './features/*.feature',
    steps: ['./step_definitions/steps.zh-TW.js']
  },
  plugins: {
    screenshotOnFail: {
      enabled: true
    },
    pauseOnFail: {},
    retryFailedStep: {
      enabled: true
    },
    tryTo: {
      enabled: true
    }
  },
  // It doesn't need to use now.
  // tests: './*_test.js',
  name: 'owlnest-bdd',
  translation: 'zh-TW'
}