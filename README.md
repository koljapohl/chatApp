# chatApp

## Project description

This project's goal is to build a serverless, progressive web application with React using a test-driven development approach.
The app will use the Google Calender API to fetch upcoming events.

## production handling

initialize new project

  ``expo init <project name>``

start of dev server

  ``npm run start`` OR ``expo start``

the build will be deployed to [gh-pages](https://koljapohl.github.io/meet)

for testing a serverless function locally run

`serverless invoke local --function <FUNCTION_NAME>`

deploy a serverless function

`serverless deploy`

for viewing previously deployed service

`serverless info`

run a local http server for a static HTML file for testing purposes (within test folder)

`http-server`

serves all files in the current directory on a local server

to run unit tests (from main folder)

`npm run test`

## Key features

## Dependencies

+ React
+ ReactDOM
+ React-Scripts
+ React-Native
+ React-Navigation

### dev-Dependencies

+ gh-pages

## API

This project connects to the Google Calender API
