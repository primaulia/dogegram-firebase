import getData from "@/firebase/firestore/getData";

export default async function Page() {
  const { results, error } = await getData();

  const restaurants = results?.docs?.map((doc) => {
    return {
      id: doc.id,
      ...doc.data(),
      // Only plain objects can be passed to Client Components from Server Components
      timestamp: doc.data().timestamp.toDate(),
    };
  });

  return (
    <>
      <h1>Hello world</h1>
      <ul>
        {restaurants?.map((resto) => {
          return <li key={resto.id}>{resto.id}</li>;
        })}
      </ul>
    </>
  );
}
