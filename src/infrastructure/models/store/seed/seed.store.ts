import { Transaction } from "sequelize";
import { sequelize } from "../../../config/sequelize.adapter";
import {
  Ambulance,
  AreaAmbulance,
  Delegation,
  Guard,
  Municipality,
  Pharmacy,
  Shift,
  State,
  User,
} from "../models.store";
import { config } from "dotenv";
import bcrypt from "bcrypt";

config();

export const createSeed = async () => {
  let tx: Transaction | undefined;

  try {
    tx = await sequelize.transaction();

    //* Estados
    const states = await State.bulkCreate(
      [
        { name: "Jalisco" },
        { name: "San Luis Potosí" },
        { name: "Guanajuato" },
      ],
      { transaction: tx }
    );

    //* Municipios
    await states.map(async (state) => {
      if (state.name === "Jalisco") {
        await Municipality.bulkCreate(
          [
            { name: "Ameca", state_id: state.id },
            { name: "Tala", state_id: state.id },
            { name: "Guadalajara", state_id: state.id },
          ],
          { transaction: tx }
        );
      } else if (state.name === "San Luis Potosí") {
        await Municipality.bulkCreate(
          [
            { name: "San Luis Potosí", state_id: state.id },
            { name: "Rio verde", state_id: state.id },
            { name: "Matehuala", state_id: state.id },
          ],
          { transaction: tx }
        );
      } else if (state.name === "Guanajuato") {
        await Municipality.bulkCreate(
          [
            { name: "Leon", state_id: state.id },
            { name: "Abasolo", state_id: state.id },
            { name: "San Miguel de Allende", state_id: state.id },
          ],
          { transaction: tx }
        );
      }
    });

    const municipality = await Municipality.findOne({
      where: { name: "Ameca" },
      transaction: tx,
      include: { model: State, as: "state", attributes: ["name"] },
    });

    //* Delegación semilla
    const delegation = await Delegation.create(
      {
        name: `Delegación ${municipality?.name}, ${municipality?.state?.name}`,
        municipality_id: municipality?.id,
      },
      { transaction: tx }
    );

    //* Pharmacia
    await Pharmacy.create(
      { delegation_id: delegation.id },
      { transaction: tx }
    );

    //* Usuarios semilla
    const password = await bcrypt.hash(
      process.env.USER_PASSWORD_SEED as string,
      10
    );

    await User.create(
      {
        // administrador
        name: "Admin",
        lastname: "Seed",
        email: "adminseed@vitalgest.mx",
        password: password,
        status: true,
        role: "general_admin",
        position: "developer",
        delegation_id: delegation.id,
      },
      { transaction: tx }
    );

    const guardChief = await User.create(
      {
        // Jefe de guardia
        name: "Jefe Guardia",
        lastname: "Seed",
        email: "jefeguardiaseed@vitalgest.mx",
        password: password,
        status: true,
        role: "head_guard",
        position: "Jefe de guardia",
        delegation_id: delegation.id,
      },
      { transaction: tx }
    );

    const paramedical = await User.create(
      {
        // Paramedico
        name: "Paramedico",
        lastname: "Seed",
        email: "paramedicoseed@vitalgest.mx",
        password: password,
        status: true,
        role: "paramedical",
        position: "Paramedico",
        delegation_id: delegation.id,
      },
      { transaction: tx }
    );

    const driver = await User.create(
      {
        // Chofer
        name: "Chofer",
        lastname: "Seed",
        email: "choferseed@vitalgest.mx",
        password: password,
        status: true,
        role: "vehicle_operator",
        position: "Chofer",
        delegation_id: delegation.id,
      },
      { transaction: tx }
    );

    //* Ambulancia semilla
    const ambulance = await Ambulance.create(
      {
        number: "DF434F7",
        model: "2018",
        brand: "Mercedez Benz",
        delegation_id: delegation.id,
      },
      { transaction: tx }
    );

    //* Guardia semilla
    const now = new Date();
    const startOfDay = new Date(
      now.getFullYear(),
      now.getMonth(),
      now.getDate(),
      0,
      0,
      0
    );

    const guard = await Guard.create(
      {
        date: startOfDay,
        state: "Nueva",
        guard_chief: guardChief.id,
        delegation_id: delegation.id,
      },
      { transaction: tx }
    );

    //* Turno semilla
    await Shift.create(
      {
        name: `Turno ${ambulance!.number}`,
        ambulance_id: ambulance.id,
        guard_id: guard.id,
        paramedical_id: paramedical.id,
        driver_id: driver.id,
      },
      { transaction: tx }
    );

    //* Areas de ambulancia semilla
    await AreaAmbulance.bulkCreate(
      [
        {
          id: 1,
          name: "EQUIPO DE VÍAS AÉREAS",
          section: "GABINETE 1",
          order: 1,
        },
        {
          id: 2,
          name: "EQUIPO DE CIRCULACIÓN Y CONTROL DE HEMORRAGIAS",
          section: "GABINETE 2",
          order: 2,
        },
        {
          id: 3,
          name: "MATERIAL PARTO DE EMERGANCIA",
          section: "GABINETE 3",
          order: 3,
        },
        {
          id: 4,
          name: "OTROS ELEMENTOS",
          section: "GABINETE 4",
          order: 4,
        },
        {
          id: 5,
          name: "SOLUCIONES Y MEDICAMENTOS",
          section: "GABINETE 5",
          order: 5,
        },
        {
          id: 6,
          name: "CAMAPEL",
          section: "VARIOS",
          order: 6,
        },
        {
          id: 7,
          name: "BOTIQUIN",
          section: "VARIOS",
          order: 7,
        },
      ],
      { transaction: tx }
    );

    await tx.commit();

    return { success: true };
  } catch (error) {
    await tx?.rollback();
    console.log(error);
    throw { success: false };
  }
};
