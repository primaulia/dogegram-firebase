export type BreedsResponse = {
  message: {
    [breed: string]: string[]; // Indexed access using breed as string, value is an array of strings
  };
  status: string;
};
