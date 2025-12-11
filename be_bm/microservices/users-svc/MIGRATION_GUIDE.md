# Migration Guide: Add HIS Employee Fields

## Vấn đề

TypeORM đang gặp lỗi khi cố gắng drop guard column `SYS_NC00018$` của Oracle:
```
ORA-14148: DML and DDL operations are not directly allowed on the guard-column.
```

## Giải pháp

Tắt `synchronize` và chạy migration SQL thủ công.

## Các bước thực hiện

### 1. Tắt synchronize (Đã thực hiện)
File: `microservices/users-svc/src/database/database.module.ts`
- `synchronize: false` đã được set

### 2. Chạy migration SQL

Kết nối vào Oracle database và chạy file:
```bash
sqlplus HXT_RS/password@host:port/service_name
@microservices/users-svc/migrations/add-his-employee-fields.sql
```

Hoặc copy nội dung file `add-his-employee-fields.sql` và chạy trong SQL client.

### 3. Verify migration

Kiểm tra các columns đã được thêm:
```sql
SELECT COLUMN_NAME, DATA_TYPE, DATA_LENGTH, NULLABLE, DATA_DEFAULT
FROM ALL_TAB_COLUMNS
WHERE OWNER = 'HXT_RS'
  AND TABLE_NAME = 'USR_USER_PROFILES'
  AND COLUMN_NAME IN (
    'DIPLOMA', 'IS_DOCTOR', 'IS_NURSE', 'TITLE', 'CAREER_TITLE_ID',
    'DEPARTMENT_ID', 'BRANCH_ID', 'DEFAULT_MEDI_STOCK_IDS',
    'GENDER_ID', 'ETHNIC_CODE', 'IDENTIFICATION_NUMBER', 'SOCIAL_INSURANCE_NUMBER',
    'DIPLOMA_DATE', 'DIPLOMA_PLACE',
    'MAX_SERVICE_REQ_PER_DAY', 'DO_NOT_ALLOW_SIMULTANEITY', 'IS_ADMIN'
  )
ORDER BY COLUMN_NAME;
```

### 4. Restart service

Sau khi migration thành công, restart `users-svc`:
```bash
cd microservices/users-svc
npm run start:dev
```

## Lưu ý

- **Không bật lại synchronize** cho đến khi giải quyết được vấn đề guard column
- Sử dụng migrations thủ công cho các thay đổi schema trong tương lai
- Backup database trước khi chạy migration

## Rollback (nếu cần)

Nếu cần rollback, chạy:
```sql
ALTER TABLE USR_USER_PROFILES DROP (
  DIPLOMA, IS_DOCTOR, IS_NURSE, TITLE, CAREER_TITLE_ID,
  DEPARTMENT_ID, BRANCH_ID, DEFAULT_MEDI_STOCK_IDS,
  GENDER_ID, ETHNIC_CODE, IDENTIFICATION_NUMBER, SOCIAL_INSURANCE_NUMBER,
  DIPLOMA_DATE, DIPLOMA_PLACE,
  MAX_SERVICE_REQ_PER_DAY, DO_NOT_ALLOW_SIMULTANEITY, IS_ADMIN
);
```

