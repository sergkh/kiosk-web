export type Faculty = {
  id: string,
  name: string,
  image: string
};

export type InfoCard = {
  id: string,
  title: string,
  subtitle?: string | null,
  image?: string | null,
  content?: string | null,
  
  // Category of the info, e.g. "students", "abiturients", "faculties"
  category: string,  
  
  // If set show the list of categories instead of content
  subcategory?: string | null,
  
  // Opitional link to an external resource for syncing the info
  resource?: string,
  position: number,
  published: boolean
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


