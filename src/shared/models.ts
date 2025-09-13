export type Article = {
  title: string,
  image: string,
  content: string,
  date: string
};

export type Faculty = {
  id: string,
  name: string,
  image: string
};

export type StudentInfo = {
  id: string,
  title: string,
  subtitle: string,
  image: string,
  content: string  
}

export type MkrApiDictionary = {
  id: string;
  name: string;
}

export type MkrGroup = {
  id: string;
  name: string;
  course: number;
}

export type LessonTime = {
  time: string;
  end: string;
  name: string;
}

export type MkrEvent = {
  name: string,
  place: string,
  group?: string,
  teacher?: string,
  type: string,
  start: string,
  end: string
}