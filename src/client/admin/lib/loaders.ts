import type { LoaderFunctionArgs } from "react-router";
import type { AbiturientInfo, StudentInfo } from "../../../shared/models";

const defaultInfo = {
  id: "",
  title: "",
  subtitle: "",
  content: "",
  image: ""
}

function newStudInfoLoader() {
  return Object.assign({}, defaultInfo) as StudentInfo;
}

function newAbiturientInfoLoader() {
  return Object.assign({}, defaultInfo) as AbiturientInfo;
}

async function studInfoLoader({ params }: LoaderFunctionArgs) {
  console.log('fetching stud info');
  const res = await fetch(`/api/student-info/${params.id}`)

  if (!res.ok) {
    throw new Error(`Помилка завантаження картки: ${res.status}`);
  }

  return await res.json();
}

async function abiturientInfoLoader({ params }: LoaderFunctionArgs) {
  console.log('fetching stud info');
  try {
  const res = await fetch(`/api/abiturient-info/${params.id}`)
  
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