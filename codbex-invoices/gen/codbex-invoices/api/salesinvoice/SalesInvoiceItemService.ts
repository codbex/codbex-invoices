import { Controller, Get, Post, Put, Delete, response } from "sdk/http"
import { Extensions } from "sdk/extensions"
import { SalesInvoiceItemRepository, SalesInvoiceItemEntityOptions } from "../../dao/salesinvoice/SalesInvoiceItemRepository";
import { ValidationError } from "../utils/ValidationError";
import { HttpUtils } from "../utils/HttpUtils";

const validationModules = await Extensions.loadExtensionModules("codbex-invoices-salesinvoice-SalesInvoiceItem", ["validate"]);

@Controller
class SalesInvoiceItemService {

    private readonly repository = new SalesInvoiceItemRepository();

    @Get("/")
    public getAll(_: any, ctx: any) {
        try {
            const options: SalesInvoiceItemEntityOptions = {
                $limit: ctx.queryParameters["$limit"] ? parseInt(ctx.queryParameters["$limit"]) : undefined,
                $offset: ctx.queryParameters["$offset"] ? parseInt(ctx.queryParameters["$offset"]) : undefined
            };

            let SalesInvoice = parseInt(ctx.queryParameters.SalesInvoice);
            SalesInvoice = isNaN(SalesInvoice) ? ctx.queryParameters.SalesInvoice : SalesInvoice;

            if (SalesInvoice !== undefined) {
                options.$filter = {
                    equals: {
                        SalesInvoice: SalesInvoice
                    }
                };
            }

            return this.repository.findAll(options);
        } catch (error: any) {
            this.handleError(error);
        }
    }

    @Post("/")
    public create(entity: any) {
        try {
            this.validateEntity(entity);
            entity.Id = this.repository.create(entity);
            response.setHeader("Content-Location", "/services/ts/codbex-invoices/gen/codbex-invoices/api/salesinvoice/SalesInvoiceItemService.ts/" + entity.Id);
            response.setStatus(response.CREATED);
            return entity;
        } catch (error: any) {
            this.handleError(error);
        }
    }

    @Get("/count")
    public count() {
        try {
            return this.repository.count();
        } catch (error: any) {
            this.handleError(error);
        }
    }

    @Post("/count")
    public countWithFilter(filter: any) {
        try {
            return this.repository.count(filter);
        } catch (error: any) {
            this.handleError(error);
        }
    }

    @Post("/search")
    public search(filter: any) {
        try {
            return this.repository.findAll(filter);
        } catch (error: any) {
            this.handleError(error);
        }
    }

    @Get("/:id")
    public getById(_: any, ctx: any) {
        try {
            const id = parseInt(ctx.pathParameters.id);
            const entity = this.repository.findById(id);
            if (entity) {
                return entity;
            } else {
                HttpUtils.sendResponseNotFound("SalesInvoiceItem not found");
            }
        } catch (error: any) {
            this.handleError(error);
        }
    }

    @Put("/:id")
    public update(entity: any, ctx: any) {
        try {
            entity.Id = ctx.pathParameters.id;
            this.validateEntity(entity);
            this.repository.update(entity);
            return entity;
        } catch (error: any) {
            this.handleError(error);
        }
    }

    @Delete("/:id")
    public deleteById(_: any, ctx: any) {
        try {
            const id = ctx.pathParameters.id;
            const entity = this.repository.findById(id);
            if (entity) {
                this.repository.deleteById(id);
                HttpUtils.sendResponseNoContent();
            } else {
                HttpUtils.sendResponseNotFound("SalesInvoiceItem not found");
            }
        } catch (error: any) {
            this.handleError(error);
        }
    }

    private handleError(error: any) {
        if (error.name === "ForbiddenError") {
            HttpUtils.sendForbiddenRequest(error.message);
        } else if (error.name === "ValidationError") {
            HttpUtils.sendResponseBadRequest(error.message);
        } else {
            HttpUtils.sendInternalServerError(error.message);
        }
    }

    private validateEntity(entity: any): void {
        if (entity.SalesInvoice === null || entity.SalesInvoice === undefined) {
            throw new ValidationError(`The 'SalesInvoice' property is required, provide a valid value`);
        }
        if (entity.Name === null || entity.Name === undefined) {
            throw new ValidationError(`The 'Name' property is required, provide a valid value`);
        }
        if (entity.Name?.length > 300) {
            throw new ValidationError(`The 'Name' exceeds the maximum length of [300] characters`);
        }
        if (entity.Quantity === null || entity.Quantity === undefined) {
            throw new ValidationError(`The 'Quantity' property is required, provide a valid value`);
        }
        if (entity.UoM === null || entity.UoM === undefined) {
            throw new ValidationError(`The 'UoM' property is required, provide a valid value`);
        }
        if (entity.Price === null || entity.Price === undefined) {
            throw new ValidationError(`The 'Price' property is required, provide a valid value`);
        }
        for (const next of validationModules) {
            next.validate(entity);
        }
    }

}
