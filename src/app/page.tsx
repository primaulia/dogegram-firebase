import getData from "@/firebase/firestore/getData";
import SideNav from "@/app/components/sidenav";

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
    <main className="flex h-screen flex-col md:flex-row md:overflow-hidden">
      <div className="w-full flex-none md:w-64">
        <SideNav />
      </div>
      <div className="flex-grow p-6 md:overflow-y-auto md:p-12">Right side</div>
    </main>
  );
}
