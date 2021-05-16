import { Module } from '@nestjs/common';
import { env, loadEnv } from '@env';
import { MongooseModule } from '@nestjs/mongoose';
loadEnv();

const MONGO_LINK = `mongodb://${env.MONGO_HOST}/${env.MONGO_DB}?authSource=${env.MONGO_AUTH_DB}`;

@Module({
  imports: [
    MongooseModule.forRoot(MONGO_LINK, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      useFindAndModify: false,
      useCreateIndex: true,
      autoIndex: true,
    }),
  ],
})
export class DatabaseModule {}
