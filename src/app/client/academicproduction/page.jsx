import { Suspense } from "react";
import Loading from "./loading";
import ListProduction from "../../components/client/ListProduction";

// Forzar que la página se renderice dinámicamente en lugar de usar SSG
export const dynamic = 'force-dynamic';

function page() {
  return (
    <Suspense fallback={<Loading />}>
      <ListProduction />
    </Suspense>
  )
}

export default page
