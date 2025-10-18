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

function newStudInfoLoader() {
  return Object.assign(defaultInfo, { category: "students" }) as InfoCard;
}

function newAbiturientInfoLoader() {
  return Object.assign(defaultInfo, { category: "abiturients" }) as InfoCard;
}

async function studInfoLoader({ params }: LoaderFunctionArgs) {
  const res = await fetch(`/api/info/students/${params.id}`)

  if (!res.ok) {
    throw new Error(`Помилка завантаження картки: ${res.status}`);
  }

  return await res.json();
}

async function abiturientInfoLoader({ params }: LoaderFunctionArgs) {
  try {
  const res = await fetch(`/api/info/abiturients/${params.id}?all=true`);
  
  if (!res.ok) {
    throw new Error(`Помилка завантаження картки: ${res.status}`);
  }

  return await res.json();
  } catch (e) {
    console.log("Error", e);
    return defaultInfo;
  }
}

export {
  studInfoLoader, abiturientInfoLoader,
  newStudInfoLoader, newAbiturientInfoLoader
}