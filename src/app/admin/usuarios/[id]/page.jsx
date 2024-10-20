import InfoUser from "../../../components/InfoUser";

function page({  searchParams, params }) {
  const userId = params.id;

  return (
    <InfoUser userId={userId} searchParams={searchParams} />
  );
}

export default page;