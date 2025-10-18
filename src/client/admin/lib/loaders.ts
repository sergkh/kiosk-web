import type { LoaderFunctionArgs } from "react-router";
import type { InfoCard } from "../../../shared/models";

const defaultInfo = {
  id: "",
  title: "",
  subtitle: "",
  content: "",
  category: "",
  image: "",

} as InfoCard

function newInfoLoader() {
  return defaultInfo;
}


async function infoEntryLoader({ params }: LoaderFunctionArgs) {
  const res = await fetch(`/api/info/${params.category}/${params.id}`)

  if (!res.ok) {
    throw new Error(`Помилка завантаження картки: ${res.status}`);
  }

  return await res.json();
}

async function infoListLoader({ params }: LoaderFunctionArgs) {
  const res = await fetch(`/api/info/${params.category}?all=true`);
  
  if (!res.ok) {
    throw new Error(`Помилка завантаження картки: ${res.status}`);
  }

  return await res.json();
}

export {
  newInfoLoader, infoEntryLoader, infoListLoader
}