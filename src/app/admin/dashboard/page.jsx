import UseCards from "../../components/UseCards";
import { Suspense } from "react";
import Loading from "./loading";

// Forzar que la página se renderice dinámicamente en lugar de usar SSG
export const dynamic = 'force-dynamic';

function page() {
  return (
    <Suspense fallback={<Loading />}>
      <UseCards />
    </Suspense>
  );
}

export default page;