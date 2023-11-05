

const socketClient = io()

addProduct = () => {
  
   const body = {
       title: document.getElementById('title').value,
       description: document.getElementById('description').value,
       price: document.getElementById('price').value,
       code: document.getElementById('code').value,
       stock: document.getElementById('stock').value,
       category: document.getElementById('category').value,
   }
   fetch('/api/products', {
       method: 'post',
       body: JSON.stringify(body),
       headers: {
           'Content-Type': 'application/json'
       },
   })
   .then(result => result.json())
   .then(result => {
       if(result.status === 'error') throw new Error(result.error)
   })
   .then(() => fetch('/api/products'))
   .then(result => result.json())
   .then(result => {
       if(result.status === 'error') throw new Error(result.error)
       socketClient.emit('productList', result.payload)
       alert('Producto Agregado')
       document.getElementById('title').value = ''
       document.getElementById('description').value = ''
       document.getElementById('price').value = ''
       document.getElementById('code').value = ''
       document.getElementById('stock').value = ''
       document.getElementById('category').value = ''
   })
   .catch(err => alert(`Ocurrió un error ${err}`))
}

deleteProduct = (id) => {
   fetch(`/api/products/${id}`,{
       method: 'delete',
   })
   .then(result => result.json())
   .then(result => {
       if(result.status === 'error') throw new Error (result.error)
       socketClient.emit('productList', result.payload)
       alert('Producto eliminado con exito')
   })
   .catch(err => alert(`Ocurrió un error ${err}`))
   
}


socketClient.on("updatedProducts", data => {
   const productsContainer = document.querySelector('.bodyRealTimeProducts'); 
   productsContainer.innerHTML = `
   <div class="container mt-5">
   <h1 class="main-title">¡Crea un Producto Nuevo!</h1>
   <form>
     <div class="form-group">
       <label for="title">Título:</label>
       <input type="text" class="form-control custom-input" id="title" name="title" required>
     </div>
     <div class="form-group">
       <label for="description">Descripción:</label>
       <textarea class="form-control custom-input" id="description" name="description" required></textarea>
     </div>
     <div class="form-group">
       <label for="price">Precio:</label>
       <input type="number" step="0.01" class="form-control custom-input" id="price" name="price" required>
     </div>
     <div class="form-group">
       <label for="code">Código:</label>
       <input type="text" class="form-control custom-input" id="code" name="code" required>
     </div>
     <div class="form-group">
       <label for="stock">Stock:</label>
       <input type="number" class="form-control custom-input" id="stock" name="stock" required>
     </div>
     <div class="form-group">
       <label for="category">Categoría:</label>
       <textarea class="form-control custom-input" id="category" name="category" required></textarea>
     </div>

     <button id="createBtn" type="button" class="btn custom-button" onclick="addProduct()">Crear Producto</button>
   </form>
 </div>
   `; 

   data.forEach(product => {
       const div = document.createElement('div');
       div.classList.add('CardItem');  
       div.innerHTML = `
           <div>
               <h2 class="ItemHeader">
                  ${product.title}
               </h2>
           </div>
          
           <div>
               <p class="Info">
               ${product.description}</p>
           </div>
           <div> 
               <p class="Info">
               Precio: ${product.price}</p>
           </div>
           <button type="button" class="btn custom-button-delete" onclick="deleteProduct('${product._id}')">Eliminar Producto</button>
       `;
       productsContainer.appendChild(div);
   });
});
