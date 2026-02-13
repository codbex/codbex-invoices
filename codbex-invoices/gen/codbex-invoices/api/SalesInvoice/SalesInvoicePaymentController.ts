import { Controller, Get, Post, Put, Delete, Documentation, request, response } from '@aerokit/sdk/http'
import { HttpUtils } from "@aerokit/sdk/http/utils";
import { ValidationError } from '@aerokit/sdk/http/errors'
import { ForbiddenError } from '@aerokit/sdk/http/errors'
import { user } from '@aerokit/sdk/security'
import { Options } from '@aerokit/sdk/db'
import { Extensions } from "@aerokit/sdk/extensions"
import { Injected, Inject } from '@aerokit/sdk/component'
import { SalesInvoicePaymentRepository } from '../../data/SalesInvoice/SalesInvoicePaymentRepository'
import { SalesInvoicePaymentEntity } from '../../data/SalesInvoice/SalesInvoicePaymentEntity'

const validationModules = await Extensions.loadExtensionModules('codbex-invoices-SalesInvoice-SalesInvoicePayment', ['validate']);

@Controller
@Documentation('codbex-invoices - SalesInvoicePayment Controller')
@Injected()
class SalesInvoicePaymentController {

    @Inject('SalesInvoicePaymentRepository')
    private readonly repository!: SalesInvoicePaymentRepository;

    @Get('/')
    @Documentation('Get All SalesInvoicePayment')
    public getAll(_: any, ctx: any): SalesInvoicePaymentEntity[] {
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
    @Documentation('Create SalesInvoicePayment')
    public create(entity: SalesInvoicePaymentEntity): SalesInvoicePaymentEntity {
        try {
            this.checkPermissions('write');
            this.validateEntity(entity);
            entity.Id = this.repository.create(entity) as any;
            response.setHeader('Content-Location', '/services/ts/codbex-invoices/gen/codbex-invoices/api/SalesInvoice/SalesInvoicePaymentService.ts/' + entity.Id);
            response.setStatus(response.CREATED);
            return entity;
        } catch (error: any) {
            this.handleError(error);
        }
        return undefined as any;
    }

    @Get('/count')
    @Documentation('Count SalesInvoicePayment')
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
    @Documentation('Count SalesInvoicePayment with filter')
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
    @Documentation('Search SalesInvoicePayment')
    public search(filter: any): SalesInvoicePaymentEntity[] {
        try {
            this.checkPermissions('read');
            return this.repository.findAll(filter);
        } catch (error: any) {
            this.handleError(error);
        }
        return undefined as any;
    }

    @Get('/:id')
    @Documentation('Get SalesInvoicePayment by id')
    public getById(_: any, ctx: any): SalesInvoicePaymentEntity {
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
                HttpUtils.sendResponseNotFound('SalesInvoicePayment not found');
            }
        } catch (error: any) {
            this.handleError(error);
        }
        return undefined as any;
    }

    @Put('/:id')
    @Documentation('Update SalesInvoicePayment by id')
    public update(entity: SalesInvoicePaymentEntity, ctx: any): SalesInvoicePaymentEntity {
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
    @Documentation('Delete SalesInvoicePayment by id')
    public deleteById(_: any, ctx: any): void {
        try {
            this.checkPermissions('write');
            const id = parseInt(ctx.pathParameters.id);
            const entity = this.repository.findById(id);
            if (entity) {
                this.repository.deleteById(id);
                HttpUtils.sendResponseNoContent();
            } else {
                HttpUtils.sendResponseNotFound('SalesInvoicePayment not found');
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
        if (operationType === 'read' && !(user.isInRole('codbex-invoices.salesinvoice.SalesInvoicePaymentReadOnly') || user.isInRole('codbex-invoices.salesinvoice.SalesInvoicePaymentFullAccess'))) {
            throw new ForbiddenError();
        }
        if (operationType === 'write' && !user.isInRole('codbex-invoices.salesinvoice.SalesInvoicePaymentFullAccess')) {
            throw new ForbiddenError();
        }
    }

    private validateEntity(entity: any): void {
        if (entity.Amount === null || entity.Amount === undefined) {
            throw new ValidationError(`The 'Amount' property is required, provide a valid value`);
        }
        for (const next of validationModules) {
            next.validate(entity);
        }
    }

}
