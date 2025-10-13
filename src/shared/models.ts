export type Article = {
  title: string,
  image?: string,
  content: string
};

export type Faculty = {
  id: string,
  name: string,
  image: string
};

export type FacultyInfo = {
  id: string;
  name: string;
  link: string;
  image: string;
  description: string;
};

export type StudentInfo = {
  id: string,
  title: string,
  subtitle: string,
  image: string,
  content: string  
}

export type AbiturientInfo = {
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

// Model for faculties page

export type ContactInfo = {
  location: string,    
  cabNo: string,    
  phone: string,       
  email: string
}

export type Leadership = {
  fullName: string,    
  position: string,    
  degree: string,      
  imageUrl?: string   
}

