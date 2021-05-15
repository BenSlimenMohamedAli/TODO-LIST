import { CommentDocument } from '@core/models/comment.model';
import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { CreateCommentInput, UpdateCommentInput } from './comment.inputs';
import { Comment } from '@core/models/comment.model';

@Injectable()
export class CommentService {
  constructor(
    @InjectModel(Comment.name)
    private commentModel?: Model<CommentDocument>,
  ) {}

  findById(_id: Types.ObjectId) {
    return this.commentModel.findById(_id).exec();
  }

  async listByTask(taskId: Types.ObjectId): Promise<Comment[]> {
    const comments: Promise<Comment[]> = this.commentModel
      .find({ task: taskId.toString() })
      .exec();

    return comments;
  }

  create(comment: CreateCommentInput, user: string): Promise<Comment> {
    const newComment = new this.commentModel({ ...comment, user });
    const output = newComment.save();
    return output;
  }

  update(task: UpdateCommentInput) {
    return this.commentModel
      .updateOne({ _id: task._id }, task)
      .exec()
      .then((updated) => {
        return updated.nModified ? true : false;
      })
      .catch(() => {
        return false;
      });
  }

  delete(_id: Types.ObjectId): Promise<boolean> {
    return this.commentModel
      .findByIdAndDelete(_id)
      .exec()
      .then(() => true)
      .catch(() => false);
  }
}
