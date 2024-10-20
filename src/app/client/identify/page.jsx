// import ListUsers from '../../components/client/ListUsers';
import ListUsers from '../../components/client/ListStudies';
import { Suspense } from "react";
import Loading from "./loading";
import ListVertical from '../../components/client/ListVertical';

// Forzar que la página se renderice dinámicamente en lugar de usar SSG
export const dynamic = 'force-dynamic';

function page() {
  return (
    <Suspense fallback={<Loading />}>
      {/* <ListUsers /> */}
      <ListVertical />
    </Suspense>
  )
}

export default page
