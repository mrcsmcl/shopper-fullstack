import { Router } from "express";
import { Client } from "@googlemaps/google-maps-services-js";
import type { Request, Response } from "express";
import Driver from "../models/Driver";
import Ride from "../models/Ride";
import { Op } from "sequelize";

const router = Router();
const googleMapsClient = new Client({});

router.post("/estimate", async (req: Request, res: Response): Promise<void> => {
  const { customer_id, origin, destination } = req.body;

  // Validações
  if (!customer_id || !origin || !destination) {
    res.status(400).json({
      error_code: "INVALID_DATA",
      error_description: "Customer ID, origin, and destination are required.",
    });
    return;
  }

  if (origin === destination) {
    res.status(400).json({
      error_code: "INVALID_DATA",
      error_description: "Origin and destination cannot be the same.",
    });
    return;
  }

  try {
    // Chamar a API do Google Maps para calcular rota
    const routeResponse = await googleMapsClient.directions({
      params: {
        origin,
        destination,
        key: process.env.GOOGLE_API_KEY || "",
      },
    });

    const route = routeResponse.data.routes[0];
    const distanceInMeters = route.legs[0].distance.value;
    const duration = route.legs[0].duration.text;

    // Converter distância para quilômetros
    const distanceInKm = distanceInMeters / 1000;

    // Buscar motoristas disponíveis
    const drivers = await Driver.findAll();
    const availableDrivers = drivers
      .filter((driver) => distanceInKm >= driver.min_distance)
      .map((driver) => ({
        id: driver.id,
        name: driver.name,
        description: driver.description,
        vehicle: driver.vehicle,
        review: {
          rating: driver.rating,
          comment: driver.comment,
        },
        value: Number((distanceInKm * driver.rate_per_km).toFixed(2)),
      }))
      .sort((a, b) => a.value - b.value); // Ordenar por preço

    // Responder com os dados
    res.status(200).json({
      origin: {
        latitude: route.legs[0].start_location.lat,
        longitude: route.legs[0].start_location.lng,
      },
      destination: {
        latitude: route.legs[0].end_location.lat,
        longitude: route.legs[0].end_location.lng,
      },
      distance: distanceInKm,
      duration,
      options: availableDrivers,
      routeResponse: routeResponse.data,
    });
  } catch (error) {
    console.error("Error calculating route:", error);
    res.status(500).json({
      error_code: "INTERNAL_ERROR",
      error_description: "Failed to calculate route.",
    });
  }
});

router.patch("/confirm", async (req: Request, res: Response): Promise<void> => {
  const { customer_id, origin, destination, distance, duration, driver, value } = req.body;

  // Validações
  if (!customer_id || !origin || !destination || !distance || !duration || !driver || !value) {
    res.status(400).json({
      error_code: "INVALID_DATA",
      error_description: "All fields are required.",
    });
    return;
  }

  if (origin === destination) {
    res.status(400).json({
      error_code: "INVALID_DATA",
      error_description: "Origin and destination cannot be the same.",
    });
    return;
  }

  try {
    // Buscar motorista
    const selectedDriver = await Driver.findByPk(driver.id);
    if (!selectedDriver) {
      res.status(404).json({
        error_code: "DRIVER_NOT_FOUND",
        error_description: "The specified driver does not exist.",
      });
      return;
    }

    // Verificar se a distância é válida para o motorista
    if (distance < selectedDriver.min_distance) {
      res.status(406).json({
        error_code: "INVALID_DISTANCE",
        error_description: `Distance must be at least ${selectedDriver.min_distance} km for this driver.`,
      });
      return;
    }

    // Salvar a viagem no banco de dados
    const newRide = await Ride.create({
      customer_id,
      origin,
      destination,
      distance,
      duration,
      driver_id: driver.id,
      value,
    });

    res.status(200).json({ success: true, ride_id: newRide.id });
  } catch (error) {
    console.error("Error confirming ride:", error);
    res.status(500).json({
      error_code: "INTERNAL_ERROR",
      error_description: "Failed to confirm ride.",
    });
  }
});


router.get("/:customer_id", async (req: Request, res: Response): Promise<void> => {
    const { customer_id } = req.params;
    const driver_id = req.query.driver_id as string | undefined; // Cast para string
  
    if (!customer_id) {
      res.status(400).json({
        error_code: "INVALID_DATA",
        error_description: "Customer ID is required.",
      });
      return;
    }
  
    try {
      // Verificar se o motorista é válido, caso informado
      if (driver_id) {
        const driverExists = await Driver.findByPk(driver_id);
        if (!driverExists) {
          res.status(400).json({
            error_code: "INVALID_DRIVER",
            error_description: "The specified driver does not exist.",
          });
          return;
        }
      }
  
      // Buscar viagens do cliente
      const rides = await Ride.findAll({
        where: {
          customer_id,
          ...(driver_id && { driver_id: parseInt(driver_id, 10) }), // Garantir que seja um número
        },
        include: [
          {
            model: Driver,
            as: "driver",
            attributes: ["id", "name"],
          },
        ],
        order: [["createdAt", "DESC"]],
      });
  
      if (rides.length === 0) {
        res.status(404).json({
          error_code: "NO_RIDES_FOUND",
          error_description: "No rides found for this customer.",
        });
        return;
      }
  
      res.status(200).json({
        customer_id,
        rides: rides.map((ride) => ({
          id: ride.id,
          date: ride.createdAt, // Usar a propriedade criada
          origin: ride.origin,
          destination: ride.destination,
          distance: ride.distance,
          duration: ride.duration,
          driver: ride.driver, // Incluir motorista associado
          value: ride.value,
        })),
      });
    } catch (error) {
      console.error("Error fetching rides:", error);
      res.status(500).json({
        error_code: "INTERNAL_ERROR",
        error_description: "Failed to fetch rides.",
      });
    }
  });
  

export default router;
