import { User } from "next-auth";
import { JWT } from "next-auth/jwt";

declare module "next-auth/jwt" {
  interface JWT {
    access: string;
    refresh: string;
    user: {
      id: string;
      email: string;
      firstName: string;
      lastName: string;
    };
  }
}

declare module "next-auth" {
  interface Session {
    access: string;
    refresh: string;
    user: User & {
      email: string;
      firstName: string;
      lastName: string;
    };
  }

  interface User {
    access: string;
    refresh: string;
    user: User & {
      email: string;
      firstName: string;
      lastName: string;
    };
  }
}
