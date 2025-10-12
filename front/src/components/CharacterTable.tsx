import { useState, useMemo } from 'react'; 

const CharacterTable = ({ data, onCharacterSelect }: { data: any[], onCharacterSelect: (char: any) => void }) => {
  const [searchTerm, setSearchTerm] = useState('');

  const filteredData = useMemo(() => {
    if (!searchTerm) return data.slice(0, 50);
    return data.filter(item => 
      item.Name.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [data, searchTerm]);

  return (
    <div className="card" style={{ marginTop: '1.5rem' }}>
      <h3 className="cardTitle">Explorador de Personagens</h3>
      <input 
        type="text"
        placeholder="Pesquisar por nome..." 
        className="searchInput"
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
      />
      <div className="tableContainer">
        <table className="table">
          <thead>
            <tr>
              <th>Nome</th>
              <th>Editora</th>
              <th>Alinhamento</th>
              <th>Poder Total</th>
            </tr>
          </thead>
          <tbody>
            {/* A correção está na linha abaixo */}
            {filteredData.map((item, index) => (
              <tr key={`${item.Name}-${index}`} onClick={() => onCharacterSelect(item)}>
                <td>{item.Name}</td>
                <td>{item.Publisher}</td>
                <td>{item.Alignment}</td>
                <td>{item.TotalPower}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default CharacterTable;