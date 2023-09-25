# Docker descriptor for codbex-invoices
# License - http://www.eclipse.org/legal/epl-v20.html

FROM ghcr.io/codbex/codbex-gaia:0.13.0

COPY codbex-invoices target/dirigible/repository/root/registry/public/codbex-invoices
COPY codbex-invoices-data target/dirigible/repository/root/registry/public/codbex-invoices-data

ENV DIRIGIBLE_HOME_URL=/services/web/codbex-invoices/gen/index.html
