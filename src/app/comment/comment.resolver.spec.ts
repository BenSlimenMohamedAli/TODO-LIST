import { DatabaseModule } from '@core/database.module';
import { GraphqlModule } from '@core/graphql.module';
import { Test, TestingModule } from '@nestjs/testing';
import { CommentModule } from './comment.module';
import { CommentResolver } from './comment.resolver';

describe('CommentResolver', () => {
  let resolver: CommentResolver;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [DatabaseModule, GraphqlModule, CommentModule],
    }).compile();

    resolver = module.get<CommentResolver>(CommentResolver);
  });

  it('should be defined', () => {
    expect(resolver).toBeDefined();
  });
});
