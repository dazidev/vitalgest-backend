import { Transaction } from "sequelize"
import { sequelize } from "../../../config/sequelize.adapter"
import { Delegation, Municipality, Pharmacy, State, User } from "../models.store"
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
    ])

    //* Municipios
    states.map(async (state) => {
      if (state.name === 'Jalisco') {
        await Municipality.bulkCreate([
          { name: 'Ameca', state_id: state.id },
          { name: 'Tala', state_id: state.id },
          { name: 'Guadalajara', state_id: state.id }
        ])
      }
      else if (state.name === 'San Luis Potosí') {
        await Municipality.bulkCreate([
          { name: 'San Luis Potosí', state_id: state.id },
          { name: 'Rio verde', state_id: state.id },
          { name: 'Matehuala', state_id: state.id }
        ])
      }
      else if (state.name === 'Guanajuato') {
        await Municipality.bulkCreate([
          { name: 'Leon', state_id: state.id },
          { name: 'Abasolo', state_id: state.id },
          { name: 'San Miguel de Allende', state_id: state.id }
        ])
      }
    })

    const municipality = await Municipality.findOne({
      where: { name: 'Ameca' },
      include: { model: State, as: 'state', attributes: ['name'] }
    })

    //* Delegacion
    const pharmacy = await Pharmacy.create()

    const delegation = await Delegation.create({
      state_id: municipality?.state_id,
      name: `Delegación ${municipality?.name}, ${municipality?.state?.name}`,
      municipality_id: municipality?.id,
      pharmacy_id: pharmacy.id,
    })

    //* Usuario semilla
    const password = await bcrypt.hash(process.env.USER_PASSWORD_SEED as string, 10);

    await User.create({
      name: 'Adim',
      lastname: 'Seed',
      email: 'adminseed@vitalgest.mx',
      password: password,
      status: true,
      role: 'general_admin',
      position: 'developer',
      delegation_id: delegation.id,
    }, { transaction: tx })


    await tx.commit()

    return { success: true }

  } catch (error) {
    await tx?.rollback()
    return { success: false }
  }
}