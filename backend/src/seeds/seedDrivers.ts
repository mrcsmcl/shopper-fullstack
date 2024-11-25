import Driver from "../models/Driver";

const seedDrivers = async () => {
  const drivers = [
    {
      name: "Homer Simpson",
      description:
        "Olá! Sou o Homer, seu motorista camarada! Relaxe e aproveite o passeio.",
      vehicle: "Plymouth Valiant 1973 rosa e enferrujado",
      rating: 2,
      comment: "Motorista simpático, mas errou o caminho 3 vezes.",
      rate_per_km: 2.5,
      min_distance: 1,
    },
    {
      name: "Dominic Toretto",
      description: "Ei, aqui é o Dom. Pode entrar, vou te levar com segurança.",
      vehicle: "Dodge Charger R/T 1970 modificado",
      rating: 4,
      comment: "Que viagem incrível! O carro é um show à parte.",
      rate_per_km: 5,
      min_distance: 5,
    },
    {
      name: "James Bond",
      description: "Boa noite, sou James Bond. À seu dispor para um passeio suave.",
      vehicle: "Aston Martin DB5 clássico",
      rating: 5,
      comment: "Serviço impecável! Uma experiência digna de um agente secreto.",
      rate_per_km: 10,
      min_distance: 10,
    },
  ];

  await Driver.bulkCreate(drivers);
  console.log("Drivers seeded successfully.");
};

export default seedDrivers;
