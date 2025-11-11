import express from 'express';
import cors from 'cors';
import bodyParser from 'body-parser';
import graphqlUploadExpress from 'graphql-upload/graphqlUploadExpress.mjs';
import { ApolloServer } from '@apollo/server';
import { expressMiddleware } from '@apollo/server/express4';
import { typeDefs } from './schema';
import { resolvers } from './resolvers';

async function start() {
  const server = new ApolloServer({
    typeDefs,
    resolvers,
    csrfPrevention: true,
    introspection: true
  });
  await server.start();

  const app = express();

  app.use('/graphql', cors({
    origin: 'http://localhost:4200',
    credentials: true,
    allowedHeaders: ['content-type', 'x-apollo-operation-name', 'apollo-require-preflight'],
    methods: ['POST', 'OPTIONS']
  }));
  
  // IMPORTANT: Upload middleware must run before json body parser for /graphql
  app.use('/graphql', graphqlUploadExpress({ maxFileSize: 20 * 1024 * 1024, maxFiles: 1 }));
  app.use('/graphql', bodyParser.json({ limit: '20mb' }));
  app.use('/graphql', expressMiddleware(server, { context: async () => ({}) }));

  const port = process.env.PORT ? Number(process.env.PORT) : 8000;
  app.listen(port, () => {
    console.log(`🚀 GraphQL ready at http://localhost:${port}/graphql`);
  });
}

start().catch((e) => {
  console.error(e);
  process.exit(1);
});
