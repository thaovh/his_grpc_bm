import { PartialType, OmitType } from '@nestjs/swagger';
import { CreateAppFeatureDto } from './create-app-feature.dto';

export class UpdateAppFeatureDto extends PartialType(
    OmitType(CreateAppFeatureDto, ['code', 'createdBy'] as const)
) {
    // All fields from CreateAppFeatureDto except 'code' and 'createdBy' are optional
    // 'code' cannot be changed after creation
    // 'createdBy' is set on creation only
}
