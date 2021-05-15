import { DatabaseModule } from '@core/database.module';
import { GraphqlModule } from '@core/graphql.module';
import { Test, TestingModule } from '@nestjs/testing';
import { TaskModule } from './task.module';
import { TaskResolver } from './task.resolver';

describe('TaskResolver', () => {
  let resolver: TaskResolver;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [DatabaseModule, GraphqlModule, TaskModule],
    }).compile();

    resolver = module.get<TaskResolver>(TaskResolver);
  });

  it('should be defined', () => {
    expect(resolver).toBeDefined();
  });
});
