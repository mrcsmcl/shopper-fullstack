import React, { useState } from "react";
import { getRideHistory } from "../api"; // Importa a API para obter o histórico de viagens

const TripHistory: React.FC = () => {
  const [customerId, setCustomerId] = useState(""); // Estado para o ID do cliente
  const [driverId, setDriverId] = useState("all"); // Estado para o motorista selecionado
  const [rides, setRides] = useState<any[]>([]); // Estado para as viagens realizadas
  const [errorMessage, setErrorMessage] = useState(""); // Estado para mensagens de erro

  // Opções de motoristas (mock, substitua pela API se necessário)
  const driverOptions = [
    { id: "all", name: "Todos os Motoristas" },
    { id: "1", name: "Homer Simpson" },
    { id: "2", name: "Dominic Toretto" },
    { id: "3", name: "James Bond" },
  ];

  const handleSearch = async () => {
    if (customerId.trim() === "") {
      setErrorMessage("O ID do cliente não pode estar vazio.");
      return;
    }

    setErrorMessage(""); // Limpa mensagens de erro

    try {
      const response = await getRideHistory(customerId, driverId !== "all" ? Number(driverId) : undefined);
      setRides(response.data.rides);
    } catch (error) {
      setErrorMessage("Erro ao buscar o histórico de viagens.");
    }
  };

  return (
    <div>
      <h2>Histórico de Viagens</h2>

      <div>
        {/* Campo para informar o ID do usuário */}
        <input
          type="text"
          placeholder="ID do Cliente"
          value={customerId}
          onChange={(e) => setCustomerId(e.target.value)}
        />

        {/* Seletor de motoristas */}
        <select value={driverId} onChange={(e) => setDriverId(e.target.value)}>
          {driverOptions.map((driver) => (
            <option key={driver.id} value={driver.id}>
              {driver.name}
            </option>
          ))}
        </select>

        {/* Botão para aplicar o filtro */}
        <button onClick={handleSearch}>Aplicar Filtro</button>
      </div>

      {/* Mensagem de erro */}
      {errorMessage && <p style={{ color: "red" }}>{errorMessage}</p>}

      {/* Lista de viagens */}
      {rides.length > 0 ? (
        <table className="history-table">
          <thead>
            <tr>
              <th>Data</th>
              <th>Motorista</th>
              <th>Origem</th>
              <th>Destino</th>
              <th>Distância (km)</th>
              <th>Duração</th>
              <th>Valor (R$)</th>
            </tr>
          </thead>
          <tbody>
            {rides.map((ride) => (
              <tr key={ride.id}>
                <td>{new Date(ride.date).toLocaleString()}</td>
                <td>{ride.driver.name}</td>
                <td>{ride.origin}</td>
                <td>{ride.destination}</td>
                <td>{(ride.distance / 1000).toFixed(2)}</td>
                <td>{ride.duration}</td>
                <td>{ride.value.toFixed(2)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      ) : (
        <p>Nenhuma viagem encontrada.</p>
      )}
    </div>
  );
};

export default TripHistory;
