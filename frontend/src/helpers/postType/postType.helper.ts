import { IComment } from '../../interface/comments/comments';
import { IApiPublication, IPublication } from '../../interface/publications/publication';

export function isComment(toBeDetermined: IComment | IPublication | IApiPublication): toBeDetermined is IComment {
  return !!(toBeDetermined as IComment).publicationId;
}
