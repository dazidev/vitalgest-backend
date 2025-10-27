
export class ShiftEntity {
  constructor(
    public name?: string,
    public ambulanceId?: string,
    public guardId?: string,
    public paramedicalId?: string,
    public driverId?: string,
  ) {}

  static create(object: { [key: string]: any }) {
    const { name, ambulanceId, guardId, paramedicalId, driverId } = object;
    return new ShiftEntity(name, ambulanceId, guardId, paramedicalId, driverId);
  }
}