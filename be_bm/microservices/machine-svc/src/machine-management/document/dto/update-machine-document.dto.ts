import { PartialType } from '@nestjs/mapped-types';
import { CreateMachineDocumentDto } from './create-machine-document.dto';

export class UpdateMachineDocumentDto extends PartialType(CreateMachineDocumentDto) {
    updatedBy?: string;
}
