import { PartialType } from '@nestjs/swagger';
import { CreateDepartmentTypeDto } from './create-department-type.dto';

export class UpdateDepartmentTypeDto extends PartialType(CreateDepartmentTypeDto) { }
