import React, { useState } from "react";
import { useJsApiLoader } from "@react-google-maps/api";
import TripForm from "./components/TripForm";
import DriverOptions from "./components/DriverOptions";
import TripHistory from "./components/TripHistory";
import "./styles.css";

const App: React.FC = () => {
  const [step, setStep] = useState(1);
  const [estimateData, setEstimateData] = useState<any>(null);
  const [customerId, setCustomerId] = useState<string>("");
  const [originAddress, setOriginAddress] = useState<string>("");
  const [destinationAddress, setDestinationAddress] = useState<string>("");
  const [duration, setDuration] = useState<string>("");
  const [distance, setDistance] = useState<number>(0);

  const { isLoaded } = useJsApiLoader({
    googleMapsApiKey: process.env.REACT_APP_GOOGLE_MAPS_API_KEY!,
    libraries: ["geometry"],
  });

  if (!isLoaded) return <div>Carregando mapa...</div>;

  const handleEstimate = (data: any, origin: string, destination: string) => {
    setEstimateData(data);
    setOriginAddress(origin);
    setDestinationAddress(destination);
    setDuration(data.duration);
    setDistance(data.distance);
    setStep(2);
  };

  const handleConfirm = () => {
    setStep(1);
    setEstimateData(null);
  };

  const handleShowHistory = () => {
    setStep(3);
  };

  return (
    <div className="container">
      <h1>Shopper Fullstack - Frontend</h1>
      {step === 1 && (
        <div>
          <TripForm
            onEstimate={handleEstimate}
            setCustomerId={setCustomerId}
          />
          <button className="history-btn" onClick={handleShowHistory}>
            Histórico de Viagens
          </button>
        </div>
      )}
      {step === 2 && estimateData && (
        <DriverOptions
          options={estimateData.options}
          route={estimateData.routeResponse.routes[0].overview_polyline.points}
          origin={estimateData.origin}
          destination={estimateData.destination}
          customerId={customerId}
          originAddress={originAddress}
          destinationAddress={destinationAddress}
          duration={duration} // Passando a duração
          distance={distance} // Passando a distância
          onConfirm={handleConfirm}
        />
      )}
      {step === 3 && (
        <div className="history-container">
          <TripHistory />
          <button className="back-btn" onClick={() => setStep(1)}>
            Voltar
          </button>
        </div>
      )}
    </div>
  );
};

export default App;
