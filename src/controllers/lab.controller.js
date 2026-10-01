import * as labService from "../services/lab.service.js";

export const listLabs = async (req, res) =>
  res.json({ success: true, data: await labService.listLabs(req.query) });

export const getLab = async (req, res) =>
  res.json({ success: true, data: await labService.getLab(req.params.id) });

export const createLab = async (req, res) =>
  res.status(201).json({ success: true, data: await labService.createLab(req.body) });

export const updateLab = async (req, res) =>
  res.json({ success: true, data: await labService.updateLab(req.params.id, req.body) });