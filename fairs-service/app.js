import { ApolloServer } from '@apollo/server';
import { startStandaloneServer } from '@apollo/server/standalone';
import pino from 'pino';
import 'dotenv/config'; 

// IMPORT typeDefs / resolvers
import typeDefs from './schema.js'; 
import resolvers from './resolvers.js';

// Logger
const logger = pino({
  transport: {
    target: "pino-pretty",
    options: { colorize: true }
  }
});




const GRAPHQL_PORT = process.env.GRAPHQL_PORT || 4001;

// Create Apollo Server
const server = new ApolloServer({
  typeDefs,
  resolvers,
});


  const { url } = await startStandaloneServer(server, {
    listen: { port: GRAPHQL_PORT }
  });

  logger.info(`GraphQL Fairs Service running at: ${url}`);







































// const express = require("express");
// const swaggerUi = require("swagger-ui-express"); 
// const swaggerFile = require("../users-service/swagger-output.json"); 
// const jwt = require('jsonwebtoken');
// const pino = require("pino");
// const { ApolloServer, gql } = require("apollo-server");
// require('dotenv').config();


// const app = express();

// const logger = pino({
//   transport: {
//     target: "pino-pretty",
//     options: {colorize: true}
//   }
// }) 


// const GRAPHQL_PORT = process.env.GRAPHQL_PORT || 4001;

// // Create Apollo Server
// const server = new ApolloServer({
// typeDefs,
// resolvers
// });
// // Start the server
// server.listen({ port: GRAPHQL_PORT }).then(({ url }) => {
// console.log(`GrahpQL Fairs Service server running in ${url}`);
// });
