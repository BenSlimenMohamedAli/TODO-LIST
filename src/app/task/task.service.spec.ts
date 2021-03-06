import { Test, TestingModule } from '@nestjs/testing';
import { TaskService } from './task.service';
import { TaskModule } from './task.module';
import { DatabaseModule } from '@core/database.module';
import { GraphqlModule } from '@core/graphql.module';

describe('TaskService', () => {
  let service: TaskService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [DatabaseModule, GraphqlModule, TaskModule],
    }).compile();

    service = module.get<TaskService>(TaskService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
