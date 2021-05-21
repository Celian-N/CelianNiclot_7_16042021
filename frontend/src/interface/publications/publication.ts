export interface IPublication {
  id: number;
  authorId: number;
  userLiked: number[];
  imageUrl?: string;
  videoUrl?: string;
  gifUrl?: string;
  text?: string;
  link?: string;
  creationDate: Date;
}

export interface IApiPublication {
  id: number;
  authorId: number;
  userLiked: number[];
  imageUrl?: string;
  videoUrl?: string;
  gifUrl?: string;
  text?: string;
  link?: IMetaLink;
  creationDate: Date;
}

export interface ICreatePublication {
  imageUrl?: File | null;
  videoUrl?: string | null;
  gifUrl?: string | null;
  text?: string | null;
  link?: string | null;
}

export interface IMetaLink {
  images: Object[];
  meta: Object;
  og: {
    description: string;
    image: string;
    images: { url: string }[];
    site_name : string;
    title : string;
    type : string;
    url : string;
  };
}
