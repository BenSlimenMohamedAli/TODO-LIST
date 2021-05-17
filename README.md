<!-- PROJECT LOGO -->
<br />
<p align="center">

  <h3 align="center">TODO-LIST</h3>

  <p align="center">
    NodeJs ( NestJs based on Express ), TypeScript, GraphQL and MongoDB todo list project
    <br />
    <br />
    <br />
    
  </p>
</p>

<!-- TABLE OF CONTENTS -->
<details open="open">
  <summary>Table of Contents</summary>
  <ol>
    <li>
      <a href="#about-the-project">About The Project</a>
      <ul>
        <li><a href="#built-with">Built With</a></li>
      </ul>
    </li>
    <li>
      <a href="#getting-started">Getting Started</a>
      <ul>
        <li><a href="#prerequisites">Prerequisites</a></li>
        <li><a href="#installation">Installation</a></li>
      </ul>
    </li>
    <li><a href="#usage">Usage</a></li>
    <li><a href="#contact">Contact</a></li>
  </ol>
</details>

<!-- ABOUT THE PROJECT -->

## About The Project

The project aims to build a service that gives the possibility of managing task lists by storing its status and sharing tasks between users, as well as managing users and user lists..

Here's why:

- Your time should be focused on creating something amazing. A project that solves a problem and helps others
- Using to-do lists increases your productivity
- You should element Better principles to the rest of your life :smile:

### Built With

The project is made using several technologies:

- [NodeJs](https://nodejs.org)
- [NestJs](https://nestjs.com)
- [MongoDB](https://www.mongodb.com)
- [GraphQL](https://graphql.org)
- [TypeScript](https://www.typescriptlang.org)
- [Jest](https://jestjs.io/)
- [Docker](https://www.typescriptlang.org)
- [Insomnia](https://insomnia.rest/download)

<!-- GETTING STARTED -->

## Getting Started

To get started with TODO-LIST you should follow the next steps carefully

### Prerequisites

This is a nodeJs project, if you will run the project in development mode or execute tests, you need to install version 12 of nodeJs first, as well as MongoDb , otherwise if you will run the project using Docker, you just need install Docker.

### Installation

1. Clone the repo
   ```sh
   git clone https://github.com/DaliSlimen/TODO-LIST.git
   ```
2. open the repo in a terminal
3. if you want to run the project using Docker run the following command and ignore the next steps.
   ```sh
   docker-compose up
   ```
4. install dependencies
   ```sh
   npm i
   ```
5. run the project

- dev mode
  ```sh
  npm run dev
  ```
- test mode

  ```sh
  npm run test
  ```

  or

  ```sh
  npm run test:e2e
  ```

- production mode
  ```sh
  npm start
  ```

<!-- USAGE EXAMPLES -->

## Usage

if you feel comfortable by using the graphql playground you can use it in development mode over the following url `http://localhost:3001/graphql`, Otherwise there is a folder in the project called Insomnia containing a json file that is an Insomnia collection, you can import it to your local Insomnia by going to `Application` -> `Preferences` -> `Data` -> `Import Data` -> `From File` and then select the file, later select the environment: dev for dev mode and prod for production or docker.

If you don't have Insomnia installed in your computer please refer to this link to install it : [Insomnia](https://insomnia.rest/download)

### Insomnia

The api authentication is managed by cookies, you don't need to write any tokens in your requests.

The Insomnia collection is a full example of the project, you can use it to simulate the scenarios that you need to understand.

The following image is taken during the API testing in Insomnia :

[![Insomnia Screen Shot][product-screenshot]]()

### Run E2E Test to verify the built test scenario

The following image is the result of the e2e test, run `npm run test:e2e` to get the same result :

[![Insomnia Screen Shot][e2e]]()

<!-- CONTACT -->

## Contact

Ben Slimen Mohamed Ali - dslimen.15@gmail.com.com

Project Link: [https://github.com/DaliSlimen/TODO-LIST](https://github.com/DaliSlimen/TODO-LIST)

[product-screenshot]: screenshots/insomnia.png
[e2e]: screenshots/e2e.png
