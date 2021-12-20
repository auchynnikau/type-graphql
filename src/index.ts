import "reflect-metadata";
import { ApolloServer } from "apollo-server-express";
import { buildSchema } from "type-graphql";
import { createConnection } from "typeorm";
import connectRedis from "connect-redis";
import session from "express-session";
import Express from "express";
import cors from "cors";

import { ActiveUserResolver } from "./modules/user/activeUser";
import { RegisterResolver } from "./modules/user/register";
import { LoginResolver } from "./modules/user/login";
import { redis } from "./redis";

const main = async () => {
  const schema = await buildSchema({
    resolvers: [RegisterResolver, LoginResolver, ActiveUserResolver],
  });
  const apolloServer = new ApolloServer({
    schema,
    context: ({ req }: any) => ({ req }),
  });
  const app = Express();
  const RedisStore = connectRedis(session);

  app.use(
    cors({
      credentials: true,
      origin: "http://localhost:3000",
    })
  );

  app.use(
    session({
      store: new RedisStore({
        client: redis as any,
      }),
      name: "qid",
      secret: "123123123", // TODO: move to env
      resave: false,
      saveUninitialized: false,
      cookie: {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        maxAge: 1000 * 60 * 60 * 24 * 7 * 365,
      },
    })
  );

  await createConnection();
  await apolloServer.start();
  apolloServer.applyMiddleware({ app });
  app.listen(4000, () =>
    console.log("Server started on http://localhost:4000/graphql")
  );
};

main();
