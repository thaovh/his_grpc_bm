# Field Mapping Analysis: HIS_EMPLOYEE → User & UserProfile

## Fields từ SQL Query (HIS_EMPLOYEE)

| HIS_EMPLOYEE Field | Type | Current Mapping | Status | Notes |
|-------------------|------|----------------|--------|-------|
| ACS_ID | number | User.acsId | ✅ Mapped | |
| USER_NAME (LOGINNAME) | string | User.username | ✅ Mapped | |
| TDL_EMAIL | string | User.email | ✅ Mapped | |
| TDL_MOBILE | string | UserProfile.phone | ✅ Mapped | |
| DOB | date | UserProfile.dateOfBirth | ✅ Mapped | |
| DIPLOMA | string | ❌ Missing | ⚠️ Need | Bằng cấp |
| IS_DOCTOR | number | ❌ Missing | ⚠️ Need | Có phải bác sĩ không |
| IS_ADMIN | number | ❌ Missing | ⚠️ Need | Có phải admin không |
| DEPARTMENT_ID | number | ❌ Missing | ⚠️ Need | ID phòng ban |
| DEFAULT_MEDI_STOCK_IDS | string | ❌ Missing | ⚠️ Need | ID kho thuốc mặc định (có thể JSON) |
| IS_NURSE | number | ❌ Missing | ⚠️ Need | Có phải y tá không |
| TITLE | string | ❌ Missing | ⚠️ Need | Chức danh |
| MAX_SERVICE_REQ_PER_DAY | number | ❌ Missing | ⚠️ Need | Số lượng yêu cầu dịch vụ tối đa/ngày |
| SOCIAL_INSURANCE_NUMBER | string | ❌ Missing | ⚠️ Need | Số bảo hiểm xã hội |
| DO_NOT_ALLOW_SIMULTANEITY | number | ❌ Missing | ⚠️ Need | Không cho phép đồng thời |
| GENDER_ID | number | ❌ Missing | ⚠️ Need | ID giới tính |
| ETHNIC_CODE | string | ❌ Missing | ⚠️ Need | Mã dân tộc |
| DIPLOMA_DATE | date | ❌ Missing | ⚠️ Need | Ngày cấp bằng |
| DIPLOMA_PLACE | string | ❌ Missing | ⚠️ Need | Nơi cấp bằng |
| IDENTIFICATION_NUMBER | string | ❌ Missing | ⚠️ Need | Số CMND/CCCD |
| BRANCH_ID | number | ❌ Missing | ⚠️ Need | ID chi nhánh |
| CAREER_TITLE_ID | number | ❌ Missing | ⚠️ Need | ID chức danh nghề nghiệp |

## Recommendation

Bổ sung các fields quan trọng vào **UserProfile** entity:
1. **Thông tin nghề nghiệp**: diploma, title, isDoctor, isNurse, careerTitleId
2. **Thông tin tổ chức**: departmentId, branchId
3. **Thông tin cá nhân**: genderId, ethnicCode, identificationNumber, socialInsuranceNumber
4. **Cấu hình**: maxServiceReqPerDay, defaultMediStockIds, doNotAllowSimultaneity, isAdmin
5. **Bằng cấp**: diplomaDate, diplomaPlace

