"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ShiftsService = void 0;
const domain_1 = require("../../domain");
const infrastructure_1 = require("../../infrastructure");
class ShiftsService {
    constructor() {
        this.validateData = async (ambulanceId, guardId, paramedicalId, driverId) => {
            const [amb, grd, prm, drv] = await Promise.all([
                infrastructure_1.Ambulance.findByPk(ambulanceId, { attributes: ['id'], raw: true }),
                infrastructure_1.Guard.findByPk(guardId, { attributes: ['id'], raw: true }),
                infrastructure_1.User.findByPk(paramedicalId, { attributes: ['id'], raw: true }),
                infrastructure_1.User.findByPk(driverId, { attributes: ['id'], raw: true }),
            ]);
            if (!amb)
                return { code: domain_1.ERROR_CODES.AMBULANCE_NOT_FOUND };
            if (!grd)
                return { code: domain_1.ERROR_CODES.GUARD_NOT_FOUND };
            if (!prm)
                return { code: domain_1.ERROR_CODES.PARAMEDICAL_NOT_FOUND };
            if (!drv)
                return { code: domain_1.ERROR_CODES.DRIVER_NOT_FOUND };
            return true;
        };
    }
    async createShift(shiftEntityDto) {
        //! todo: verificar que no existe una con el mismo día y misma ambulancia
        const { ambulanceId, guardId, paramedicalId, driverId } = shiftEntityDto;
        const ok = await this.validateData(ambulanceId, guardId, paramedicalId, driverId);
        if (!ok)
            throw ok;
        let tx;
        try {
            tx = await infrastructure_1.sequelize.transaction();
            const ambulance = await infrastructure_1.Ambulance.findOne({ where: { id: ambulanceId }, attributes: ['number'] });
            const entity = domain_1.ShiftEntity.create({ ambulanceId, guardId, paramedicalId, driverId });
            const shift = await infrastructure_1.Shift.create({
                name: `Turno ${ambulance.number}`,
                ambulance_id: entity.ambulanceId,
                guard_id: entity.guardId,
                paramedical_id: entity.paramedicalId,
                driver_id: entity.driverId
            }, { transaction: tx });
            await tx.commit();
            const formatShift = {
                id: shift.id,
                name: shift.name,
                ambulance: {
                    id: shift.ambulance_id
                },
                guard: {
                    id: shift.guard_id
                },
                paramedical: {
                    id: shift.paramedical_id
                },
                driver: {
                    id: shift.driver_id
                },
                createdAt: shift.get('createdAt'),
                updatedAt: shift.get('updatedAt'),
            };
            return {
                success: true,
                data: formatShift
            };
        }
        catch (error) {
            tx?.rollback();
            console.log(error);
            throw { code: domain_1.ERROR_CODES.INSERT_FAILED };
        }
    }
    async editShift(shiftEntityDto) {
        const { id, name, ambulanceId, guardId, paramedicalId, driverId } = shiftEntityDto;
        const shiftExists = await infrastructure_1.Shift.findOne({ where: { id } });
        if (!shiftExists)
            throw { code: domain_1.ERROR_CODES.SHIFT_NOT_FOUND };
        const ok = await this.validateData(ambulanceId, guardId, paramedicalId, driverId);
        if (!ok)
            throw ok;
        let tx;
        try {
            tx = await infrastructure_1.sequelize.transaction();
            const entity = domain_1.ShiftEntity.create({ ambulanceId, guardId, paramedicalId, driverId });
            await infrastructure_1.Shift.update({
                name: name,
                ambulance_id: entity.ambulanceId,
                guard_id: entity.guardId,
                paramedical_id: entity.paramedicalId,
                driver_id: entity.driverId
            }, { where: { id }, transaction: tx });
            await tx.commit();
            return { success: true };
        }
        catch (error) {
            tx?.rollback();
            console.log(error);
            throw { code: domain_1.ERROR_CODES.UPDATE_FAILED };
        }
    }
    async deleteShift(shiftEntityDto) {
        const { id } = shiftEntityDto;
        const count = await infrastructure_1.Shift.destroy({ where: { id } });
        if (count === 0)
            throw { code: domain_1.ERROR_CODES.SHIFT_NOT_FOUND };
        return { success: true };
    }
    async getShifts(guardId) {
        const shifts = await infrastructure_1.Shift.findAll({ where: { guard_id: guardId } })
            .catch(() => { throw { code: domain_1.ERROR_CODES.UNKNOWN_DB_ERROR }; });
        if (shifts.length === 0)
            throw { code: domain_1.ERROR_CODES.SHIFT_NOT_FOUND };
        const formatShifts = shifts.map((shift) => ({
            id: shift.id,
            name: shift.name,
            ambulance: {
                id: shift.ambulance_id
            },
            guard: {
                id: shift.guard_id
            },
            paramedical: {
                id: shift.paramedical_id
            },
            driver: {
                id: shift.driver_id
            },
            createdAt: shift.get('createdAt'),
            updatedAt: shift.get('updatedAt'),
        }));
        return {
            success: true,
            data: formatShifts
        };
    }
    async getOneShift(id) {
        const shift = await infrastructure_1.Shift.findOne({ where: { id } })
            .catch(() => { throw { code: domain_1.ERROR_CODES.UNKNOWN_DB_ERROR }; });
        if (!shift)
            throw { code: domain_1.ERROR_CODES.SHIFT_NOT_FOUND };
        const formatShift = {
            id: shift.id,
            name: shift.name,
            ambulance: {
                id: shift.ambulance_id
            },
            guard: {
                id: shift.guard_id
            },
            paramedical: {
                id: shift.paramedical_id
            },
            driver: {
                id: shift.driver_id
            },
            createdAt: shift.get('createdAt'),
            updatedAt: shift.get('updatedAt'),
        };
        return {
            success: true,
            data: formatShift
        };
    }
}
exports.ShiftsService = ShiftsService;
