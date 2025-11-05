import { CreationOptional, DataTypes, ForeignKey, InferAttributes, InferCreationAttributes, Model, NonAttribute, UUIDV4 } from 'sequelize';
import { sequelize } from '../../../../config/sequelize.adapter';
import Supply from './supply-model.store';
import Ambulance from '../ambulance-model.store';



class SupplyAmbulance extends Model<
  InferAttributes<SupplyAmbulance>,
  InferCreationAttributes<SupplyAmbulance>
> {
  declare id: CreationOptional<string>
  declare avaible_quantity: number
  declare area: string
  declare order_area: number 

  declare ambulance_id: ForeignKey<Ambulance['id']>
  declare supply_id: ForeignKey<Supply['id']>

  declare supply?: NonAttribute<Supply>
  declare ambulance?: NonAttribute<Ambulance>
}

SupplyAmbulance.init(
  {
    id: { type: DataTypes.UUID, primaryKey: true, defaultValue: UUIDV4, allowNull: false },
    avaible_quantity: { type: DataTypes.INTEGER, allowNull: false },
    area: { type: DataTypes.STRING, allowNull: true }, //! puede ser nulo?
    order_area: { type: DataTypes.INTEGER, allowNull: true },
    ambulance_id: {
      type: DataTypes.UUID,
      allowNull: false,
      references: { model: 'ambulances', key: 'id' },
      onUpdate: 'CASCADE', // actualiza si el padre cambia de id
      //onDelete: 'RESTRICT', // impide eliminar al padre si tiene hijos
    },
    supply_id: {
      type: DataTypes.UUID,
      allowNull: false,
      references: { model: 'supplies', key: 'id' },
      onUpdate: 'CASCADE', // actualiza si el padre cambia de id
      //onDelete: 'RESTRICT', // impide eliminar al padre si tiene hijos
    }
  },
  {
    sequelize,
    modelName: 'SupplyAmbulance',
    tableName: 'supplies_ambulances',
    timestamps: true,
    underscored: true,
    indexes: [
      { fields: ['supply_id'] },
      { unique: true, fields: ['area'], name : 'uq_area' },
      { unique: true, fields: ['area', 'order_area'], name : 'uq_area_order' }
    ],
    // paranoid: true //* activa borrado lógico
  },
);

export default SupplyAmbulance;