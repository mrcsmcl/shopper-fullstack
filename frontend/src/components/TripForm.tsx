import React, { useState } from "react";
import { estimateRide } from "../api";

type TripFormProps = {
  onEstimate: (response: any, origin: string, destination: string) => void; // Inclui origem e destino
  setCustomerId: (id: string) => void;
};

const TripForm: React.FC<TripFormProps> = ({ onEstimate, setCustomerId }) => {
  const [customerId, setLocalCustomerId] = useState("");
  const [origin, setOrigin] = useState("");
  const [destination, setDestination] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setCustomerId(customerId);
    try {
      const response = await estimateRide({ customer_id: customerId, origin, destination });
      onEstimate(response.data, origin, destination); // A API já retorna duration e distance
    } catch (error) {
      alert("Erro ao estimar viagem.");
    }
  };
  

  return (
    <form onSubmit={handleSubmit}>
      <input
        type="text"
        placeholder="ID do Cliente"
        value={customerId}
        onChange={(e) => setLocalCustomerId(e.target.value)}
        required
      />
      <input
        type="text"
        placeholder="Origem"
        value={origin}
        onChange={(e) => setOrigin(e.target.value)}
        required
      />
      <input
        type="text"
        placeholder="Destino"
        value={destination}
        onChange={(e) => setDestination(e.target.value)}
        required
      />
      <button type="submit">Buscar</button>
    </form>
  );
};

export default TripForm;
