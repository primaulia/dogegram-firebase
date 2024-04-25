export type BreedsResponse = {
  message: {
    [breed: string]: string[];
  };
  status: string;
};

export type ImageResponse = {
  message: string;
  status: string;
};

export type ImagesResponse = {
  message: string[];
  status: string;
};

export type TBreed = {
  id: string;
  name: string;
  iconUrl: string;
  type: "base" | "sub";
  parent?: string;
};
