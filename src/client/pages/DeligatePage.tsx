import './DeligatePage.css';
import DelegateTable from '../components/DelegatesTable';
import { VnauStateDelegates, LadizhinStateDelegates, MohylivStateDelegates, NemyrivStateDeligates, ChernyatynStateDeligates, TechnologicalStateDeligates, TechnologicalStudentsDeligates, VnauStudentsDeligates, LadyzhynStudentsDeligates, MohylivStudentsDeligates, NemyrivStudentsDeligates, ChernyatynStudentsDeligates } from '../../../data/delegates_data.ts';

function DeligatePage() {
  return (
    <main className="devigate-page">
      <h1>Список делегатів</h1>
      
      <DelegateTable 
        title="Список делегатів з числа штатних працівників, які не є науковими, науково-педагогічними та педагогічними працівниками"
        data={VnauStateDelegates}
      />
      <DelegateTable 
        title="Представники з числа штатних працівників ВСП «Ладижинський фаховий коледж ВНАУ», які не є науковими, науково-педагогічними та педагогічними працівниками для участі у виборах ректора Вінницького національного аграрного університету"
        data={LadizhinStateDelegates}
      />
      <DelegateTable 
        title="Представники з числа штатних працівників ВСП «Могилів-Подільський технолого-економічний фаховий коледж ВНАУ», які не є науковими, науково-педагогічними та педагогічними працівниками для участі у виборах ректора Вінницького національного аграрного університету"
        data={MohylivStateDelegates}
      />
      <DelegateTable 
        title="Представники з числа штатних працівників ВСП «Немирівський фаховий коледж будівництва, економіки та дизайну ВНАУ», які не є науковими, науково-педагогічними та педагогічними працівниками для участі у виборах ректора Вінницького національного аграрного університету"
        data={NemyrivStateDeligates}
      />
      <DelegateTable 
        title="Представники з числа штатних працівників ВСП «Чернятинський фаховий коледж ВНАУ», які не є науковими, науково-педагогічними та педагогічними працівниками для участі у виборах ректора Вінницького національного аграрного університету"
        data={ChernyatynStateDeligates}
      />
      <DelegateTable 
        title="Представники з числа штатних працівників ВСП «Технологічно-промисловий фаховий коледж ВНАУ», які не є науковими, науково-педагогічними та педагогічними працівниками для участі у виборах ректора Вінницького національного аграрного університету"
        data={TechnologicalStateDeligates}
      />
      <DelegateTable 
        title="Представники з числа студентів ВСП «Технологічно-промисловий фаховий коледж ВНАУ»"
        data={TechnologicalStudentsDeligates}
      />
      <DelegateTable 
        title="Представники з числа студентів Вінницького національного аграрного університету"
        data={VnauStudentsDeligates}
      />
      <DelegateTable 
        title="Представники з числа студентів ВСП «Ладижинський фаховий коледж ВНАУ»"
        data={LadyzhynStudentsDeligates}
      />
      <DelegateTable 
        title="Представники з числа студентів ВСП «Могилів-Подільський технолого-економічний фаховий коледж ВНАУ»"
        data={MohylivStudentsDeligates}
      />
      <DelegateTable 
        title="Представники з числа студентів ВСП «Немирівський фаховий коледж будівництва, економіки та дизайну ВНАУ»"
        data={NemyrivStudentsDeligates}
      />
      <DelegateTable 
        title="Представники з числа студентів ВСП «Чернятинський фаховий коледж ВНАУ»"
        data={ChernyatynStudentsDeligates}
      />
    </main>
  );
}

export default DeligatePage;