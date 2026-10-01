import { AppDataSource } from "../config/data-source.js";
import { checkAvailability } from "../services/availability/availability.service.js";
import * as bookingService from "../services/booking.service.js";

export const check = async (req, res) =>
  res.json({ success: true, data: await checkAvailability(AppDataSource.manager, req.body) });

export const create = async (req, res) =>
  res.status(201).json({ success: true, data: await bookingService.createBooking(req.user, req.body) });

export const list = async (req, res) =>
  res.json({ success: true, data: await bookingService.listBookings(req.user, req.query) });

export const get = async (req, res) =>
  res.json({ success: true, data: await bookingService.getBooking(req.user, req.params.id) });