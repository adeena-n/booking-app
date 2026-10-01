import { AppDataSource } from "../config/data-source.js";
import { AppError } from "../utils/AppError.js";

const repo = () => AppDataSource.getRepository("Lab");

export async function listLabs({ search, status, departmentId }) {
  const qb = repo()
    .createQueryBuilder("lab")
    .leftJoinAndSelect("lab.department", "department");

  if (search) qb.andWhere("lab.name ILIKE :search", { search: `%${search}%` });
  if (status) qb.andWhere("lab.status = :status", { status });
  if (departmentId) qb.andWhere("department.id = :departmentId", { departmentId });

  return qb.orderBy("lab.name", "ASC").getMany();
}

export async function getLab(id) {
  const lab = await repo().findOne({ where: { id }, relations: { department: true } });
  if (!lab) throw new AppError(404, "NOT_FOUND", "Lab not found");
  return lab;
}

export async function createLab(data) {
  const { departmentId, ...rest } = data;
  const lab = repo().create({
    ...rest,
    ...(departmentId && { department: { id: departmentId } }),
  });
  return repo().save(lab);
}

export async function updateLab(id, data) {
  const lab = await getLab(id);
  const { departmentId, ...rest } = data;
  Object.assign(lab, rest);
  if (departmentId) lab.department = { id: departmentId };
  return repo().save(lab);
}