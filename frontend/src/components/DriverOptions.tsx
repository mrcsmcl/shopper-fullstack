import React, { useState } from "react";
import { confirmRide } from "../api";
import Map from "./Map";

type DriverOptionsProps = {
  options: any[];
  route: string;
  origin: { lat: number; lng: number };
  destination: { lat: number; lng: number };
  customerId: string;
  originAddress: string;
  destinationAddress: string;
  duration: string; // Nova prop para duração
  distance: number; // Nova prop para distância
  onConfirm: () => void;
};

const DriverOptions: React.FC<DriverOptionsProps> = ({
  options,
  route,
  origin,
  destination,
  customerId,
  originAddress,
  destinationAddress,
  duration,
  distance,
  onConfirm,
}) => {
  const [showPopup, setShowPopup] = useState(false);
  const [popupMessage, setPopupMessage] = useState("");

  const handleConfirm = async (driver: any) => {
    try {
      await confirmRide({
        customer_id: customerId,
        origin: originAddress.toUpperCase(),
        destination: destinationAddress.toUpperCase(),
        distance: distance, // Usando a distância da API
        duration: duration, // Usando a duração da API
        driver: {
          id: driver.id,
          name: driver.name,
        },
        value: driver.value,
      });
      setPopupMessage("Viagem confirmada com sucesso!");
      setShowPopup(true);
    } catch (error) {
      setPopupMessage("Erro ao confirmar a viagem.");
      setShowPopup(true);
    }
  };

  const closePopup = () => {
    setShowPopup(false);
    onConfirm();
  };

  console.log("Polyline recebido:", route);
  console.log("Distância recebida:", distance);
  console.log("Duração recebida:", duration);
  console.log("Origem recebida:", origin);
  console.log("Destino recebido:", destination);

  return (
    <div>
      <Map origin={origin} destination={destination} route={route} />

      {/* Quadro com informações da viagem */}
      <div className="trip-info">
        <h2>Informações da Viagem</h2>
        <table className="driver-table">
          <tbody>
            <tr>
              <td><strong>Origem:</strong></td>
              <td>{originAddress.toUpperCase()}</td>
            </tr>
            <tr>
              <td><strong>Destino:</strong></td>
              <td>{destinationAddress.toUpperCase()}</td>
            </tr>
            <tr>
              <td><strong>Distância:</strong></td>
              <td>{(distance/1000).toFixed(2)} km</td>
            </tr>
            <tr>
              <td><strong>Duração:</strong></td>
              <td>{duration}</td>
            </tr>
          </tbody>
        </table>
      </div>

      {/* Tabela de motoristas */}
      <table className="driver-table">
        <thead>
          <tr>
            <th>Motorista</th>
            <th>Descrição</th>
            <th>Veículo</th>
            <th>Avaliação</th>
            <th>Valor</th>
            <th>Confirmar Viagem</th>
          </tr>
        </thead>
        <tbody>
          {options.map((driver) => (
            <tr key={driver.id}>
              <td>{driver.name}</td>
              <td>{driver.description}</td>
              <td>{driver.vehicle}</td>
                <td>{"★".repeat(driver.review.rating)}</td>
              <td>R${driver.value.toFixed(2)}</td>
              <td>
                <button onClick={() => handleConfirm(driver)}>Escolher</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      
      {/* Popup de confirmação */}
      {showPopup && (
        <div className="popup">
          <div className="popup-content">
            <h3>{popupMessage}</h3>
            <button onClick={closePopup}>OK</button>
          </div>
        </div>
      )}
      <div style={{ marginTop: '20px' }}></div>
      {/* Botão de cancelar */}
      <button onClick={onConfirm} className="cancel-button" style={{ display: 'block', margin: '0 auto', width: '100%' }}>
        Cancelar
      </button>

    </div>
  );
};

export default DriverOptions;
