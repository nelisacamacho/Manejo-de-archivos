// Consigna

//? Realizar una clase de nombre “ProductManager”, el cual permitirá trabajar con múltiples productos. Éste debe poder agregar, consultar, modificar y eliminar un producto
//? y manejarlo en persistencia de archivos (basado en entregable 1).

//! Aspectos a incluir

//? La clase debe contar con una variable this.path, el cual se inicializará desde el constructor y debe recibir la ruta a trabajar desde el momento de generar su instancia.
//? Debe guardar objetos con el siguiente formato:
//? id (se debe incrementar automáticamente, no enviarse desde el cuerpo)
//? title (nombre del producto)
//? description (descripción del producto)
//? price (precio)
//? thumbnail (ruta de imagen)
//? code (código identificador)
// ?stock (número de piezas disponibles)

//! Aspectos a incluir
//? Debe tener un método addProduct el cual debe recibir un objeto con el formato previamente especificado, asignarle un id autoincrementable y guardarlo en el arreglo (recuerda siempre guardarlo como un array en el archivo).
//? Debe tener un método getProducts, el cual debe leer el archivo de productos y devolver todos los productos en formato de arreglo.
//? Debe tener un método getProductById, el cual debe recibir un id, y tras leer el archivo, debe buscar el producto con el id especificado y devolverlo en formato objeto
//? Debe tener un método updateProduct, el cual debe recibir el id del producto a actualizar, así también como el campo a actualizar (puede ser el objeto completo, como en una DB), y debe actualizar el producto que tenga ese id en el archivo. NO DEBE BORRARSE SU ID 
//? Debe tener un método deleteProduct, el cual debe recibir un id y debe eliminar el producto que tenga ese id en el archivo.

//! Formato del entregable
//? Archivo de javascript con el nombre ProductManager.js
//? Proceso de testing de este entregable ✅

const fs = require('fs');
class ProductManager {

    constructor(path) {
        this.path = path;
    }

    static id = 0;

    addProduct = async (title, description, price, thumbnail, code, stock) => {

        if(!title || !description || !price || !thumbnail || !code || !stock) {
            return console.error('All fields are required, please verify.');
        }
        
        const products = await this.getProducts();
        console.log('products desde addProduct', products);

        if(products.find(product => product.code === code)) {
            return console.error(`Code ${code} already exists, please verify.`);
        }

        ProductManager.id++;
        const newProduct = {
            id: await this.generateId(),
            title, 
            description, 
            price: Number(price),
            thumbnail, 
            code, 
            stock: Number(stock)
        }
        products.push(newProduct)
        await fs.promises.writeFile(this.path, JSON.stringify(products), 'utf-8');
        return newProduct;
    }

    generateId = async () => {
        try {
            const products = await this.getProducts();
            if(products.length === 0) {
                return 1;
            }
            return products[products.length - 1].id + 1;

        } catch (error) {
            console.error(error)
        }
    }

    getProducts = async () => {
        try {
            const datos = await fs.promises.readFile(this.path, 'utf-8');
            const result = JSON.parse(datos);
            return result;
        } catch (error) {
            console.error('No hay datos')
            return [];
        }
    }
    
    getProductById = async (productId) => {
        try {
            const products = await this.getProducts();
            const product = products.find(product => product.id === productId);
            return product;

        } catch (error) {
            console.error(error)
        }
    }

    updateProduct = async (productId, value) => {
        try {
            if(!productId || !value) return console.error('Must provide the required information to update a product')
            let products = await this.getProducts();
            const product = products.find(product => product.id === productId);
            const productIdx = products.findIndex(product => product.id === productId);
            products[productIdx] = {
                ...product,
                ...value,
                'id': productId
            }
            await fs.promises.writeFile(this.path, JSON.stringify(products), 'utf-8');
            return this.getProductById(productId);
        } catch (error) {
            console.error(error)
        }
    }

    deleteProduct = async (productId) => {
        try {
            const product = await this.getProductById(productId);
            if(!product) return `Product with ID ${productId} does not exist.`
            const products = await this.getProducts();
            const productIdx = products.findIndex(product => product.id === productId);
            products.splice(productIdx, 1);
            await fs.promises.writeFile(this.path, JSON.stringify(products), 'utf-8');
            return products;
        } catch (error) {
            console.error(error)
        }
    }
    
}

const test = async () => {
    const productManager = new ProductManager('./Products.json')
    let products = await productManager.getProducts();
    console.log(products);
    await productManager.addProduct('producto prueba', 'Este es un producto prueba', 200, 'Sin imagen', 'abc123', 25);
    products = await productManager.getProducts();
    console.log(products);
    const productById = await productManager.getProductById(1);
    console.log(productById);
    const productById2 = await productManager.getProductById(2);
    console.log(productById2);
    await productManager.addProduct('producto prueba2', 'Este es un producto prueba2', 200, 'Sin imagen2', 'abc1232', 52);
    await productManager.addProduct('producto prueba3', 'Este es un producto prueba3', 200, 'Sin imagen3', 'abc1233', 52);
    await productManager.addProduct('producto prueba4', 'Este es un producto prueba4', 200, 'Sin imagen4', 'abc1234', 52);
    products = await productManager.getProducts();
    console.log(products);
    const updated = await productManager.updateProduct(2,{id: 5, title: 'producto prueba2 updated' })
    console.log('updated', updated);
    console.log(await productManager.deleteProduct(5));
    console.log(await productManager.deleteProduct(2));

    // await productManager.updateProduct(2,{'title':'producto prueba updated2'})
    // const productById = await productManager.getProductById(2);
    // console.log('productById', productById);
    // await productManager.updateProduct(2,{'thumbnail':'thumbnail updated2'})
    // console.log(await productManager.getProducts());


}

test();

