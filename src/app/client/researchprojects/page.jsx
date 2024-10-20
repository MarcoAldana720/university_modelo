import { Suspense } from "react";
import Loading from "./loading";
import ListProjects from "../../components/client/ListProjects";

// Forzar que la página se renderice dinámicamente en lugar de usar SSG
export const dynamic = 'force-dynamic';

function page() {
  return (
    <Suspense fallback={<Loading />}>
      <ListProjects />
    </Suspense>
  )
}

export default page
