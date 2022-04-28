## Activity Content

[![Latest Release](https://img.shields.io/github/release/LibertyDSNP/activity-content)](https://github.com/LibertyDSNP/activity-content/releases)

[![Actions Status](https://github.com/LibertyDSNP/activity-content/actions/workflows/main.yml/badge.svg)](https://github.com/LibertyDSNP/activity-content/actions)

### Quick Start

#### Install the package
Install the Activity Content package with the following command:
`npm install @dsnp/activity-content`

### Usage
Once the Activity Content package is installed, you can access the functions like in the given example

```javascript
const activityContent = require("@dsnp/activity-content")
const hashTag = activityContent.factories.createHashTag("Earth")
```

### Documentation

### How to Build
Run `npm run build`

### How to Compile Documentation
- Run `npm run doc` for markdown documentation
- Run `npm run doc:html` for HTML documentation
- Run `npm run doc:json` for JSON documentation

### Testing
To run tests, run `npm run test`
