import { DatabaseModule } from '@core/database.module';
import { GraphqlModule } from '@core/graphql.module';
import { Test, TestingModule } from '@nestjs/testing';
import { UserModule } from './user.module';
import { UserResolver } from './user.resolver';

describe('UserResolver', () => {
  let resolver: UserResolver;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [DatabaseModule, GraphqlModule, UserModule],
    }).compile();

    resolver = module.get<UserResolver>(UserResolver);
  });

  it('should be defined', () => {
    expect(resolver).toBeDefined();
  });
});
