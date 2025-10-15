import React, { useState, useEffect } from "react";
import FacultiesList from "../components/FacultiesList";
import type { FacultyInfo } from "../../shared/models";

type FacultyInfoResponse = {
    title: string;
    description: string;
    image?: string; 
};

type FacultiesModalProps = {
    isOpen: boolean;
    onClose: () => void;
    faculties: FacultyInfo[];
};

function FacultiesModal({ isOpen, onClose, faculties }: FacultiesModalProps) {
    const [facultyInfo, setFacultyInfo] = useState<FacultyInfoResponse | null>(null); 
    const [selectedFaculty, setSelectedFaculty] = useState<FacultyInfo | null>(null);

    const handleFacultySelect = async (faculty: FacultyInfo) => {
        setSelectedFaculty(faculty);
        if (faculty.link) {
            try {
                const res = await fetch(`/api/faculties/info?link=${encodeURIComponent(faculty.link)}`);
                const data: FacultyInfoResponse = await res.json();
                setFacultyInfo(data);
            } catch {
                setFacultyInfo({ 
                    title: "Помилка", 
                    description: "Не вдалося отримати інформацію",
                    image: undefined 
                });
            }
        } else {
            setFacultyInfo(null);
        }
    };

    if (!isOpen) return null;

    return (
        <div className="faculties-modal-overlay" onClick={onClose}>
            <div className="faculties-modal" onClick={e => e.stopPropagation()}>
                <FacultiesList
                    faculties={faculties}
                    active={selectedFaculty}
                    onSelect={handleFacultySelect}
                />
                {facultyInfo && (
  <div className="faculty-info prose max-w-none">
      {facultyInfo.image && (
          <img
            src={facultyInfo.image}
            alt={facultyInfo.title}
            className="faculty-main-image mb-4 rounded-2xl shadow"
          />
      )}
      <h2 className="text-2xl font-bold mb-3">{facultyInfo.title}</h2>
      
      <div
        className="faculty-description"
        dangerouslySetInnerHTML={{ __html: facultyInfo.description }}
      />
  </div>
)}

            </div>
        </div>
    );
}

export default FacultiesModal;