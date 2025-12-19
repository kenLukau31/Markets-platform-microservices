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