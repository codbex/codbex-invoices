import { Controller, Get, Post, Put, Delete, Documentation, request, response } from '@aerokit/sdk/http'
import { HttpUtils } from "@aerokit/sdk/http/utils";
import { ValidationError } from '@aerokit/sdk/http/errors'
import { Options } from '@aerokit/sdk/db'
import { Extensions } from "@aerokit/sdk/extensions"
import { Injected, Inject } from '@aerokit/sdk/component'
import { CustomerPaymentRepository } from '../../data/CustomerPayment/CustomerPaymentRepository'
import { CustomerPaymentEntity } from '../../data/CustomerPayment/CustomerPaymentEntity'

const validationModules = await Extensions.loadExtensionModules('codbex-invoices-CustomerPayment-CustomerPayment', ['validate']);

@Controller
@Documentation('codbex-invoices - CustomerPayment Controller')
@Injected()
class CustomerPaymentController {

    @Inject('CustomerPaymentRepository')
    private readonly repository!: CustomerPaymentRepository;

    @Get('/')
    @Documentation('Get All CustomerPayment')
    public getAll(_: any, ctx: any): CustomerPaymentEntity[] {
        try {
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
    @Documentation('Create CustomerPayment')
    public create(entity: CustomerPaymentEntity): CustomerPaymentEntity {
        try {
            this.validateEntity(entity);
            entity.Id = this.repository.create(entity) as any;
            response.setHeader('Content-Location', '/services/ts/codbex-invoices/gen/codbex-invoices/api/CustomerPayment/CustomerPaymentService.ts/' + entity.Id);
            response.setStatus(response.CREATED);
            return entity;
        } catch (error: any) {
            this.handleError(error);
        }
        return undefined as any;
    }

    @Get('/count')
    @Documentation('Count CustomerPayment')
    public count(): { count: number } {
        try {
            return { count: this.repository.count() };
        } catch (error: any) {
            this.handleError(error);
        }
        return undefined as any;
    }

    @Post('/count')
    @Documentation('Count CustomerPayment with filter')
    public countWithFilter(filter: any): { count: number } {
        try {
            return { count: this.repository.count(filter) };
        } catch (error: any) {
            this.handleError(error);
        }
        return undefined as any;
    }

    @Post('/search')
    @Documentation('Search CustomerPayment')
    public search(filter: any): CustomerPaymentEntity[] {
        try {
            return this.repository.findAll(filter);
        } catch (error: any) {
            this.handleError(error);
        }
        return undefined as any;
    }

    @Get('/:id')
    @Documentation('Get CustomerPayment by id')
    public getById(_: any, ctx: any): CustomerPaymentEntity {
        try {
            const id = parseInt(ctx.pathParameters.id);
            const options: Options = {
                language: request.getLocale().slice(0, 2)
            };
            const entity = this.repository.findById(id, options);
            if (entity) {
                return entity;
            } else {
                HttpUtils.sendResponseNotFound('CustomerPayment not found');
            }
        } catch (error: any) {
            this.handleError(error);
        }
        return undefined as any;
    }

    @Put('/:id')
    @Documentation('Update CustomerPayment by id')
    public update(entity: CustomerPaymentEntity, ctx: any): CustomerPaymentEntity {
        try {
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
    @Documentation('Delete CustomerPayment by id')
    public deleteById(_: any, ctx: any): void {
        try {
            const id = parseInt(ctx.pathParameters.id);
            const entity = this.repository.findById(id);
            if (entity) {
                this.repository.deleteById(id);
                HttpUtils.sendResponseNoContent();
            } else {
                HttpUtils.sendResponseNotFound('CustomerPayment not found');
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

    private validateEntity(entity: any): void {
        if (entity.Customer === null || entity.Customer === undefined) {
            throw new ValidationError(`The 'Customer' property is required, provide a valid value`);
        }
        if (entity.Date === null || entity.Date === undefined) {
            throw new ValidationError(`The 'Date' property is required, provide a valid value`);
        }
        if (entity.Valor === null || entity.Valor === undefined) {
            throw new ValidationError(`The 'Valor' property is required, provide a valid value`);
        }
        if (entity.CompanyIBAN?.length > 34) {
            throw new ValidationError(`The 'CompanyIBAN' exceeds the maximum length of [34] characters`);
        }
        if (entity.CounterpartyIBAN?.length > 34) {
            throw new ValidationError(`The 'CounterpartyIBAN' exceeds the maximum length of [34] characters`);
        }
        if (entity.CounterpartyName?.length > 100) {
            throw new ValidationError(`The 'CounterpartyName' exceeds the maximum length of [100] characters`);
        }
        if (entity.Amount === null || entity.Amount === undefined) {
            throw new ValidationError(`The 'Amount' property is required, provide a valid value`);
        }
        if (entity.Currency === null || entity.Currency === undefined) {
            throw new ValidationError(`The 'Currency' property is required, provide a valid value`);
        }
        if (entity.Reason === null || entity.Reason === undefined) {
            throw new ValidationError(`The 'Reason' property is required, provide a valid value`);
        }
        if (entity.Reason?.length > 100) {
            throw new ValidationError(`The 'Reason' exceeds the maximum length of [100] characters`);
        }
        if (entity.Description?.length > 100) {
            throw new ValidationError(`The 'Description' exceeds the maximum length of [100] characters`);
        }
        if (entity.Name?.length > 20) {
            throw new ValidationError(`The 'Name' exceeds the maximum length of [20] characters`);
        }
        if (entity.UUID?.length > 36) {
            throw new ValidationError(`The 'UUID' exceeds the maximum length of [36] characters`);
        }
        if (entity.Reference?.length > 36) {
            throw new ValidationError(`The 'Reference' exceeds the maximum length of [36] characters`);
        }
        for (const next of validationModules) {
            next.validate(entity);
        }
    }

}
