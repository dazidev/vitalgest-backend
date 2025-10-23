import { Transaction } from "sequelize";
import { AmbulanceEntityDto } from "../../application";
import { AmbulanceEntity, AmbulancesServiceInterface, ERROR_CODES } from "../../domain";
import { Ambulance, Delegation, sequelize } from "../../infrastructure";


export class AmbulancesService implements AmbulancesServiceInterface {

  async createAmbulance(ambulanceEntityDto: AmbulanceEntityDto): Promise<object> {
    const { delegationId } = ambulanceEntityDto

    const existsDelegation = await Delegation.findOne({ where: { id: delegationId } })
      .catch(() => { throw { code: ERROR_CODES.UNKNOWN_DB_ERROR } })

    if (!existsDelegation) throw { code: ERROR_CODES.DELEGATION_NOT_FOUND }

    const ambulanceEntity = AmbulanceEntity.create(ambulanceEntityDto)
    if (!ambulanceEntity) throw { code: ERROR_CODES.INSERT_FAILED }

    let tx: Transaction | undefined

    try {
      tx = await sequelize.transaction()

      const ambulance = await Ambulance.create({
        number: ambulanceEntity.number!,
        brand: ambulanceEntity.brand!,
        model: ambulanceEntity.model!,
        delegation_id: ambulanceEntity.delegationId!,
      })

      await tx.commit()

      const formatAmbulance = {
        id: ambulance.id,
        number: ambulance.number,
        brand: ambulance.brand,
        model: ambulance.model,
        delegation: {
          id: ambulance.delegation_id
        }
      }

      return {
        success: true,
        data: formatAmbulance
      }

    } catch (error) {
      tx?.rollback()
      throw { code: ERROR_CODES.INSERT_FAILED }
    }

  }

  async editAmbulance(ambulanceEntityDto: AmbulanceEntityDto): Promise<object> {
    const { id, delegationId } = ambulanceEntityDto

    const exists = await Ambulance.findOne({ where: { id } })
    if (!exists) throw { code: ERROR_CODES.AMBULANCE_NOT_FOUND }

    const existsDelegation = await Delegation.findOne({ where: { id: delegationId } })
      .catch(() => { throw { code: ERROR_CODES.UNKNOWN_DB_ERROR } })

    if (!existsDelegation) throw { code: ERROR_CODES.DELEGATION_NOT_FOUND }

    const ambulanceEntity = AmbulanceEntity.edit(ambulanceEntityDto)
    if (!ambulanceEntity) throw { code: ERROR_CODES.UPDATE_FAILED }

    let tx: Transaction | undefined

    try {
      tx = await sequelize.transaction()

      await Ambulance.update({
        number: ambulanceEntity.number!,
        brand: ambulanceEntity.brand!,
        model: ambulanceEntity.model!,
        delegation_id: ambulanceEntity.delegationId!,
      }, { where: { id } })

      await tx.commit()

      return { success: true }

    } catch (error) {
      tx?.rollback()
      throw { code: ERROR_CODES.UPDATE_FAILED }
    }

  }

  async deleteAmbulance(ambulanceEntityDto: AmbulanceEntityDto): Promise<object> {
    const { id } = ambulanceEntityDto
    const ambulance = await Ambulance.destroy({ where: { id } })

    if (ambulance === 0) throw { code: ERROR_CODES.AMBULANCE_NOT_FOUND }

    return { success: true }
  }

  async getAmbulances(amount: string): Promise<object> {
    let formatAmount
    if (!(amount === 'all')) formatAmount = parseInt(amount)
    else formatAmount = amount


    let ambulances

    formatAmount === 'all'
      ? ambulances = await Ambulance.findAll({
        include: [
          { model: Delegation, as: 'delegation', attributes: ['id', 'name'] },
        ],
      })
      : ambulances = await Ambulance.findAll({
        include: [
          { model: Delegation, as: 'delegation', attributes: ['id', 'name'] },
        ],
        limit: formatAmount as number
      })

    if (ambulances.length === 0) throw { code: ERROR_CODES.AMBULANCE_NOT_FOUND }

    const formatAmbulances = ambulances.map((ambulance) => ({
      id: ambulance.id,
      number: ambulance.number,
      brand: ambulance.brand,
      model: ambulance.model,
      delegation: {
        id: ambulance.delegation?.id,
        name: ambulance.delegation?.name,
      }
    }))

    return {
      success: true,
      data: formatAmbulances
    }
  }

  async getOneAmbulance(id: string): Promise<object> {
    const ambulance = await Ambulance.findOne({
      where: { id },
      include: [
        { model: Delegation, as: 'delegation', attributes: ['id', 'name'] },
      ],
    })
      .catch(() => { throw { code: ERROR_CODES.UNKNOWN_DB_ERROR } })

    if (!ambulance) throw { code: ERROR_CODES.AMBULANCE_NOT_FOUND }

    const formatAmbulance = {
      id: ambulance.id,
      number: ambulance.number,
      brand: ambulance.brand,
      model: ambulance.model,
      delegation: {
        id: ambulance.delegation?.id,
        name: ambulance.delegation?.name,
      }
    }

    return {
      success: true,
      data: formatAmbulance
    }
  }
}