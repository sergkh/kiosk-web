interface Delegate {
  id: number;
  name: string;
  votes: number;
  votesText: string;
}

interface DelegateTableProps {
  title: string;
  data: Delegate[];
}

function DelegateTable({ title, data }: DelegateTableProps) {
  return (
    <div className="delegate-table-container">
      <h2 className="table-title">{title}</h2>
      <div className="table-wrapper">
        <table className="delegate-table">
          <thead>
            <tr>
              <th>№ з/п</th>
              <th>Прізвище ім'я, по батькові представників</th>
              <th>Кількість голосів (Цифрами)</th>
              <th>Кількість голосів (Прописом)</th>
            </tr>
          </thead>
          <tbody>
            {data.map((delegate) => (
              <tr key={delegate.id}>
                <td>{delegate.id}</td>
                <td>{delegate.name}</td>
                <td>{delegate.votes}</td>
                <td>{delegate.votesText}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default DelegateTable;