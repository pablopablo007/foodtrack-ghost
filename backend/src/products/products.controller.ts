import { Controller, Get, Post, Body, Param, Put, Delete, UseInterceptors, UploadedFile } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { extname } from 'path';
import { ProductsService } from './products.service';
import { Product } from '../entities/product.entity';

@Controller('products')
export class ProductsController {
    constructor(private readonly productsService: ProductsService) { }

    @Get()
    async findAll(): Promise<Product[]> {
        return this.productsService.findAll();
    }

    @Get(':id')
    async findOne(@Param('id') id: string): Promise<Product | null> {
        return this.productsService.findOne(id);
    }

    @Post()
    async create(@Body() productData: Partial<Product>): Promise<Product> {
        return this.productsService.create(productData);
    }

    @Put(':id')
    async update(@Param('id') id: string, @Body() productData: Partial<Product>): Promise<Product | null> {
        return this.productsService.update(id, productData);
    }

    @Delete(':id')
    async remove(@Param('id') id: string): Promise<void> {
        return this.productsService.remove(id);
    }

    @Post('upload')
    @UseInterceptors(
        FileInterceptor('image', {
            storage: diskStorage({
                destination: './uploads',
                filename: (req, file, callback) => {
                    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
                    const ext = extname(file.originalname);
                    const filename = `product-${uniqueSuffix}${ext}`;
                    callback(null, filename);
                },
            }),
            fileFilter: (req, file, callback) => {
                if (!file.originalname.match(/\.(jpg|jpeg|png|gif|webp)$/)) {
                    return callback(new Error('Solo se permiten imágenes'), false);
                }
                callback(null, true);
            },
        }),
    )
    async uploadImage(@UploadedFile() file: Express.Multer.File) {
        if (!file) {
            throw new Error('No se ha subido ninguna imagen');
        }
        return {
            filename: file.filename,
            path: `/uploads/${file.filename}`,
        };
    }
}
