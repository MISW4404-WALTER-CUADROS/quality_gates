import { Injectable, HttpStatus, NotFoundException } from '@nestjs/common';
import { CreatePaisDto } from './dto/create-pais.dto';
import { UpdatePaisDto } from './dto/update-pais.dto';
import { Pais } from './entities/pais.entity';
import { In, Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { BusinessLogicException } from '../shared/errors/business-errors';
import { Cultura } from '../culturas/entities/cultura.entity';

@Injectable()
export class PaisesService {

  constructor(
    @InjectRepository(Pais)
    private paisRepository: Repository<Pais>,

    @InjectRepository(Cultura)
    private culturaRepository: Repository<Cultura>
  ){}
  async create(createPaisDto: CreatePaisDto) {
    try{
      const pais = this.paisRepository.create(createPaisDto);
      await this.paisRepository.save( pais );
      return pais
    } catch(error){
      throw new BusinessLogicException(error, HttpStatus.INTERNAL_SERVER_ERROR )
    }
  }

  async findAll() {
    try {
      const paises = await this.paisRepository.find(); 
      return paises;
    } catch (error) {
      throw new BusinessLogicException('Error al obtener países debido a un error del servidor', HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }
  

  async findOne(id: string) {
    const pais = await this.paisRepository.findOne(
      {
        where: { id: id }
      }
    );
    if(!pais){
      throw new BusinessLogicException(`El país con el ID proporcionado no fue encontrado`, HttpStatus.NOT_FOUND);
      }
    return pais;
  }

  async update(id: string, updatePaisDto: UpdatePaisDto) {
    const pais = await this.paisRepository.preload({
      id: id,
      ...updatePaisDto
    });
    if (!pais) {
      throw new BusinessLogicException('El país con el ID proporcionado no fue encontrado', HttpStatus.NOT_FOUND);
    }
    try {
      await this.paisRepository.save(pais);
      return pais;
    } catch (error) {
      throw new BusinessLogicException('Error al actualizar el país debido a un error del servidor', HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }  

  async remove(id: string) {
    try {
      const pais = await this.findOne(id);
      await this.paisRepository.remove(pais);
      return pais;
    } catch (error) {
      throw new BusinessLogicException('El país con el ID proporcionado no fue encontrado', HttpStatus.NOT_FOUND);
    }
  }

//-----------------------------Cultura de un pais---------------------------------------------------//

  //Método para agregar cultura a un pais
  async agregarCulturaAPaises(paisId: string, culturaIds: string[]) {
    const country = await this.findOne(paisId);
    if (!Array.isArray(country.culturas)) {
      country.culturas = [];
    }
  
    const culturas = await this.culturaRepository.find({
      where: { id: In(culturaIds) }
    });    
    this.validateArrayCulturas(culturas, culturaIds);  
    country.culturas = [...new Set([...country.culturas, ...culturas])];  
    return await this.paisRepository.save(country);
  }

  //Método para obtener culturas de un pais
  async obtenerCulturasDePais(paisId: string) {
    const pais = await this.findOne(paisId);
    if (!pais) {
      throw new BusinessLogicException(`The country with the given id ${paisId} was not found`, HttpStatus.NOT_FOUND);
    }
    return pais;
  }

  //Método para actualizar el listado de culturas de un pais
  async actualizarCulturasDePais(paisId: string, culturaIds: string[]){
    const pais = await this.findOne(paisId); 
    const culturas = await this.culturaRepository.findBy({ id: In(culturaIds) });
    if (culturas.length !== culturaIds.length) {
      throw new BusinessLogicException(
        'Some of the provided cultures do not exist',
        HttpStatus.NOT_FOUND,
      );
    }
    pais.culturas = culturas;
    return await this.paisRepository.save(pais);
  }
  
  //Método para eliminar una cultura de un pais
  async eliminarCulturaDePais(paisId: string, culturaId: string): Promise<Pais> {
    const pais = await this.paisRepository.findOne({
      where: { id: paisId },
      relations: ['culturas'], 
    });
    if (!pais) {
      throw new NotFoundException(`The country with the given id ${paisId} was not found`);
    }
    if (!pais.culturas || pais.culturas.length === 0) {
      throw new NotFoundException(`The country with id ${paisId} has no cultures associated`);
    }
    const cultura = pais.culturas.find(cultura => cultura.id === culturaId);
    if (!cultura) {
      throw new NotFoundException(`The culture with id ${culturaId} was not found in country with id ${paisId}`);
    }
    pais.culturas = pais.culturas.filter(cultura => cultura.id !== culturaId);
    return await this.paisRepository.save(pais);
  }
  
  
  validateArrayCulturas(culturas, culturaIds){
    if (culturas.length !== culturaIds.length) {
      throw new BusinessLogicException(`Alguno de los paises no existe`, HttpStatus.NOT_FOUND);
    }
  }
  
}
