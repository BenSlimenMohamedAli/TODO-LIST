import { Module } from '@nestjs/common';
import { GraphQLModule } from '@nestjs/graphql';
import { join } from 'path';

@Module({
  imports: [
    GraphQLModule.forRoot({
      autoSchemaFile: join(process.cwd(), './src/core/schema.gql'),
      context: ({ req, res }) => ({ req, res }),
      sortSchema: true,
      playground:
        process.env.NODE_ENV === 'dev'
          ? {
              settings: {
                'editor.theme': 'dark',
                'request.credentials': 'same-origin',
              },
            }
          : false,
      debug: process.env.NODE_ENV === 'dev',
      uploads: true,
      cors: {
        credentials: true,
        origin: true,
      },
    }),
  ],
})
export class GraphqlModule {}
