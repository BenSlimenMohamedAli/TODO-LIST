import { paginationInput } from './pagination.input';
import { paginationOutput } from './pagination.output';
export const setupPaginationOutput = (
  pagination: paginationInput,
  total: number,
): paginationOutput => {
  const remainingItems = total % pagination.size;
  const totalPages = remainingItems
    ? (total - remainingItems) / pagination.size + 1
    : total / pagination.size;
  const output: paginationOutput = {
    size: pagination.size,
    page: pagination.page,
    total,
    totalPages,
  };
  return output;
};
