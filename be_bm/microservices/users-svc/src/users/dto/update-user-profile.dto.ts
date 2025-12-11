export class UpdateUserProfileDto {
  readonly firstName?: string;
  readonly lastName?: string;
  readonly phone?: string;
  readonly avatarUrl?: string;
  readonly bio?: string;
  readonly dateOfBirth?: Date;
  readonly address?: string;
  // HIS Employee fields
  readonly diploma?: string;
  readonly isDoctor?: number;
  readonly isNurse?: number;
  readonly title?: string;
  readonly careerTitleId?: number;
  readonly departmentId?: number;
  readonly branchId?: number;
  readonly defaultMediStockIds?: string;
  readonly genderId?: number;
  readonly ethnicCode?: string;
  readonly identificationNumber?: string;
  readonly socialInsuranceNumber?: string;
  readonly diplomaDate?: Date;
  readonly diplomaPlace?: string;
  readonly maxServiceReqPerDay?: number;
  readonly doNotAllowSimultaneity?: number;
  readonly isAdmin?: number;
}

