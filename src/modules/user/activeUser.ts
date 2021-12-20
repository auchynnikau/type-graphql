import { Query, Resolver, Ctx } from "type-graphql";

import { User } from "../../entities/user";
import { Context } from "../../types/context";

@Resolver()
export class ActiveUserResolver {
  @Query(() => User, { nullable: true })
  async activeUser(@Ctx() ctx: Context): Promise<User | undefined> {
    if (!ctx.req.session!.userId) {
      return undefined;
    }

    return User.findOne(ctx.req.session!.userId);
  }
}
