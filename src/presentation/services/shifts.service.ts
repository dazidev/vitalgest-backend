import { Transaction } from "sequelize";
import { ShiftEntityDto } from "../../application";
import { ERROR_CODES, ShiftEntity, ShiftsServiceInterface } from "../../domain";
import { Ambulance, Guard, sequelize, Shift, User } from "../../infrastructure";


export class ShiftsService implements ShiftsServiceInterface {

  private validateData = async (ambulanceId: string, guardId: string, paramedicalId: string, driverId: string) => {
    const [amb, grd, prm, drv] = await Promise.all([
      Ambulance.findByPk(ambulanceId, { attributes: ['id'], raw: true }),
      Guard.findByPk(guardId, { attributes: ['id'], raw: true }),
      User.findByPk(paramedicalId, { attributes: ['id'], raw: true }),
      User.findByPk(driverId, { attributes: ['id'], raw: true }),
    ])

    if (!amb) return { code: ERROR_CODES.AMBULANCE_NOT_FOUND }
    if (!grd) return { code: ERROR_CODES.GUARD_NOT_FOUND }
    if (!prm) return { code: ERROR_CODES.PARAMEDICAL_NOT_FOUND }
    if (!drv) return { code: ERROR_CODES.DRIVER_NOT_FOUND }
    return true
  }

  async createShift(shiftEntityDto: ShiftEntityDto): Promise<object> {
    //! todo: verificar que no existe una con el mismo día y misma ambulancia
    const { ambulanceId, guardId, paramedicalId, driverId } = shiftEntityDto

    const ok = await this.validateData(ambulanceId!, guardId!, paramedicalId!, driverId!)
    if (!ok) throw ok

    let tx: Transaction | undefined
    try {
      tx = await sequelize.transaction()

      const ambulance = await Ambulance.findOne({ where: { id: ambulanceId }, attributes: ['number'] })

      const entity = ShiftEntity.create({ ambulanceId, guardId, paramedicalId, driverId })

      const shift = await Shift.create({
        name: `Turno ${ambulance!.number}`,
        ambulance_id: entity.ambulanceId,
        guard_id: entity.guardId,
        paramedical_id: entity.paramedicalId,
        driver_id: entity.driverId
      }, { transaction: tx })

      await tx.commit()

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
        createdAt: shift.get('createdAt') as Date,
        updatedAt: shift.get('updatedAt') as Date,
      }

      return {
        success: true,
        data: formatShift
      }

    } catch (error) {
      tx?.rollback()
      console.log(error)
      throw { code: ERROR_CODES.INSERT_FAILED }
    }
  }

  async editShift(shiftEntityDto: ShiftEntityDto): Promise<object> {
    const { id, name, ambulanceId, guardId, paramedicalId, driverId } = shiftEntityDto

    const shiftExists = await Shift.findOne({ where: { id } })
    if (!shiftExists) throw { code: ERROR_CODES.SHIFT_NOT_FOUND }

    const ok = await this.validateData(ambulanceId!, guardId!, paramedicalId!, driverId!)
    if (!ok) throw ok

    let tx: Transaction | undefined

    try {
      tx = await sequelize.transaction()
      const entity = ShiftEntity.create({ ambulanceId, guardId, paramedicalId, driverId })

      await Shift.update({
        name: name,
        ambulance_id: entity.ambulanceId,
        guard_id: entity.guardId,
        paramedical_id: entity.paramedicalId,
        driver_id: entity.driverId
      }, { where: { id }, transaction: tx })

      await tx.commit()

      return { success: true }

    } catch (error) {
      tx?.rollback()
      console.log(error)
      throw { code: ERROR_CODES.UPDATE_FAILED }
    }
  }

  async deleteShift(shiftEntityDto: ShiftEntityDto): Promise<object> {
    const { id } = shiftEntityDto

    const count = await Shift.destroy({ where: { id } })

    if (count === 0) throw { code: ERROR_CODES.SHIFT_NOT_FOUND }

    return { success: true }
  }

  async getShifts(guardId: string): Promise<object> {

    const shifts = await Shift.findAll({ where: { guard_id: guardId } })
      .catch(() => { throw { code: ERROR_CODES.UNKNOWN_DB_ERROR } })

    if (shifts.length === 0) throw { code: ERROR_CODES.SHIFT_NOT_FOUND }

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
      createdAt: shift.get('createdAt') as Date,
      updatedAt: shift.get('updatedAt') as Date,
    }))

    return {
      success: true,
      data: formatShifts
    }
  }

  async getOneShift(id: string): Promise<object> {
    const shift = await Shift.findOne({ where: { id } })
      .catch(() => { throw { code: ERROR_CODES.UNKNOWN_DB_ERROR } })

    if (!shift) throw { code: ERROR_CODES.SHIFT_NOT_FOUND }

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
      createdAt: shift.get('createdAt') as Date,
      updatedAt: shift.get('updatedAt') as Date,
    }

    return {
      success: true,
      data: formatShift
    }
  }

}