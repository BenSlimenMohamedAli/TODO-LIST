import { loadEnv, env } from '@env';
import * as mongoose from 'mongoose';

export async function resetDB() {
  loadEnv();
  await mongoose.connect(
    `mongodb://${env.MONGO_HOST}/${env.MONGO_DB}?authSource=${env.MONGO_AUTH_DB}`,
    { useNewUrlParser: true },
  );
  await mongoose.connection.db.dropDatabase(function (err, result) {
    // console.log(result, err);
  });
}
