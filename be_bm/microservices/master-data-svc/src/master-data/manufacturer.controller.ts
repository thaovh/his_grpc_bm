import { Controller } from '@nestjs/common';
import { GrpcMethod } from '@nestjs/microservices';
import { ManufacturerService } from './services/manufacturer.service';
import { CreateManufacturerDto } from './manufacturer/dto/create-manufacturer.dto';
import { UpdateManufacturerDto } from './manufacturer/dto/update-manufacturer.dto';

@Controller()
export class ManufacturerController {
    constructor(private readonly manufacturerService: ManufacturerService) { }

    @GrpcMethod('MasterDataService', 'createManufacturer')
    createManufacturer(data: CreateManufacturerDto) {
        return this.manufacturerService.create(data);
    }

    @GrpcMethod('MasterDataService', 'findAllManufacturers')
    findAllManufacturers(data: any) {
        return this.manufacturerService.findAll(data);
    }

    @GrpcMethod('MasterDataService', 'findManufacturerById')
    findManufacturerById(data: { id: string }) {
        return this.manufacturerService.findOne(data.id);
    }

    @GrpcMethod('MasterDataService', 'findManufacturerByCode')
    findManufacturerByCode(data: { name: string }) {
        return this.manufacturerService.findByCode(data.name);
    }

    @GrpcMethod('MasterDataService', 'updateManufacturer')
    updateManufacturer(data: UpdateManufacturerDto) {
        return this.manufacturerService.update(data);
    }

    @GrpcMethod('MasterDataService', 'destroyManufacturer')
    destroyManufacturer(data: { id: string }) {
        return this.manufacturerService.remove(data.id);
    }

    @GrpcMethod('MasterDataService', 'countManufacturers')
    countManufacturers(data: any) {
        return this.manufacturerService.count(data);
    }
}
