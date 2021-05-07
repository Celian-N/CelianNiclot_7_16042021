export interface IComment{
  id : number;
  authorId : number;
  publicationId :number;
  text : string;
  userLiked : number[]
  creationDate : Date;
}