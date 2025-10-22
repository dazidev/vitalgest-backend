import { Transaction } from "sequelize"
import { sequelize } from "../../../config/sequelize.adapter"
import { Municipality, State } from "../models.store"




export const createSMSeed = async () => {
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

    await tx.commit()

    return { success: true }

  } catch (error) {
    await tx?.rollback()
    return { success: false }
  }
}