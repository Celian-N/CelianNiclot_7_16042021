
export interface IPublication{
  id:number;
  authorId: number,
  userLiked: string[],
  imageUrl?: string,
  videoUrl?: string,
  gifUrl?: string,
  text?: string,
  link?: string,
  creationDate: Date,
}

export interface ICreatePublication{
  imageUrl?: File | null;
  videoUrl?: string | null;
  gifUrl?: string | null;
  text?: string | null;
  link?: string | null;
}