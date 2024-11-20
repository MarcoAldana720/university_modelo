import { Suspense } from "react";
import Loading from "./loading";
import ListLine from "../../components/client/ListLine";

// Forzar que la página se renderice dinámicamente en lugar de usar SSG
export const dynamic = 'force-dynamic';

function page() {
  return (
    <Suspense fallback={<Loading />}>
      <ListLine />
    </Suspense>
  )
}

export default page
