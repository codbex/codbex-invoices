import { Controller, Get, Post, Put, Delete, Documentation, request, response } from '@aerokit/sdk/http'
import { HttpUtils } from "@aerokit/sdk/http/utils";
import { ValidationError } from '@aerokit/sdk/http/errors'
import { ForbiddenError } from '@aerokit/sdk/http/errors'
import { user } from '@aerokit/sdk/security'
import { Options } from '@aerokit/sdk/db'
import { Extensions } from "@aerokit/sdk/extensions"
import { Injected, Inject } from '@aerokit/sdk/component'
import { SalesInvoiceItemRepository } from '../../data/SalesInvoice/SalesInvoiceItemRepository'
import { SalesInvoiceItemEntity } from '../../data/SalesInvoice/SalesInvoiceItemEntity'

const validationModules = await Extensions.loadExtensionModules('codbex-invoices-SalesInvoice-SalesInvoiceItem', ['validate']);

@Controller
@Documentation('codbex-invoices - SalesInvoiceItem Controller')
@Injected()
class SalesInvoiceItemController {

    @Inject('SalesInvoiceItemRepository')
    private readonly repository!: SalesInvoiceItemRepository;

    @Get('/')
    @Documentation('Get All SalesInvoiceItem')
    public getAll(_: any, ctx: any): SalesInvoiceItemEntity[] {
        try {
            this.checkPermissions('read');
            const options: Options = {
                limit: ctx.queryParameters["$limit"] ? parseInt(ctx.queryParameters["$limit"]) : 20,
                offset: ctx.queryParameters["$offset"] ? parseInt(ctx.queryParameters["$offset"]) : 0,
                language: request.getLocale().slice(0, 2)
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
        return undefined as any;
    }

    @Post('/')
    @Documentation('Create SalesInvoiceItem')
    public create(entity: SalesInvoiceItemEntity): SalesInvoiceItemEntity {
        try {
            this.checkPermissions('write');
            this.validateEntity(entity);
            entity.Id = this.repository.create(entity) as any;
            response.setHeader('Content-Location', '/services/ts/codbex-invoices/gen/codbex-invoices/api/SalesInvoice/SalesInvoiceItemService.ts/' + entity.Id);
            response.setStatus(response.CREATED);
            return entity;
        } catch (error: any) {
            this.handleError(error);
        }
        return undefined as any;
    }

    @Get('/count')
    @Documentation('Count SalesInvoiceItem')
    public count(): { count: number } {
        try {
            this.checkPermissions('read');
            return { count: this.repository.count() };
        } catch (error: any) {
            this.handleError(error);
        }
        return undefined as any;
    }

    @Post('/count')
    @Documentation('Count SalesInvoiceItem with filter')
    public countWithFilter(filter: any): { count: number } {
        try {
            this.checkPermissions('read');
            return { count: this.repository.count(filter) };
        } catch (error: any) {
            this.handleError(error);
        }
        return undefined as any;
    }

    @Post('/search')
    @Documentation('Search SalesInvoiceItem')
    public search(filter: any): SalesInvoiceItemEntity[] {
        try {
            this.checkPermissions('read');
            return this.repository.findAll(filter);
        } catch (error: any) {
            this.handleError(error);
        }
        return undefined as any;
    }

    @Get('/:id')
    @Documentation('Get SalesInvoiceItem by id')
    public getById(_: any, ctx: any): SalesInvoiceItemEntity {
        try {
            this.checkPermissions('read');
            const id = parseInt(ctx.pathParameters.id);
            const options: Options = {
                language: request.getLocale().slice(0, 2)
            };
            const entity = this.repository.findById(id, options);
            if (entity) {
                return entity;
            } else {
                HttpUtils.sendResponseNotFound('SalesInvoiceItem not found');
            }
        } catch (error: any) {
            this.handleError(error);
        }
        return undefined as any;
    }

    @Put('/:id')
    @Documentation('Update SalesInvoiceItem by id')
    public update(entity: SalesInvoiceItemEntity, ctx: any): SalesInvoiceItemEntity {
        try {
            this.checkPermissions('write');
            const id = parseInt(ctx.pathParameters.id);
            entity.Id = id;
            this.validateEntity(entity);
            this.repository.update(entity);
            return entity;
        } catch (error: any) {
            this.handleError(error);
        }
        return undefined as any;
    }

    @Delete('/:id')
    @Documentation('Delete SalesInvoiceItem by id')
    public deleteById(_: any, ctx: any): void {
        try {
            this.checkPermissions('write');
            const id = parseInt(ctx.pathParameters.id);
            const entity = this.repository.findById(id);
            if (entity) {
                this.repository.deleteById(id);
                HttpUtils.sendResponseNoContent();
            } else {
                HttpUtils.sendResponseNotFound('SalesInvoiceItem not found');
            }
        } catch (error: any) {
            this.handleError(error);
        }
    }

    private handleError(error: any) {
        if (error.name === 'ForbiddenError') {
            HttpUtils.sendForbiddenRequest(error.message);
        } else if (error.name === 'ValidationError') {
            HttpUtils.sendResponseBadRequest(error.message);
        } else {
            HttpUtils.sendInternalServerError(error.message);
        }
    }

    private checkPermissions(operationType: string) {
        if (operationType === 'read' && !(user.isInRole('codbex-invoices.salesinvoice.SalesInvoiceItemReadOnly') || user.isInRole('codbex-invoices.salesinvoice.SalesInvoiceItemFullAccess'))) {
            throw new ForbiddenError();
        }
        if (operationType === 'write' && !user.isInRole('codbex-invoices.salesinvoice.SalesInvoiceItemFullAccess')) {
            throw new ForbiddenError();
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
