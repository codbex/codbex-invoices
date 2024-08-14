const viewData = {
    id: 'note-generate',
    label: 'Generate Note',
    link: '/services/web/codbex-invoices/events/generate/Note/generate-note.html',
    perspective: 'salesinvoice',
    view: 'SalesInvoice',
    type: 'entity',
    order: 9
};

if (typeof exports !== 'undefined') {
    exports.getDialogWindow = function () {
        return viewData;
    }
}