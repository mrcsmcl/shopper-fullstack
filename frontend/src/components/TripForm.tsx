import React, { useState } from "react";
import { estimateRide } from "../api";

type TripFormProps = {
  onEstimate: (response: any, origin: string, destination: string) => void;
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
      onEstimate(response.data, origin, destination);
    } catch (error) {
      alert("Erro ao estimar viagem.");
    }
  };

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement>,
    setter: React.Dispatch<React.SetStateAction<string>>
  ) => {
    const value = e.target.value;
    if (/^[a-zA-Z0-9\s]*$/.test(value)) {
      setter(value);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      {/* Campo para inserir o ID do cliente */}
      <input
        type="text"
        placeholder="Qual é o seu ID de usuário? (ex: abc123)"
        value={customerId}
        onChange={(e) => handleInputChange(e, setLocalCustomerId)}
        required
      />
      {/* Campo para inserir o endereço de origem */}
      <input
        type="text"
        placeholder="De onde você vai sair? (ex: Avenida Paulista ou São Paulo)"
        value={origin}
        onChange={(e) => handleInputChange(e, setOrigin)}
        required
      />
      {/* Campo para inserir o endereço de destino */}
      <input
        type="text"
        placeholder="Para onde você vai? (ex: Rua Augusta ou Curitiba)"
        value={destination}
        onChange={(e) => handleInputChange(e, setDestination)}
        required
      />
      {/* Botão para submeter o formulário */}
      <button type="submit">Buscar</button>
    </form>
  );
};

export default TripForm;
