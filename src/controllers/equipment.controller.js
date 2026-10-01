import * as service from "../services/equipment.service.js";

export const listEquipment = async (req, res) =>
  res.json({ success: true, data: await service.listEquipment(req.query) });

export const getEquipment = async (req, res) =>
  res.json({ success: true, data: await service.getEquipment(req.params.id) });

export const createEquipment = async (req, res) =>
  res.status(201).json({ success: true, data: await service.createEquipment(req.body) });

export const updateEquipment = async (req, res) =>
  res.json({ success: true, data: await service.updateEquipment(req.params.id, req.body) });