import { ApiProperty } from '@nestjs/swagger';
import { IsArray, IsNumber, IsOptional, ArrayMinSize } from 'class-validator';

export class BatchUpdateExportFieldsDto {
    @ApiProperty({
        description: 'Array of HIS IDs of medicine records to update',
        type: [Number],
        example: [1, 2, 3]
    })
    @IsArray()
    @ArrayMinSize(1)
    @IsNumber({}, { each: true })
    hisIds: number[];

    @ApiProperty({
        description: 'Export time (YYYYMMDDHHMMSS). Optional.',
        type: Number,
        required: false,
        example: 20251220120000
    })
    @IsOptional()
    @IsNumber()
    exportTime?: number | null;
}
