import { Request } from "express";
import { ERROR_CODES } from "../../domain";
import { regularExp } from "../../infrastructure";

interface SupplyReportItemInput {
  itemId: string;
  addedQuantity: number;
}

export class SupplyReportEntityDto {
  readonly reportId: string;
  readonly items: SupplyReportItemInput[];

  private constructor(reportId: string, items: SupplyReportItemInput[]) {
    this.reportId = reportId;
    this.items = items;
  }

  static updateSupplies(req: Request): [string?, SupplyReportEntityDto?] {
    const reportId = String(req.params?.id ?? "").trim();
    const answers = req.body?.items;

    if (!reportId) return [ERROR_CODES.MISSING_SUPPLY_REPORT_ID];

    if (!regularExp.uuid.test(reportId))
      return [ERROR_CODES.INVALID_SUPPLY_REPORT_ID];

    if (!Array.isArray(answers) || answers.length === 0)
      return [ERROR_CODES.MISSING_REPORT_ITEMS];

    const items: SupplyReportItemInput[] = [];

    for (const answer of answers) {
      const itemId =
        typeof answer?.itemId === "string" ? answer.itemId.trim() : "";

      const addedQuantity = answer?.addedQuantity;

      if (!itemId) return [ERROR_CODES.MISSING_REPORT_ITEM_ID];

      if (!regularExp.uuid.test(itemId))
        return [ERROR_CODES.INVALID_REPORT_ITEM_ID];

      if (addedQuantity === undefined || addedQuantity === null)
        return [ERROR_CODES.MISSING_ADDED_QUANTITY];

      if (
        typeof addedQuantity !== "number" ||
        !Number.isSafeInteger(addedQuantity) ||
        addedQuantity < 0
      )
        return [ERROR_CODES.INVALID_ADDED_QUANTITY];

      items.push({
        itemId,
        addedQuantity,
      });
    }

    return [undefined, new SupplyReportEntityDto(reportId, items)];
  }
}
