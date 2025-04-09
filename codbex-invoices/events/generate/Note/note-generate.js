const viewData = {
    id: 'note-generate',
    label: 'Generate Note',
    path: '/services/web/codbex-invoices/events/generate/Note/generate-note.html',
    lazyLoad: false,
    autoFocusTab: false,
    maxWidth: '320px',
    maxHeight: '182px',
    perspective: 'salesinvoice',
    view: 'SalesInvoice',
    type: 'entity',
    order: 9
};
if (typeof exports !== 'undefined') {
    exports.getView = () => viewData;
}