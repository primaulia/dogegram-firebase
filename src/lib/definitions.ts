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
