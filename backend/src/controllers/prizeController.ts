import { Request, Response } from 'express';
import { Prize } from '../models/Prize';

// Obtener todos los premios
export const getPrizes = async (req: Request, res: Response) => {
  try {
    const prizes = await Prize.find().sort({ createdAt: -1 });
    res.json(prizes);
  } catch (error) {
    res.status(500).json({ message: 'Error al obtener los premios', error });
  }
};

// Obtener un premio por ID
export const getPrizeById = async (req: Request, res: Response) => {
  try {
    const prize = await Prize.findById(req.params.id);
    if (!prize) {
      return res.status(404).json({ message: 'Premio no encontrado' });
    }
    res.json(prize);
  } catch (error) {
    res.status(500).json({ message: 'Error al obtener el premio', error });
  }
};

// Crear un nuevo premio
export const createPrize = async (req: Request, res: Response) => {
  try {
    const { nombre } = req.body;
    const prize = new Prize({
      nombre
    });
    const savedPrize = await prize.save();
    res.status(201).json(savedPrize);
  } catch (error) {
    res.status(500).json({ message: 'Error al crear el premio', error });
  }
};

// Actualizar un premio
export const updatePrize = async (req: Request, res: Response) => {
  try {
    const { nombre } = req.body;
    const prize = await Prize.findByIdAndUpdate(
      req.params.id,
      { nombre },
      { new: true }
    );
    if (!prize) {
      return res.status(404).json({ message: 'Premio no encontrado' });
    }
    res.json(prize);
  } catch (error) {
    res.status(500).json({ message: 'Error al actualizar el premio', error });
  }
};

// Eliminar un premio
export const deletePrize = async (req: Request, res: Response) => {
  try {
    const prize = await Prize.findByIdAndDelete(req.params.id);
    if (!prize) {
      return res.status(404).json({ message: 'Premio no encontrado' });
    }
    res.json({ message: 'Premio eliminado correctamente' });
  } catch (error) {
    res.status(500).json({ message: 'Error al eliminar el premio', error });
  }
}; 