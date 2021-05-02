import { stripIndents } from '@nrwl/devkit';

export const envContent = (dbUrl: string) => stripIndents`
      # Environment variables declared in this file are automatically made available to Prisma.
      # See the documentation for more detail: https://pris.ly/d/prisma-schema#using-environment-variables

      # Prisma supports the native connection string format for PostgreSQL, MySQL and SQLite.
      # See the documentation for all the connection string options: https://pris.ly/d/connection-strings

      DATABASE_URL="${dbUrl}"
`;
