import { CreationOptional, DataTypes, ForeignKey, InferAttributes, InferCreationAttributes, Model, NonAttribute, UUIDV4 } from 'sequelize';
import { sequelize } from '../../../../config/sequelize.adapter';
import Ambulance from '../ambulance-model.store';
import AreaAmbulance from './area-ambulance-model.store';



class SupplyAmbulance extends Model<
  InferAttributes<SupplyAmbulance>,
  InferCreationAttributes<SupplyAmbulance>
> {
  declare id: CreationOptional<string>
  declare category: string
  declare specification: string
  declare avaible_quantity: number
  declare min_quantity: number
  declare expiration_date: Date
  declare measurement_unit: string


  declare area_id: ForeignKey<AreaAmbulance['id']>
  declare ambulance_id: ForeignKey<Ambulance['id']>

  declare area?: NonAttribute<AreaAmbulance>
  declare ambulance?: NonAttribute<Ambulance>
}

SupplyAmbulance.init(
  {
    id: { type: DataTypes.UUID, primaryKey: true, defaultValue: UUIDV4, allowNull: false },
    category: { type: DataTypes.STRING, allowNull: false },
    specification: { type: DataTypes.STRING, allowNull: false },
    avaible_quantity: { type: DataTypes.INTEGER, allowNull: false },
    min_quantity: { type: DataTypes.INTEGER, allowNull: false },
    expiration_date: { type: DataTypes.DATE, allowNull: false },
    measurement_unit: { type: DataTypes.STRING, allowNull: false },
    area_id: { 
      type: DataTypes.BIGINT.UNSIGNED,
      allowNull: false, 
      references: { model: 'areas_ambulance', key: 'id' },
      onUpdate: 'CASCADE'
    },
    ambulance_id: {
      type: DataTypes.UUID,
      allowNull: false,
      references: { model: 'ambulances', key: 'id' },
      onUpdate: 'CASCADE',
      //onDelete: 'RESTRICT', // impide eliminar al padre si tiene hijos
    },
  },
  {
    sequelize,
    modelName: 'SupplyAmbulance',
    tableName: 'supplies_ambulances',
    timestamps: true,
    underscored: true,
    // paranoid: true //* activa borrado lógico
  },
);

export default SupplyAmbulance;