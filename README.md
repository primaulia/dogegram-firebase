# Doggogram

![Screenshot 2024-04-20 at 5 50 12 PM](https://github.com/primaulia/dogegram-firebase/assets/1294303/9bd0c6d6-246f-46b3-8e3e-0d0ac3a9abe7)

This is a [Next.js](https://nextjs.org/) project bootstrapped with [`create-next-app`](https://github.com/vercel/next.js/tree/canary/packages/create-next-app). The application data is hosted at [Firebase](https://firebase.google.com/) and the data is all stored in [Firestore](https://firebase.google.com/docs/firestore).

## The application

- Public URL can be viewed [here](https://dogegram-ad8a9.web.app/)
- The site has been laid out responsively on any device, best viewed on the latest modern browser
- To run this app locally on your computer:
  - Clone the repo -> `gh repo clone primaulia/dogegram-firebase`
  - Go to the directory -> `cd dogegram-firebase`
  - Run the app -> `yarn dev`
  - It should run at a specific port in your localhost. Most of the time it'll be `localhost:3000`
 
### Additional features

On top of the features listed in the challenge documentation, I'm taking creative approach to add additional features that I find relevant to use the app better.

- Search breeds features
  
  ![Screenshot 2024-04-20 at 6 00 06 PM](https://github.com/primaulia/dogegram-firebase/assets/1294303/4eccb8ea-3f5c-477e-9fe1-d3c57b776cad)

  Type any keyword relevant to any of your breed names. It should filter the breed list.

- `My favourite doggos` page
  
  ![Screenshot 2024-04-20 at 6 01 25 PM](https://github.com/primaulia/dogegram-firebase/assets/1294303/a5e201f5-cad9-4fc2-bbd2-f4073e557ce5)

  After liking the photos on your [feed page](https://dogegram-ad8a9.web.app/feed). The liked photos will be collected on this page

#### Future feature
- `Surprise me` feature
  
  This is beyond the requirement, but once I've submitted this repo, I will try to implement a feature to add random breeds to the breeds list to allow new users explore the site better.

## Firestore structure

I'm keeping the structure of the firestorm simple with 2 collections that's all tied to the user authenticated to the app. The reasoning for this decisions are:

- Future-proofing the data structure should we need to query the `breeds` and `doggos` (photos) data further
- Allowing users to switch breeds and keeping the old photos that they've liked

### Diagram (TODO)

### Raw Data Screenshots
![Screenshot 2024-04-20 at 6 05 42 PM](https://github.com/primaulia/dogegram-firebase/assets/1294303/6d9689b7-6bed-4545-9dc8-2e0258b72c97)
![Screenshot 2024-04-20 at 6 05 48 PM](https://github.com/primaulia/dogegram-firebase/assets/1294303/e0babf23-b76c-4b40-b5a8-d880768bb257)

## Refactoring

> Provide a written explanation of how you would refactor the solution to include a Node.js Firebase function that connects to the dog.ceo https://dog.ceo/api/breeds/list/all API endpoint and fattens the data into a single array of strings.

TODO

## Unit test specs

TODO

