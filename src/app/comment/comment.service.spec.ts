import { Test, TestingModule } from '@nestjs/testing';
import { CommentService } from './comment.service';
import { CommentModule } from './comment.module';
import { DatabaseModule } from '@core/database.module';
import { GraphqlModule } from '@core/graphql.module';

describe('CommentService', () => {
  let service: CommentService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [DatabaseModule, GraphqlModule, CommentModule],
    }).compile();

    service = module.get<CommentService>(CommentService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
