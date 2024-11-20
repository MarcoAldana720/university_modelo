import { Suspense } from "react";
import Loading from "./loading";
import ListGeneration from "../../components/client/ListGeneration";

// Forzar que la página se renderice dinámicamente en lugar de usar SSG
export const dynamic = 'force-dynamic';

function page() {
  return (
    <Suspense fallback={<Loading />}>
      <ListGeneration />
    </Suspense>
  )
}

export default page
