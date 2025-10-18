import InfoManagementTable from '../components/InfoManagementTable';

function StudentsPage() {
  return (
    <div>
      <h2>Картки студентів</h2>      
      <InfoManagementTable 
          adminUrlPrefix="/admin/students"
          apiUrl="/api/info/students" 
      />
    </div>
  )
}

export default StudentsPage;