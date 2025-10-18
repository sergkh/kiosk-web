import InfoManagementTable from "../components/InfoManagementTable";

function AbiturientsPage() {  
  return (
    <div>
      <h2>Картки абітурієнтів</h2>
      <InfoManagementTable 
          adminUrlPrefix="/admin/abiturients"
          apiUrl="/api/info/abiturients" 
      />
    </div>
  )
}

export default AbiturientsPage;