import { AppDataSource } from "../config/data-source.js";
import { AppError } from "../utils/AppError.js";

const repo = () => AppDataSource.getRepository("Equipment");

export async function listEquipment({ search, category, labId, maintenanceStatus }) {
  const qb = repo()
    .createQueryBuilder("eq")
    .leftJoinAndSelect("eq.lab", "lab");

  if (search) qb.andWhere("eq.name ILIKE :search", { search: `%${search}%` });
  if (category) qb.andWhere("eq.category ILIKE :category", { category });
  if (labId) qb.andWhere("lab.id = :labId", { labId });
  if (maintenanceStatus) qb.andWhere("eq.maintenanceStatus = :maintenanceStatus", { maintenanceStatus });

  return qb.orderBy("eq.name", "ASC").getMany();
}

export async function getEquipment(id) {
  const item = await repo().findOne({ where: { id }, relations: { lab: true } });
  if (!item) throw new AppError(404, "NOT_FOUND", "Equipment not found");
  return item;
}

export async function createEquipment(data) {
  const { labId, ...rest } = data;
  const item = repo().create({
    ...rest,
    availableQuantity: rest.availableQuantity ?? rest.totalQuantity,
    ...(labId && { lab: { id: labId } }),
  });
  return repo().save(item);
}

export async function updateEquipment(id, data) {
  const item = await getEquipment(id);
  const { labId, ...rest } = data;
  Object.assign(item, rest);
  if (labId) item.lab = { id: labId };

  if (item.availableQuantity > item.totalQuantity) {
    throw new AppError(400, "VALIDATION_ERROR", "availableQuantity cannot exceed totalQuantity");
  }
  return repo().save(item);
}