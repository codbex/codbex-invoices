import { SentMethodRepository as SentMethodDao } from "../../../../codbex-methods/gen/codbex-methods/dao/Methods/SentMethodRepository";

import { Controller, Get } from "sdk/http";


@Controller
class SalesInvoiceService {

    private readonly templateDao;

    constructor() {
        this.templateDao = new SentMethodDao();
    }

    @Get("/:Type")
    public salesInvoiceData(_: any, ctx: any) {
        const templateType = ctx.pathParameters.Type;

        const template = templateDao.findFirst(templateType);

        return template.content;
    }
}