import { Transaction } from 'sequelize';
import { AmbulanceEntityDto, SupplyAmbEntityDto } from "../../application";
import { AmbulanceEntity, AmbulancesServiceInterface, ERROR_CODES } from "../../domain";
import { Ambulance, Delegation, sequelize, Supply, SupplyAmbulance } from "../../infrastructure";


export class AmbulancesService implements AmbulancesServiceInterface {

  async createAmbulance(ambulanceEntityDto: AmbulanceEntityDto): Promise<object> {
    const { delegationId, number } = ambulanceEntityDto

    const existsDelegation = await Delegation.findOne({ where: { id: delegationId } })
      .catch(() => { throw ERROR_CODES.UNKNOWN_DB_ERROR })

    if (!existsDelegation) throw ERROR_CODES.DELEGATION_NOT_FOUND

    const exists = await Ambulance.findOne({ where: { number: number } })
      .catch(() => { throw ERROR_CODES.UNKNOWN_DB_ERROR })

    if (exists) throw 'AMBULANCE_EXISTS'

    const ambulanceEntity = AmbulanceEntity.create(ambulanceEntityDto)
    if (!ambulanceEntity) throw ERROR_CODES.INSERT_FAILED

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
      if (typeof error === 'string') throw error
      throw ERROR_CODES.INSERT_FAILED
    }

  }

  async editAmbulance(ambulanceEntityDto: AmbulanceEntityDto): Promise<object> {
    const { id, delegationId } = ambulanceEntityDto

    const exists = await Ambulance.findOne({ where: { id } })
    if (!exists) throw ERROR_CODES.AMBULANCE_NOT_FOUND

    const existsDelegation = await Delegation.findOne({ where: { id: delegationId } })
      .catch(() => { throw ERROR_CODES.UNKNOWN_DB_ERROR })

    if (!existsDelegation) throw ERROR_CODES.DELEGATION_NOT_FOUND

    const ambulanceEntity = AmbulanceEntity.edit(ambulanceEntityDto)
    if (!ambulanceEntity) throw ERROR_CODES.UPDATE_FAILED

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
      if (typeof error === 'string') throw error
      throw ERROR_CODES.UPDATE_FAILED
    }

  }

  async deleteAmbulance(ambulanceEntityDto: AmbulanceEntityDto): Promise<object> {
    const { id } = ambulanceEntityDto
    const ambulance = await Ambulance.destroy({ where: { id } })

    if (ambulance === 0) throw ERROR_CODES.AMBULANCE_NOT_FOUND

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

    if (ambulances.length === 0) throw ERROR_CODES.AMBULANCE_NOT_FOUND

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
      .catch(() => { throw ERROR_CODES.UNKNOWN_DB_ERROR })

    if (!ambulance) throw ERROR_CODES.AMBULANCE_NOT_FOUND

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

  async addSupply(supplyAmbEntityDto: SupplyAmbEntityDto): Promise<object> {
    const { avaibleQuantity, minQuantity, areaId, ambulanceId, supplyId } = supplyAmbEntityDto

    let tx: Transaction | undefined
    try {
      tx = await sequelize.transaction()

      const supplyInfo = await Supply.findOne({ where: { id: supplyId }, transaction: tx })
      if (!supplyInfo) throw ERROR_CODES.SUPPLY_NOT_FOUND

      if (Number(avaibleQuantity!) > supplyInfo.avaible_quantity) throw ERROR_CODES.QUANTITY_NOT_EXIST
      const newQuantity = supplyInfo.avaible_quantity - avaibleQuantity!

      await Supply.update({
        avaible_quantity: newQuantity,
      }, { where: { id: supplyId }, transaction: tx })

      const supplyAmb = await SupplyAmbulance.create({
        category: supplyInfo.category!,
        specification: supplyInfo.specification!,
        avaible_quantity: Number(avaibleQuantity!),
        min_quantity: Number(minQuantity!),
        expiration_date: supplyInfo.expiration_date!,
        measurement_unit: supplyInfo.measurement_unit!,
        area_id: Number(areaId), //! todo: hacer la tabla de areas
        ambulance_id: ambulanceId,
      }, { transaction: tx })

      await tx.commit()

      return {
        success: true,
        data: supplyAmb
      }
    } catch (error) {
      tx?.rollback()
      if (typeof error === 'string') throw error
      throw ERROR_CODES.UNKNOWN_DB_ERROR
    }
  }

  async editSupply(supplyAmbEntityDto: SupplyAmbEntityDto): Promise<object> {
    const { id, avaibleQuantity, minQuantity, areaId, ambulanceId } = supplyAmbEntityDto

    let tx: Transaction | undefined

    try {
      tx = await sequelize.transaction()

      const supply = await SupplyAmbulance.findOne({ where: { id }, transaction: tx })
      if (!supply) throw ERROR_CODES.SUPPLY_NOT_FOUND

      await SupplyAmbulance.update({
        avaible_quantity: Number(avaibleQuantity!),
        min_quantity: Number(minQuantity!),
        area_id: Number(areaId), //! todo: hacer la tabla de areas
        ambulance_id: ambulanceId,
      }, { where: { id }, transaction: tx })

      await tx.commit()

      return { success: true }

    } catch (error) {
      await tx?.rollback()
      if (typeof error === 'string') throw error
      throw ERROR_CODES.UNKNOWN_DB_ERROR
    }
  }

  async deleteSupply(supplyAmbEntityDto: SupplyAmbEntityDto): Promise<object> {
    const { id } = supplyAmbEntityDto

    try {
      const supply = await SupplyAmbulance.findOne({
        where: { id }
      })

      if (!supply) throw ERROR_CODES.SUPPLY_NOT_FOUND

      const row = await SupplyAmbulance.destroy({ where: { id } })
      if (row === 0) throw ERROR_CODES.SUPPLY_NOT_FOUND

      return { success: true }

    } catch (error) {
      if (typeof error === 'string') throw error
      throw ERROR_CODES.UNKNOWN_DB_ERROR
    }
  }

  async getAmbSupplies(ambulanceId: string): Promise<object> {
    try {
      const pharmacy = Ambulance.findOne({ where: { id: ambulanceId } })
      if (!pharmacy) throw ERROR_CODES.AMBULANCE_NOT_FOUND

      const supplies = await SupplyAmbulance.findAll({ where: { ambulance_id: ambulanceId } })
      if (supplies.length === 0) throw ERROR_CODES.SUPPLIES_NOT_FOUND

      return {
        success: true,
        data: supplies
      }
    } catch (error) {
      if (typeof error === 'string') throw error
      throw ERROR_CODES.UNKNOWN_DB_ERROR
    }
  }

  async getOneAmbSupply(supplyAmbEntityDto: SupplyAmbEntityDto): Promise<object> {
    const { id } = supplyAmbEntityDto
    try {
      const supply = await SupplyAmbulance.findOne({ where: { id } })
      if (!supply) throw ERROR_CODES.SUPPLIES_NOT_FOUND

      return {
        success: true,
        data: supply
      }
    } catch (error) {
      if (typeof error === 'string') throw error
      throw ERROR_CODES.UNKNOWN_DB_ERROR
    }
  }
}