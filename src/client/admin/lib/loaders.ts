import type { LoaderFunctionArgs } from "react-router";
import type { InfoCard, Video } from "../../../shared/models";
import config from "../../lib/config";

const defaultInfo = {
  id: "",
  title: "",
  subtitle: "",
  content: "",
  category: "",
  position: 0,
  image: "",
} as InfoCard

const defaultVideo = {
  id: "",
  title: "",
  category: "",
  description: "",
  position: 0,
  published: false
} as Video

function newInfoLoader() {
  return defaultInfo;
}

function newVideoLoader() {
  return defaultVideo;
}

function videosLoader({ params }: LoaderFunctionArgs) {
  return loadVideos();
}

async function infoEntryLoader({ params }: LoaderFunctionArgs) {
  const res = await fetch(`${config.baseUrl}api/info/${params.category}/${params.id}`)

  if (!res.ok) {
    throw new Error(`Помилка завантаження картки: ${res.status}`);
  }

  return await res.json();
}

async function infoListLoader({ params }: LoaderFunctionArgs) {
  const res = await fetch(`${config.baseUrl}api/info/${params.category}?all=true`);
  
  if (!res.ok) {
    throw new Error(`Помилка завантаження картки: ${res.status}`);
  }

  return await res.json();
}

async function categoriesLoader() {
  const res = await fetch(`${config.baseUrl}api/info`);

  if (!res.ok) {
    throw new Error(`Помилка завантаження категорій: ${res.status}`);
  }

  return await res.json() as string[];
}

async function loadVideos(): Promise<Video[]> {
  const res = await fetch(`${config.baseUrl}api/videos?all=true`);
  if (!res.ok) {
    throw new Error(`Помилка завантаження відео: ${res.status}`);
  }
  return await res.json() as Video[];
}

async function videoEntryLoader({ params }: LoaderFunctionArgs) {
  const res = await fetch(`${config.baseUrl}api/videos/${params.id}`);
  if (!res.ok) {
    throw new Error(`Помилка завантаження відео: ${res.status}`);
  }
  return await res.json() as Video;
}

async function videoCategoriesLoader() {
  const res = await fetch(`${config.baseUrl}api/videos/categories`);

  if (!res.ok) {
    throw new Error(`Помилка завантаження категорій відео: ${res.status}`);
  }

  return await res.json() as string[];
}

export {
  newInfoLoader, infoEntryLoader, infoListLoader, categoriesLoader, videosLoader, newVideoLoader, videoEntryLoader, videoCategoriesLoader
}