import { Suspense } from "react";
import Loading from "./loading";
import ListStudies from '../../components/client/ListStudies';

// Forzar que la página se renderice dinámicamente en lugar de usar SSG
export const dynamic = 'force-dynamic';

function page() {
  return (
    <Suspense fallback={<Loading />}>
      <ListStudies />
    </Suspense>
  )
}

export default page
