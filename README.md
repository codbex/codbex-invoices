# <img src="https://www.codbex.com/icon.svg" width="32" style="vertical-align: middle;"> codbex-invoices

## 📖 Table of Contents
* [🗺️ Entity Data Model (EDM)](#️-entity-data-model-edm)
* [🧩 Core Entities](#-core-entities)
* [📦 Dependencies](#-dependencies)
* [🔗 Sample Data Modules](#-sample-data-modules)
* [🐳 Local Development with Docker](#-local-development-with-docker)

## 🗺️ Entity Data Model (EDM)

![model](images/modell.png)

## 🧩 Core Entities

### Entity: `SalesInvoice`

| Field         | Type      | Details                      | Description            |
| ------------- | --------- | ---------------------------- | ---------------------- |
| Id            | INTEGER   | PK, Identity                 | Unique identifier.     |
| Number        | VARCHAR   | Length: 20, Unique, Nullable | Invoice number.        |
| Type          | INTEGER   | FK, Not Null                           | Invoice type.          |
| Customer      | INTEGER   | FK, Not Null                            | Reference to customer. |
| Date          | DATE      | Not Null                              | Invoice date.          |
| Due           | DATE      | Not Null                              | Due date.              |
| Net           | DECIMAL   | Precision: 16, Scale: 2, Not Null       | Net amount.            |
| Currency      | INTEGER   | FK, Not Null                            | Currency reference.    |
| Gross         | DECIMAL   | Precision: 16, Scale: 2, Not Null       | Gross amount.          |
| Discount      | DECIMAL   | Default: 0, Not Null                    | Discount.              |
| Taxes         | DECIMAL   | Default: 0, Not Null                    | Additional taxes.      |
| Vat           | DECIMAL   | Precision: 16, Scale: 2, Not Null       | VAT amount.            |
| Total         | DECIMAL   | Default: 0, Not Null                    | Total amount.          |
| Paid          | DECIMAL   | Default: 0, Not Null                    | Paid amount.           |
| Conditions    | VARCHAR   | Length: 200, Nullable        | Conditions.            |
| PaymentMethod | INTEGER   | FK, Nullable                 | Payment method.        |
| SentMethod    | INTEGER   | FK, Nullable                 | Sending method.        |
| Status        | INTEGER   | FK, Not Null                            | Invoice status.        |
| Operator      | INTEGER   | FK, Not Null                            | Responsible employee.  |
| DocumentLink  | VARCHAR   | Length: 1000, Not Null                  | Document link.         |
| Company       | INTEGER   | FK, Not Null                            | Company reference.     |
| Name          | VARCHAR   | Calculated, Length: 200                  | Name.                  |
| UUID          | VARCHAR   | Calculated, Length: 36, Unique           | UUID.                  |
| Process       | VARCHAR   | Length: 36, Nullable         | Process reference.     |
| Reference     | VARCHAR   | Length: 100, Nullable        | External reference.    |
| CreatedAt     | TIMESTAMP | Audit, Nullable                     | Created at.            |
| CreatedBy     | VARCHAR   | Audit, Length: 20, Nullable         | Created by.            |
| UpdatedAt     | TIMESTAMP | Audit, Nullable                     | Updated at.            |
| UpdatedBy     | VARCHAR   | Audit, Length: 20, Nullable         | Updated by.            |

### Entity `SalesInvoiceItem`

| Field        | Type      | Details                 | Description           |
| ------------ | --------- | ----------------------- | --------------------- |
| Id           | INTEGER   | PK, Identity            | Unique identifier.    |
| SalesInvoice | INTEGER   | FK,  Not Null                      | Reference to invoice. |
| Name         | VARCHAR   | Length: 300,  Not Null             | Item name.            |
| Quantity     | DOUBLE    | Not Null                       | Quantity.             |
| Uom          | INTEGER   | FK,  Not Null                      | Unit of measure.      |
| Price        | DECIMAL   | Precision: 16, Scale: 2,  Not Null | Unit price.           |
| Net          | DECIMAL   | Calculated, Precision: 16, Scale: 2 | Net amount.           |
| VatRate      | DECIMAL   | Default: 20,  Not Null             | VAT rate.             |
| Vat          | DECIMAL   | Calculated, Precision: 16, Scale: 2 | VAT amount.           |
| Gross        | DECIMAL   | Calculated, Precision: 16, Scale: 2 | Gross amount.         |
| CreatedAt    | TIMESTAMP | Audit, Nullable                | Created at.           |
| CreatedBy    | VARCHAR   | Audit, Length: 20, Nullable    | Created by.           |
| UpdatedAt    | TIMESTAMP | Audit, Nullable                | Updated at.           |
| UpdatedBy    | VARCHAR   | Audit, Length: 20, Nullable    | Updated by.           |

### Entity `PurchaseInvoice`

| Field               | Type      | Details                      | Description              |
| ------------------- | --------- | ---------------------------- | ------------------------ |
| Id                  | INTEGER   | PK, Identity                 | Unique identifier.       |
| Number              | VARCHAR   | Length: 20, Unique, Nullable | Internal number.         |
| OriginalNumber      | VARCHAR   | Length: 20, Not Null                   | Supplier invoice number. |
| PurchaseInvoiceType | INTEGER   | FK, Not Null                           | Invoice type.            |
| Date                | DATE      | Not Null                             | Invoice date.            |
| Due                 | DATE      | Not Null                             | Due date.                |
| Supplier            | INTEGER   | FK, Not Null                           | Supplier reference.      |
| Net                 | DECIMAL   | Precision: 16, Scale: 2, Not Null      | Net amount.              |
| Currency            | INTEGER   | FK, Not Null                           | Currency reference.      |
| Gross               | DECIMAL   | Precision: 16, Scale: 2, Not Null      | Gross amount.            |
| Discount            | DECIMAL   | Default: 0, Not Null                   | Discount.                |
| Taxes               | DECIMAL   | Default: 0, Not Null                   | Taxes.                   |
| Vat                 | DECIMAL   | Precision: 16, Scale: 2, Not Null      | VAT.                     |
| Total               | DECIMAL   | Default: 0, Not Null                   | Total.                   |
| Paid                | DECIMAL   | Default: 0, Not Null                   | Paid.                    |
| Conditions          | VARCHAR   | Length: 200, Nullable        | Conditions.              |
| PaymentMethod       | INTEGER   | FK, Nullable                 | Payment method.          |
| SentMethod          | INTEGER   | FK, Nullable                 | Sending method.          |
| Status              | INTEGER   | FK, Not Null                           | Status.                  |
| Operator            | INTEGER   | FK, Not Null                          | Responsible employee.    |
| DocumentLink        | VARCHAR   | Length: 1000, Not Null                 | Document link.           |
| Company             | INTEGER   | FK, Nullable                 | Company reference.       |
| Name                | VARCHAR   | Calculated, Length: 200                  | Name.                    |
| UUID                | VARCHAR   | Calculated, Length: 36, Unique           | UUID.                    |
| Process             | VARCHAR   | Length: 36, Nullable         | Process.                 |
| Reference           | VARCHAR   | Length: 36, Nullable         | Reference.               |
| CreatedAt           | TIMESTAMP | Audit, Nullable                     | Created at.              |
| CreatedBy           | VARCHAR   | Audit, Length: 20, Nullable         | Created by.              |
| UpdatedAt           | TIMESTAMP | Audit, Nullable                     | Updated at.              |
| UpdatedBy           | VARCHAR   | Audit, Length: 20, Nullable         | Updated by.              |

### Entity `PurchaseInvoiceItem`

| Field           | Type      | Details                           | Description           |
| --------------- | --------- | --------------------------------- | --------------------- |
| Id              | INTEGER   | PK, Identity                      | Unique identifier.    |
| PurchaseInvoice | INTEGER   | FK, Not Null                                | Reference to invoice. |
| Name            | VARCHAR   | Length: 300, Not Null                       | Item name.            |
| Quantity        | DOUBLE    | Not Null                                 | Quantity.             |
| Uom             | INTEGER   | FK, Not Null                                | Unit of measure.      |
| Price           | DECIMAL   | Precision: 16, Scale: 2, Not Null           | Price.                |
| Net             | DECIMAL   | Calculated, Precision: 16, Scale: 2, Nullable | Net.                  |
| VatRate         | DECIMAL   | Default: 20, Not Null                       | VAT rate.             |
| Vat             | DECIMAL   | Calculated, Precision: 16, Scale: 2, Nullable | VAT.                  |
| Gross           | DECIMAL   | Calculated, Precision: 16, Scale: 2, Nullable | Gross.                |
| CreatedAt       | TIMESTAMP | Audit, Nullable                          | Created at.           |
| CreatedBy       | VARCHAR   | Audit, Length: 20, Nullable              | Created by.           |
| UpdatedAt       | TIMESTAMP | Audit, Nullable                          | Updated at.           |
| UpdatedBy       | VARCHAR   | Audit, Length: 20, Nullable              | Updated by.           |

### Entity `SalesInvoiceStatus`

| Field | Type    | Details      | Description        |
| ----- | ------- | ------------ | ------------------ |
| Id    | INTEGER | PK, Identity | Unique identifier. |
| Name  | VARCHAR | Length: 20, Not Null   | Status name.       |

### Entity `PurchaseInvoiceStatus`

| Field | Type    | Details      | Description        |
| ----- | ------- | ------------ | ------------------ |
| Id    | INTEGER | PK, Identity | Unique identifier. |
| Name  | VARCHAR | Length: 20, Not Null   | Status name.       |

### Entity `SalesInvoicePayment`

| Field           | Type      | Details                 | Description                 |
| --------------- | --------- | ----------------------- | --------------------------- |
| Id              | INTEGER   | PK, Identity            | Unique identifier.          |
| SalesInvoice    | INTEGER   | FK, Nullable            | Invoice reference.          |
| CustomerPayment | INTEGER   | FK, Nullable            | Customer payment reference. |
| Amount          | DECIMAL   | Precision: 16, Scale: 2, Not Null  | Amount applied.             |
| CreatedAt       | TIMESTAMP | Audit, Nullable                | Created at.                 |
| CreatedBy       | VARCHAR   | Audit, Length: 20, Nullable    | Created by.                 |
| UpdatedAt       | TIMESTAMP | Audit, Nullable                | Updated at.                 |
| UpdatedBy       | VARCHAR   | Audit, Length: 20, Nullable    | Updated by.                 |

### Entity `PurchaseInvoicePayment`

| Field           | Type      | Details                 | Description                 |
| --------------- | --------- | ----------------------- | --------------------------- |
| Id              | INTEGER   | PK, Identity            | Unique identifier.          |
| PurchaseInvoice | INTEGER   | FK, Nullable            | Invoice reference.          |
| SupplierPayment | INTEGER   | FK, Nullable            | Supplier payment reference. |
| Amount          | DECIMAL   | Precision: 16, Scale: 2, Not Null  | Amount applied.             |
| CreatedAt       | TIMESTAMP | Audit, Nullable                | Created at.                 |
| CreatedBy       | VARCHAR   | Audit, Length: 20, Nullable    | Created by.                 |
| UpdatedAt       | TIMESTAMP | Audit, Nullable                | Updated at.                 |
| UpdatedBy       | VARCHAR   | Audit, Length: 20, Nullable    | Updated by.                 |

### Entity `SalesInvoiceType`

| Field     | Type    | Details      | Description        |
| --------- | ------- | ------------ | ------------------ |
| Id        | INTEGER | PK, Identity | Unique identifier. |
| Name      | VARCHAR | Length: 20,  Not Null   | Type name.         |
| Direction | INTEGER | FK,  Not Null           | Payment direction. |

### Entity `PurchaseInvoiceType`

| Field     | Type    | Details      | Description        |
| --------- | ------- | ------------ | ------------------ |
| Id        | INTEGER | PK, Identity | Unique identifier. |
| Name      | VARCHAR | Length: 20,  Not Null   | Type name.         |
| Direction | INTEGER | FK,  Not Null           | Payment direction. |

### Entity `Deduction`

| Field            | Type    | Details      | Description                  |
| ---------------- | ------- | ------------ | ---------------------------- |
| Id               | INTEGER | PK, Identity | Unique identifier.           |
| DeductionInvoice | INTEGER | FK, Nullable | Deduction invoice reference. |
| AdvanceInvoice   | INTEGER | FK, Nullable | Advance invoice reference.   |

## 📦 Dependencies

- [codbex-countries](https://github.com/codbex/codbex-countries)
- [codbex-companies](https://github.com/codbex/codbex-companies)
- [codbex-currencies](https://github.com/codbex/codbex-currencies)
- [codbex-uoms](https://github.com/codbex/codbex-uoms)
- [codbex-partners](https://github.com/codbex/codbex-partners)
- [codbex-methods](https://github.com/codbex/codbex-methods)
- [codbex-employees](https://github.com/codbex/codbex-employees)
- [codbex-payments](https://github.com/codbex/codbex-payments)
- [codbex-navigation-groups](https://github.com/codbex/codbex-navigation-groups)
- [codbex-number-generato](https://github.com/codbex/codbex-number-generato)
- [codbex-number-generator-data](https://github.com/codbex/codbex-number-generator-data)

## 🔗 Sample Data Modules

- [codbex-invoices-data](https://github.com/codbex/codbex-invoices-data)

## 🐳 Local Development with Docker

When running this project inside the codbex Atlas Docker image, you must provide authentication for installing dependencies from GitHub Packages.
1. Create a GitHub Personal Access Token (PAT) with `read:packages` scope.
2. Pass `NPM_TOKEN` to the Docker container:

    ```
    docker run \
    -e NPM_TOKEN=<your_github_token> \
    --rm -p 80:80 \
    ghcr.io/codbex/codbex-atlas:latest
    ```

⚠️ **Notes**
- The `NPM_TOKEN` must be available at container runtime.
- This is required even for public packages hosted on GitHub Packages.
- Never bake the token into the Docker image or commit it to source control.
