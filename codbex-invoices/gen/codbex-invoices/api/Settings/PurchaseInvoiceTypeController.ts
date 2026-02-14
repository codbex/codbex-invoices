import { Controller, Get, Post, Put, Delete, Documentation, request, response } from '@aerokit/sdk/http'
import { HttpUtils } from "@aerokit/sdk/http/utils";
import { ValidationError } from '@aerokit/sdk/http/errors'
import { ForbiddenError } from '@aerokit/sdk/http/errors'
import { user } from '@aerokit/sdk/security'
import { Options } from '@aerokit/sdk/db'
import { Extensions } from "@aerokit/sdk/extensions"
import { Injected, Inject } from '@aerokit/sdk/component'
import { PurchaseInvoiceTypeRepository } from '../../data/Settings/PurchaseInvoiceTypeRepository'
import { PurchaseInvoiceTypeEntity } from '../../data/Settings/PurchaseInvoiceTypeEntity'

const validationModules = await Extensions.loadExtensionModules('codbex-invoices-Settings-PurchaseInvoiceType', ['validate']);

@Controller
@Documentation('codbex-invoices - PurchaseInvoiceType Controller')
@Injected()
class PurchaseInvoiceTypeController {

    @Inject('PurchaseInvoiceTypeRepository')
    private readonly repository!: PurchaseInvoiceTypeRepository;

    @Get('/')
    @Documentation('Get All PurchaseInvoiceType')
    public getAll(_: any, ctx: any): PurchaseInvoiceTypeEntity[] {
        try {
            this.checkPermissions('read');
            const options: Options = {
                limit: ctx.queryParameters["$limit"] ? parseInt(ctx.queryParameters["$limit"]) : 20,
                offset: ctx.queryParameters["$offset"] ? parseInt(ctx.queryParameters["$offset"]) : 0,
                language: request.getLocale().slice(0, 2)
            };

            return this.repository.findAll(options);
        } catch (error: any) {
            this.handleError(error);
        }
        return undefined as any;
    }

    @Post('/')
    @Documentation('Create PurchaseInvoiceType')
    public create(entity: PurchaseInvoiceTypeEntity): PurchaseInvoiceTypeEntity {
        try {
            this.checkPermissions('write');
            this.validateEntity(entity);
            entity.Id = this.repository.create(entity) as any;
            response.setHeader('Content-Location', '/services/ts/codbex-invoices/gen/codbex-invoices/api/Settings/PurchaseInvoiceTypeService.ts/' + entity.Id);
            response.setStatus(response.CREATED);
            return entity;
        } catch (error: any) {
            this.handleError(error);
        }
        return undefined as any;
    }

    @Get('/count')
    @Documentation('Count PurchaseInvoiceType')
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
    @Documentation('Count PurchaseInvoiceType with filter')
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
    @Documentation('Search PurchaseInvoiceType')
    public search(filter: any): PurchaseInvoiceTypeEntity[] {
        try {
            this.checkPermissions('read');
            return this.repository.findAll(filter);
        } catch (error: any) {
            this.handleError(error);
        }
        return undefined as any;
    }

    @Get('/:id')
    @Documentation('Get PurchaseInvoiceType by id')
    public getById(_: any, ctx: any): PurchaseInvoiceTypeEntity {
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
                HttpUtils.sendResponseNotFound('PurchaseInvoiceType not found');
            }
        } catch (error: any) {
            this.handleError(error);
        }
        return undefined as any;
    }

    @Put('/:id')
    @Documentation('Update PurchaseInvoiceType by id')
    public update(entity: PurchaseInvoiceTypeEntity, ctx: any): PurchaseInvoiceTypeEntity {
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
    @Documentation('Delete PurchaseInvoiceType by id')
    public deleteById(_: any, ctx: any): void {
        try {
            this.checkPermissions('write');
            const id = parseInt(ctx.pathParameters.id);
            const entity = this.repository.findById(id);
            if (entity) {
                this.repository.deleteById(id);
                HttpUtils.sendResponseNoContent();
            } else {
                HttpUtils.sendResponseNotFound('PurchaseInvoiceType not found');
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
        if (operationType === 'read' && !(user.isInRole('codbex-invoices.settings.PurchaseInvoiceTypeReadOnly') || user.isInRole('codbex-invoices.settings.PurchaseInvoiceTypeFullAccess'))) {
            throw new ForbiddenError();
        }
        if (operationType === 'write' && !user.isInRole('codbex-invoices.settings.PurchaseInvoiceTypeFullAccess')) {
            throw new ForbiddenError();
        }
    }

    private validateEntity(entity: any): void {
        if (entity.Name === null || entity.Name === undefined) {
            throw new ValidationError(`The 'Name' property is required, provide a valid value`);
        }
        if (entity.Name?.length > 20) {
            throw new ValidationError(`The 'Name' exceeds the maximum length of [20] characters`);
        }
        if (entity.Direction === null || entity.Direction === undefined) {
            throw new ValidationError(`The 'Direction' property is required, provide a valid value`);
        }
        for (const next of validationModules) {
            next.validate(entity);
        }
    }

}
