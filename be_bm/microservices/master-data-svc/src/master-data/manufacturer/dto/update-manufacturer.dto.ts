import { PartialType } from '@nestjs/mapped-types';
import { CreateManufacturerDto } from './create-manufacturer.dto';
import { IsString, IsOptional, IsNotEmpty } from 'class-validator';

export class UpdateManufacturerDto extends PartialType(CreateManufacturerDto) {
    @IsString()
    @IsNotEmpty()
    id: string;

    @IsString()
    @IsOptional()
    updatedBy?: string;
}
