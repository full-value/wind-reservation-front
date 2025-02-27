export type Album = {
  albumId: string;
  name: string;
  description: string;
  createdAt: string;
  updatedAt: string;
  photos: Array<Photo>;
  coverPhoto?: CoverPhoto;
};

export type Photo = {
  photoId: string;
  originalKey: string;
  compressedKey: string;
  originalUrl: string;
  compressedUrl: string;
  isUploaded: boolean;
  createdAt: string;
  updatedAt: string;
};

export type CoverPhoto = {
  photoId: string;
  originalKey: string;
  compressedKey: string;
}
