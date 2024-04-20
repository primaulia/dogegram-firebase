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
 
### Additional developed features

On top of the features listed in the challenge documentation, I'm taking a creative approach to add additional features that I find relevant to use the app better.

- Simple breeds management feature

  TODO screenshots

  This feature will allow users to undo their choices once they've picked their chosen breed. This will allow them to explore other dog photos.
  
- Search breeds feature
  
  ![Screenshot 2024-04-20 at 6 00 06 PM](https://github.com/primaulia/dogegram-firebase/assets/1294303/4eccb8ea-3f5c-477e-9fe1-d3c57b776cad)

  Type any keyword relevant to any of your breed names. It should filter the breed list.

- `My favorite doggos` page
  
  ![Screenshot 2024-04-20 at 6 01 25 PM](https://github.com/primaulia/dogegram-firebase/assets/1294303/a5e201f5-cad9-4fc2-bbd2-f4073e557ce5)

  After liking the photos on your [feed page](https://dogegram-ad8a9.web.app/feed). The liked photos will be collected on this page. Users will also be able to remove their favorite photos on this page.

#### Future features and improvements
- `Surprise me` feature
  
  I will implement a feature that will allow users to add random breeds. This will let users explore more photos from breeds they're not familiar with.

- Refactor the `SavedBreeds` state

  Reduce the API call to the Firestore by sharing the `SavedBreeds` state through React's context.

- Partial pre-rendering of the breed state

  Currently, all data from the API are displayed at render. I could improve this by only loading a few and suspending the rendering once it's needed using the built-in `Next.js` pre-render mechanism.

- Firestore optimization
  Indexing the Firestore data to improve the data fetching duration.

- Data sanitization and decoupling from React's project

  Read more below.

## Firestore structure

![Screenshot 2024-04-20 at 10 58 18 PM](https://github.com/primaulia/dogegram-firebase/assets/1294303/1a1a1919-f8a8-4b0e-9623-46cf11caf1f3)

I'm keeping the structure of the firestorm simple with 2 collections that are all tied to the user authenticated to the app (1 User -> can save many breeds, 1 User -> can like many photos). The reasons for this decision are:

- Future-proofing the data structure should we need to query the `breeds` and `doggos` (photos) data further
- Allowing users to switch breeds and keeping the old photos that they've liked
- Minimize the amount of data read and transferred from the Firestore, this will significantly reduce the cost of the Firestore usage.

I also added the type of the breeds saved whether it's a `Sub-breed` or `Parent` breed, and the parent breed name if it's relevant. This will allow the system to correctly retrieve the photos according to the breed type (parent or sub-breed)

### Raw Data & Rules Screenshots
![Screenshot 2024-04-20 at 6 05 42 PM](https://github.com/primaulia/dogegram-firebase/assets/1294303/6d9689b7-6bed-4545-9dc8-2e0258b72c97)
![Screenshot 2024-04-20 at 6 05 48 PM](https://github.com/primaulia/dogegram-firebase/assets/1294303/e0babf23-b76c-4b40-b5a8-d880768bb257)
![Screenshot 2024-04-20 at 11 03 18 PM](https://github.com/primaulia/dogegram-firebase/assets/1294303/22ce530a-9dfc-4186-b569-a9e4ed12a2d5)

## Refactoring

> Provide a written explanation of how you would refactor the solution to include a Node.js Firebase function that connects to the dog.ceo https://dog.ceo/api/breeds/list/all API endpoint and fattens the data into a single array of strings.

### Known problem

- Breeds and Sub-breeds data from the [`Dog API`](https://dog.ceo/dog-api/documentation/) are stored at a multi-tier level. At the moment, we have to [manually sanitize the data](https://github.com/primaulia/dogegram-firebase/blob/5a4f5ad3e9ee5b477d467f017cef96ba2ad89b59/src/lib/data.ts#L68) on the fly on every request on the home page. The task needed was done in O(n)^2 operation as we need to go through sub-breeds data too.
- We are at the mercy of the API call, if it's down or it becomes unreliable, it will greatly affect the app.

### Proposed solution

- Decouple the API call and store the function into the Firebase function. I added a diagram below to help explain the flow.

![Screenshot 2024-04-20 at 11 20 52 PM](https://github.com/primaulia/dogegram-firebase/assets/1294303/ce1ac494-a3c8-4a0d-a8cc-8a7a1cdca0f8)

- By doing so, we can call the API once periodically. This is under the assumption that the data will not change much.
- We can also enable the Firestore cache and offline mechanism that will greatly improve the data fetching process. The cache should only be busted when the Firebase function is triggered.

## Unit test specs

Assuming that we're implementing the Firebase function. The main bulk of the test should be used to validate the data sanitization process. Some of the crucial process that needs to be tested are:
- Ensure that the data cleaned is flat with no duplication. It also must combine both the parent and sub-breed.
- Ensure that the breeds stored in the Firestore are tagged with the correct type.

On the react level, we also need to do e2e test to ensure that:
- Once the breeds is saved to the Firestore, the breeds are displayed
- Once the breeds are selected, the feed are displayed according to the chosen breeds
- Once the photos are liked, it's stored in the Firestore

  
- 
