import InfoManagementTable from '../components/InfoManagementTable';

function StudentsPage() {
  return (
    <div>
      <h2>Картки студентів</h2>      
      <InfoManagementTable 
          adminUrlPrefix="/admin/students"
          apiUrl="/api/student-info" 
      />
    </div>
  )
}

export default StudentsPage;