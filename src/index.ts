import "reflect-metadata";
import { ApolloServer } from "apollo-server-express";
import * as Express from "express";
import { buildSchema } from "type-graphql";
import { createConnection } from "typeorm";

import { RegisterResolver } from "./modules/user/register";

const main = async () => {
  const schema = await buildSchema({
    resolvers: [RegisterResolver],
  });
  const apolloServer = new ApolloServer({ schema });
  const app = Express();

  await createConnection();
  await apolloServer.start();
  apolloServer.applyMiddleware({ app });
  app.listen(4000, () =>
    console.log("Server started on http://localhost:4000/graphql")
  );
};

main();
