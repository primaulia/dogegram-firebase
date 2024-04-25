# Doggogram

![Screenshot 2024-04-20 at 5 50 12 PM](https://github.com/primaulia/dogegram-firebase/assets/1294303/9bd0c6d6-246f-46b3-8e3e-0d0ac3a9abe7)

This project is a lovable dog photo app built with Next.js and data hosted on Firebase. Users can explore and favorite photos of various dog breeds.

## Changelogs

- [V1.1](https://github.com/primaulia/dogegram-firebase/releases/tag/v1.1)

## Key technologies

- Next.js (front-end framework)
- Firebase (backend with Firestore database)'

## Live Demo

View the deployed app at https://dogegram-ad8a9.web.app/

## Running locally

1. Clone the repository: `gh repo clone primaulia/dogegram-firebase`
2. Navigate to the project directory: `cd dogegram-firebase`
3. Install dependencies: `yarn install (or npm install)`
4. Start the development server: `yarn dev (or npm run dev)`
5. The app should run at `http://localhost:3000 (or a different port)`
 
### Additional Features

Beyond the core functionality, Doggogram boasts several user-friendly features:

- **Simple breeds management**: Undo breed selections to explore more dog photos.
  
  ![Apr-20-2024 23-59-39](https://github.com/primaulia/dogegram-firebase/assets/1294303/8f30c3e0-ff75-4bcc-b12f-45033caaa0e9)
  
- **Search breeds feature**: Easily find specific breeds using a keyword search  

  ![Apr-20-2024 23-56-51](https://github.com/primaulia/dogegram-firebase/assets/1294303/a927889c-5517-4d13-8481-90e05d27519c)

- **`My Favorite Doggos` Page**: Track and manage your favorited dog photos.
  
  ![Apr-21-2024 00-01-30](https://github.com/primaulia/dogegram-firebase/assets/1294303/f83d7b93-99c7-4895-acd6-58c55fb30252)

#### Future Enhancements:
- ~~`Surprise me` feature: Explore random dog breeds for unexpected discoveries~~
- Saved Breeds State Optimization: Reduce API calls by sharing the SavedBreeds state using React Context.
- Partial Pre-rendering: Improve performance by loading breeds and photo feeds incrementally using Next.js' built-in pre-rendering.
- Firestore Optimization: Enhance data fetching speed by indexing Firestore data.
- Enable SSR configuration on the Next.js site to allow the site to be accessible without Javascript.
- Data Sanitization & Decoupling: Detach data manipulation from the React app (details below).

## Firestore structure

The Firestore schema is designed for simplicity and future scalability. It uses mainly two extra collections on top of the authenticated users:
![Screenshot 2024-04-20 at 10 58 18 PM](https://github.com/primaulia/dogegram-firebase/assets/1294303/1a1a1919-f8a8-4b0e-9623-46cf11caf1f3)

This structure allows:
- Flexible querying of breeds and photos
- Efficient tracking of user breed's preference
- Reduced data transfer and Firestore usage costs.
- Breed data includes type information (Sub-breed or Parent) and the parent breed name (if applicable) for accurate photo retrieval.

### Raw Data & Rules Screenshots
![Screenshot 2024-04-20 at 6 05 42 PM](https://github.com/primaulia/dogegram-firebase/assets/1294303/6d9689b7-6bed-4545-9dc8-2e0258b72c97)
![Screenshot 2024-04-20 at 6 05 48 PM](https://github.com/primaulia/dogegram-firebase/assets/1294303/e0babf23-b76c-4b40-b5a8-d880768bb257)
![Screenshot 2024-04-20 at 11 03 18 PM](https://github.com/primaulia/dogegram-firebase/assets/1294303/22ce530a-9dfc-4186-b569-a9e4ed12a2d5)

## Refactoring with Node.js Firebase Function

> Provide a written explanation of how you would refactor the solution to include a Node.js Firebase function that connects to the dog.ceo https://dog.ceo/api/breeds/list/all API endpoint and fattens the data into a single array of strings.

### Known problem

**Problem:** Multi-tiered breed data requires manual on-the-fly data manipulation (O(n)^2 complexity), and relying on an external API introduces a single point of failure.

**Solution:**

![Screenshot 2024-04-20 at 11 20 52 PM](https://github.com/primaulia/dogegram-firebase/assets/1294303/ce1ac494-a3c8-4a0d-a8cc-8a7a1cdca0f8)

- Implement a Node.js Firebase function to periodically fetch and process the dog breed data from the API.
- This data can be:
  - Fetched once each period and stored in Firestore
  - Flattened into a single array with no duplicates
  - Combined with parent and sub-breed information (if applicable)
  - Tagged with breed type for accurate retrieval
  - Should we need to switch to a different API source, the fetching and data sanitization process can also be customized. 
  
**Benefits:**
- Reduced API calls and improved performance.
- Increased reliability by caching processed data in Firestore.
- Offline functionality (if Firestore cache is enabled).
- The stored data in our Firestore will be agnostic to the API source.

## Unit Testing Strategies

Assuming that we're implementing the Firebase function. The main bulk of the test should be used to validate the data sanitization process. Some of the crucial process that needs to be tested are:

- Ensure data sanitization flattens and combines breed data correctly.
- Verify breed types are tagged appropriately.

On the react level, we also need to do an e2e test to ensure that:
- Confirm breeds saved are displayed after saving in Firestore.
- Validate breed selection triggers correct feed display.
- Test successful storage and retrieval of liked photos.
