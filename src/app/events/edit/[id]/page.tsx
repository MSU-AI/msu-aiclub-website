import { getEventById } from "~/server/db/queries/events";
import ClientEditEventPage from "./clientPage";


export default async function EditEventPage({
  params
} : {
  params: { id: string }
}) {
  const event = await getEventById(params.id);

  return <ClientEditEventPage event={event} params={params} />;
}
