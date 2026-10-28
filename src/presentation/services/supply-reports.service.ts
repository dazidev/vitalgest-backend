import { Transaction } from "sequelize";
import { PaginationDto, SupplyReportEntityDto } from "../../application";
import { ERROR_CODES } from "../../domain";
import {
  Ambulance,
  sequelize,
  SupplyReport,
  SupplyReportItem,
} from "../../infrastructure";

export class SupplyReportsService {
  async getReports(paginationDto: PaginationDto): Promise<object> {
    const { limit, offset } = paginationDto;

    try {
      const { count, rows: reports } = await SupplyReport.findAndCountAll({
        include: [
          {
            model: Ambulance,
            as: "ambulance",
            attributes: ["id", "number"],
          },
          {
            model: SupplyReportItem,
            as: "items",
            required: false,
          },
        ],
        distinct: true,
        order: [
          ["createdAt", "DESC"],
          ["id", "ASC"],
        ],
        ...(limit !== undefined ? { limit } : {}),
        ...(offset !== undefined ? { offset } : {}),
      });

      const formattedReports = reports.map((report) => {
        const items =
          (report.get("items") as SupplyReportItem[] | undefined) ?? [];

        const formatItem = (item: SupplyReportItem) => {
          const currentQuantity = item.reported_quantity + item.added_quantity;

          const remainingQuantity = Math.max(
            0,
            item.min_quantity - currentQuantity,
          );

          return {
            id: item.id,
            category: item.category,
            specification: item.specification,
            measurement_unit: item.measurement_unit,

            min_quantity: item.min_quantity,
            reported_quantity: item.reported_quantity,
            required_quantity: item.required_quantity,
            added_quantity: item.added_quantity,

            current_quantity: currentQuantity,
            remaining_quantity: remainingQuantity,
            is_resolved: item.is_resolved,
          };
        };

        type FormattedItem = ReturnType<typeof formatItem>;

        const groupedAreas = new Map<
          number,
          {
            area_id: number;
            area_name: string;
            section: string;
            order: number;
            supplies: FormattedItem[];
          }
        >();

        const orderedItems = [...items].sort(
          (a, b) =>
            a.area_order - b.area_order || a.category.localeCompare(b.category),
        );

        for (const item of orderedItems) {
          let area = groupedAreas.get(item.area_id);

          if (!area) {
            area = {
              area_id: item.area_id,
              area_name: item.area_name,
              section: item.section,
              order: item.area_order,
              supplies: [],
            };

            groupedAreas.set(item.area_id, area);
          }

          area.supplies.push(formatItem(item));
        }

        return {
          id: report.id,
          checklist_id: report.checklist_id,
          ambulance: report.ambulance
            ? {
                id: report.ambulance.id,
                number: report.ambulance.number,
              }
            : null,
          status: report.status,
          attended_at: report.attended_at,
          createdAt: report.get("createdAt") as Date,
          updatedAt: report.get("updatedAt") as Date,
          areas: Array.from(groupedAreas.values()),
        };
      });

      return {
        success: true,
        data: formattedReports,
        total: count,
      };
    } catch (error) {
      if (typeof error === "string") throw error;
      throw ERROR_CODES.UNKNOWN_DB_ERROR;
    }
  }

  async updateSupplies(
    supplyReportEntityDto: SupplyReportEntityDto,
  ): Promise<object> {
    const { reportId, items } = supplyReportEntityDto;

    let tx: Transaction | undefined;

    try {
      tx = await sequelize.transaction();

      const report = await SupplyReport.findOne({
        where: { id: reportId },
        transaction: tx,
      });

      if (!report) throw ERROR_CODES.SUPPLY_REPORT_NOT_FOUND;

      const updatedItems = [];

      for (const answer of items) {
        const item = await SupplyReportItem.findOne({
          where: {
            id: answer.itemId,
            report_id: reportId,
          },
          transaction: tx,
        });

        if (!item) throw ERROR_CODES.SUPPLY_REPORT_ITEM_NOT_FOUND;

        const addedQuantity = answer.addedQuantity;

        const currentQuantity = item.reported_quantity + addedQuantity;

        if (!Number.isSafeInteger(currentQuantity))
          throw ERROR_CODES.INVALID_ADDED_QUANTITY;

        const remainingQuantity = Math.max(
          0,
          item.min_quantity - currentQuantity,
        );

        const isResolved = remainingQuantity === 0;

        await item.update(
          {
            added_quantity: addedQuantity,
            is_resolved: isResolved,
          },
          { transaction: tx },
        );

        updatedItems.push({
          id: item.id,
          category: item.category,
          min_quantity: item.min_quantity,
          reported_quantity: item.reported_quantity,
          required_quantity: item.required_quantity,
          added_quantity: addedQuantity,
          current_quantity: currentQuantity,
          remaining_quantity: remainingQuantity,
          is_resolved: isResolved,
        });
      }

      await tx.commit();

      return {
        success: true,
        data: updatedItems,
      };
    } catch (error) {
      await tx?.rollback();

      if (typeof error === "string") throw error;
      throw ERROR_CODES.UPDATE_FAILED;
    }
  }

  async attendReport(id: string): Promise<object> {
    let tx: Transaction | undefined;

    try {
      tx = await sequelize.transaction();

      const report = await SupplyReport.findOne({
        where: { id },
        transaction: tx,
      });

      if (!report) throw ERROR_CODES.SUPPLY_REPORT_NOT_FOUND;

      if (report.status === "pending") {
        await report.update(
          {
            status: "attended",
            attended_at: new Date(),
          },
          { transaction: tx },
        );
      }

      await tx.commit();

      return {
        success: true,
        data: {
          id: report.id,
          status: report.status,
          attended_at: report.attended_at,
        },
      };
    } catch (error) {
      await tx?.rollback();

      if (typeof error === "string") throw error;
      throw ERROR_CODES.UPDATE_FAILED;
    }
  }
}
