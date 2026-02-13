import { Controller, Get, Post, Put, Delete, Documentation, request, response } from '@aerokit/sdk/http'
import { HttpUtils } from "@aerokit/sdk/http/utils";
import { ValidationError } from '@aerokit/sdk/http/errors'
import { ForbiddenError } from '@aerokit/sdk/http/errors'
import { user } from '@aerokit/sdk/security'
import { Options } from '@aerokit/sdk/db'
import { Extensions } from "@aerokit/sdk/extensions"
import { Injected, Inject } from '@aerokit/sdk/component'
import { SalesInvoiceTypeRepository } from '../../data/Settings/SalesInvoiceTypeRepository'
import { SalesInvoiceTypeEntity } from '../../data/Settings/SalesInvoiceTypeEntity'

const validationModules = await Extensions.loadExtensionModules('codbex-invoices-Settings-SalesInvoiceType', ['validate']);

@Controller
@Documentation('codbex-invoices - SalesInvoiceType Controller')
@Injected()
class SalesInvoiceTypeController {

    @Inject('SalesInvoiceTypeRepository')
    private readonly repository!: SalesInvoiceTypeRepository;

    @Get('/')
    @Documentation('Get All SalesInvoiceType')
    public getAll(_: any, ctx: any): SalesInvoiceTypeEntity[] {
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
    @Documentation('Create SalesInvoiceType')
    public create(entity: SalesInvoiceTypeEntity): SalesInvoiceTypeEntity {
        try {
            this.checkPermissions('write');
            this.validateEntity(entity);
            entity.Id = this.repository.create(entity) as any;
            response.setHeader('Content-Location', '/services/ts/codbex-invoices/gen/codbex-invoices/api/Settings/SalesInvoiceTypeService.ts/' + entity.Id);
            response.setStatus(response.CREATED);
            return entity;
        } catch (error: any) {
            this.handleError(error);
        }
        return undefined as any;
    }

    @Get('/count')
    @Documentation('Count SalesInvoiceType')
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
    @Documentation('Count SalesInvoiceType with filter')
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
    @Documentation('Search SalesInvoiceType')
    public search(filter: any): SalesInvoiceTypeEntity[] {
        try {
            this.checkPermissions('read');
            return this.repository.findAll(filter);
        } catch (error: any) {
            this.handleError(error);
        }
        return undefined as any;
    }

    @Get('/:id')
    @Documentation('Get SalesInvoiceType by id')
    public getById(_: any, ctx: any): SalesInvoiceTypeEntity {
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
                HttpUtils.sendResponseNotFound('SalesInvoiceType not found');
            }
        } catch (error: any) {
            this.handleError(error);
        }
        return undefined as any;
    }

    @Put('/:id')
    @Documentation('Update SalesInvoiceType by id')
    public update(entity: SalesInvoiceTypeEntity, ctx: any): SalesInvoiceTypeEntity {
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
    @Documentation('Delete SalesInvoiceType by id')
    public deleteById(_: any, ctx: any): void {
        try {
            this.checkPermissions('write');
            const id = parseInt(ctx.pathParameters.id);
            const entity = this.repository.findById(id);
            if (entity) {
                this.repository.deleteById(id);
                HttpUtils.sendResponseNoContent();
            } else {
                HttpUtils.sendResponseNotFound('SalesInvoiceType not found');
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
        if (operationType === 'read' && !(user.isInRole('codbex-invoices.settings.SalesInvoiceTypeReadOnly') || user.isInRole('codbex-invoices.settings.SalesInvoiceTypeFullAccess'))) {
            throw new ForbiddenError();
        }
        if (operationType === 'write' && !user.isInRole('codbex-invoices.settings.SalesInvoiceTypeFullAccess')) {
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
