import { Transaction } from "sequelize"
import { sequelize } from "../../../config/sequelize.adapter"
import { Ambulance, Delegation, Municipality, Pharmacy, State, User } from "../models.store"
import { config } from "dotenv"
import bcrypt from 'bcrypt';

config()


export const createSeed = async () => {
  let tx: Transaction | undefined

  try {
    tx = await sequelize.transaction()

    //* Estados
    const states = await State.bulkCreate([
      { name: 'Jalisco' },
      { name: 'San Luis Potosí' },
      { name: 'Guanajuato' },
    ], { transaction: tx })

    //* Municipios
    await states.map(async (state) => {
      if (state.name === 'Jalisco') {
        await Municipality.bulkCreate([
          { name: 'Ameca', state_id: state.id },
          { name: 'Tala', state_id: state.id },
          { name: 'Guadalajara', state_id: state.id }
        ], { transaction: tx })
      }
      else if (state.name === 'San Luis Potosí') {
        await Municipality.bulkCreate([
          { name: 'San Luis Potosí', state_id: state.id },
          { name: 'Rio verde', state_id: state.id },
          { name: 'Matehuala', state_id: state.id }
        ], { transaction: tx })
      }
      else if (state.name === 'Guanajuato') {
        await Municipality.bulkCreate([
          { name: 'Leon', state_id: state.id },
          { name: 'Abasolo', state_id: state.id },
          { name: 'San Miguel de Allende', state_id: state.id }
        ], { transaction: tx })
      }
    })

    const municipality = await Municipality.findOne({
      where: { name: 'Ameca' },
      transaction: tx,
      include: { model: State, as: 'state', attributes: ['name'] }
    })

    //* Delegacion
    const pharmacy = await Pharmacy.create({}, { transaction: tx })

    const delegation = await Delegation.create({
      state_id: municipality?.state_id,
      name: `Delegación ${municipality?.name}, ${municipality?.state?.name}`,
      municipality_id: municipality?.id,
      pharmacy_id: pharmacy.id,
    }, { transaction: tx })

    //* Usuarios semilla
    const password = await bcrypt.hash(process.env.USER_PASSWORD_SEED as string, 10);

    await User.create({ // administrador
      name: 'Admin',
      lastname: 'Seed',
      email: 'adminseed@vitalgest.mx',
      password: password,
      status: true,
      role: 'general_admin',
      position: 'developer',
      delegation_id: delegation.id,
    }, { transaction: tx })

    await User.create({ // Jefe de guardia
      name: 'Jefe Guardia',
      lastname: 'Seed',
      email: 'jefeguardiaseed@vitalgest.mx',
      password: password,
      status: true,
      role: 'head_guard',
      position: 'Jefe de guardia',
      delegation_id: delegation.id,
    }, { transaction: tx })

    await User.create({ // Paramedico
      name: 'Paramedico',
      lastname: 'Seed',
      email: 'paramedicoseed@vitalgest.mx',
      password: password,
      status: true,
      role: 'paramedical',
      position: 'Paramedico',
      delegation_id: delegation.id,
    }, { transaction: tx })

    await User.create({ // Chofer
      name: 'Chofer',
      lastname: 'Seed',
      email: 'choferseed@vitalgest.mx',
      password: password,
      status: true,
      role: 'vehicle_operator',
      position: 'Chofer',
      delegation_id: delegation.id,
    }, { transaction: tx })

    //* Ambulancia semilla
    await Ambulance.create({
      number: 'DF434F7',
      model: '2018',
      brand: 'Mercedez Benz',
      delegation_id: delegation.id,
    }, { transaction: tx })

    await tx.commit()

    return { success: true }

  } catch (error) {
    await tx?.rollback()
    console.log(error)
    throw { success: false }
  }
}