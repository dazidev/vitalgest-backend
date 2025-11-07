import { Transaction } from 'sequelize';
import { SupplyEntityDto } from "../../application";
import { ERROR_CODES, SuppliesServiceInterface } from "../../domain";
import { Pharmacy, sequelize, Supply } from "../../infrastructure";

export class SuppliesService implements SuppliesServiceInterface {

  async createSupply(supplyEntityDto: SupplyEntityDto): Promise<object> {
    const { 
      category, specification, avaibleQuantity, 
      expirationDate, measurementUnit, pharmacyId
    } = supplyEntityDto
    
    let tx: Transaction | undefined

    try {
      tx = await sequelize.transaction()

      const pharmacy = await Pharmacy.findOne({ where: { id: pharmacyId }, transaction: tx })
      if (!pharmacy) throw ERROR_CODES.PHARMACY_NOT_FOUND

      const supply = await Supply.create({
        category: category!,
        specification: specification!,
        avaible_quantity: Number(avaibleQuantity!),
        expiration_date: new Date(expirationDate!),
        measurement_unit: measurementUnit!,
        pharmacy_id: pharmacyId
      }, { transaction: tx })

      await tx.commit()

      return {
        success: true,
        data: supply
      }
      
    } catch (error) {
      await tx?.rollback()
      if (typeof error === 'string') throw error
      throw ERROR_CODES.UNKNOWN_DB_ERROR
    }
  }

  async editSupply(supplyEntityDto: SupplyEntityDto): Promise<object> {
    const { 
      id, category, specification, avaibleQuantity, 
      expirationDate, measurementUnit, pharmacyId
    } = supplyEntityDto

    let tx: Transaction | undefined

    try {
      tx = await sequelize.transaction()

      const supply = await Supply.findOne({ where: { id }, transaction: tx })
      if (!supply) throw ERROR_CODES.SUPPLY_NOT_FOUND

      await Supply.update({
        category: category,
        specification: specification,
        avaible_quantity: Number(avaibleQuantity),
        expiration_date: expirationDate,
        measurement_unit: measurementUnit,
        pharmacy_id: pharmacyId
      }, { where: { id }, transaction: tx })

      await tx.commit()

      return { success: true }

    } catch (error) {
      await tx?.rollback()
      if (typeof error === 'string') throw error
      throw ERROR_CODES.UNKNOWN_DB_ERROR
    }
  }

  async deleteSupply(supplyEntityDto: SupplyEntityDto): Promise<object> {
    const { id } = supplyEntityDto

    try {
      const supply = await Supply.findOne({
        where: { id }
      })

      if (!supply) throw ERROR_CODES.SUPPLY_NOT_FOUND

      const row = await Supply.destroy({ where: { id } })
      if (row === 0) throw ERROR_CODES.SUPPLY_NOT_FOUND

      return { success: true }

    } catch (error) {
      if (typeof error === 'string') throw error
      throw ERROR_CODES.UNKNOWN_DB_ERROR
    }
  }

  //! falta hacer uno por todos
  async getSupplies(pharmacyId: string): Promise<object> {
    try {
      const pharmacy = Pharmacy.findOne({ where: { id: pharmacyId } })
      if (!pharmacy) throw ERROR_CODES.PHARMACY_NOT_FOUND

      const supplies = await Supply.findAll({ where: { pharmacy_id: pharmacyId } })
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

  async getOneSupply(id: string): Promise<object> {
    try {

      const supply = await Supply.findOne({ where: { id } })
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