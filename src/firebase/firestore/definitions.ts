export type BreedStore = {
  name: string;
  iconUrl: string;
  type: "base" | "sub";
  user_id: string;
};

export type DoggoStore = {
  url: string;
  user_id: string;
};
