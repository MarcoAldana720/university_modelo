import { Suspense } from "react";
import Loading from "./loading";
import ListData from "../../components/client/ListData";

// Forzar que la página se renderice dinámicamente en lugar de usar SSG
export const dynamic = 'force-dynamic';

function page() {
  return (
    <Suspense fallback={<Loading />}>
      <ListData />
    </Suspense>
  )
}

export default page
