import { Suspense } from "react";
import Loading from "./loading";
import ListGenerarion from "../../components/client/ListGenerarion";

// Forzar que la página se renderice dinámicamente en lugar de usar SSG
export const dynamic = 'force-dynamic';

function page() {
  return (
    <Suspense fallback={<Loading />}>
      <ListGenerarion />
    </Suspense>
  )
}

export default page
