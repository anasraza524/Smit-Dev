import express from 'express';
import mongoose from 'mongoose';
import { productModel,category,placeorder} from '../dbRepo/model.mjs'
import multer from 'multer';
import jwt from 'jsonwebtoken';
import bucket from "../FirebaseAdmin/index.mjs";
import fs from 'fs';
import {productSchema}from '../helper/validation_schema.mjs'

// import path from 'path'



const storageConfig = multer.diskStorage({
   destination: '/tmp/uploads/',
// destination: './uploads/',
    filename: function (req, file, cb) {

 console.log("mul-file: ", file);
        cb(null, `${new Date().getTime()}-${file.originalname}`)
    }
})

let uploadMiddleware = multer({
     storage: storageConfig ,
    
     fileFilter: (req, file, cb) => {
      
        if (file.mimetype == "image/png" || file.mimetype == "image/jpg" || file.mimetype == "image/jpeg") {
          cb(null, true);
        } else {
            // this is requesting in uploadMiddleware body and you can send error
            req.fileValidationError = "Forbidden extension";
               return cb(null, false, req.fileValidationError);
        //   return cb(new Error('Only .png, .jpg and .jpeg format allowed!'));
        }
      }

     })

 const router = express.Router()


router.post('/product',
//  multipartMiddleware
 uploadMiddleware.any()
,  async (req, res) => {
   
   try {
    // this is The we are sending
if(req.fileValidationError){
    res.status(400).send({message:"Only .png, .jpg and .jpeg format allowed!"})
    return
}
    const token = jwt.decode(req.cookies.Token)


    const productResult = await productSchema.validateAsync(req.body)
     console.log(productResult,"productSchema")

     const userId = new mongoose.Types.ObjectId(token._id);
console.log("userId",userId)
const countProduct = await productModel.countDocuments({owner: userId})

console.log("countPro",countProduct)

// if(countProduct >= 1 ) throw new Error("Sorry, you can only add 1 product")
// for multer
// if(!req.files[0]) throw new Error("Error in creating product")

// for multi Part (in multi part no file[0])
if(!req.files[0]) throw new Error("please upload product Image")
// console.log(req.files[0].mimetype)

if(req.files[0].mimetype === "image/png"||
req.files[0].mimetype === "image/jpeg"||
req.files[0].mimetype === "image/jpg" ) console.log(" accept png, jpg, jpeg")
else{
    fs.unlink(req.files[0].path, (err) => {
        if (err) {
          console.error(err)
          return
        }
        else{
          console.log("Delete sus")
        }
      })
    throw new Error("only accept png, jpg, jpeg")
}

if(req.files[0].size >= 1000000)throw new Error("only accept 1 Mb Image")
// const UploadInStorageBucket = await bucket.upload(    req.files[0].path,
//     {
//         destination: `tweetPictures/${req.files[0].filename}`, // give destination name if you want to give a certain name to file in bucket, include date to make name unique otherwise it will replace previous file with the same name
//     })
//     if(!UploadInStorageBucket) throw new Error("Server Error")
    
// console.log('UploadInStorageBucket',UploadInStorageBucket)
bucket.upload(
    req.files[0].path,
    {
        destination: `SaylaniHacthon/${req.files[0].filename}`, // give destination name if you want to give a certain name to file in bucket, include date to make name unique otherwise it will replace previous file with the same name
    },
    function (err, file, apiResponse) {
        if (!err) {

            file.getSignedUrl({
                action: 'read',
                expires: '03-09-2999'
            }).then((urlData, err) => {
                if (!err) {


fs.unlink(req.files[0].path, (err) => {
  if (err) {
    console.error(err,"dd")
    return
  }
  else{
    console.log("Delete sus")
  }
})
                  
                    productModel.create({
                        name: productResult.name,
                        priceUnit: productResult.priceUnit,
                        price: productResult.price,
                        description: productResult.description,
                        productType:productResult.productType,

                        productImage: urlData[0],
                        owner: new mongoose.Types.ObjectId(token._id)
                    },
                        (err, saved) => {
                            if (!err) {
                                console.log("saved: ", saved);

                                res.send({
                                    message: "Product added successfully"
                                });
                            } else {
                                console.log("err: ", err);
                                res.status(500).send({
                                    message: "server error"
                                })
                            }
                        })
                }
            })
        } else {
            console.log("err: ", err)
            res.status(500).send({message:err});
        }
    });



} catch (error) {

    res.status(500).send({
        message: error.message
    })
    console.error(error.message);

   }
})


router.get('/productFeed' , async(req,res)=>{
    const { page, limit = 8 } = req.query;
    try {
        const data = await productModel.find()
        .sort({"_id":-1})
        .limit(limit * 1)
      .skip((page - 1) * limit)
      .exec();
   if(!data) throw new Error("Product Not Found")
      const count = await  productModel.countDocuments();
      console.log(count)
      
      res.json({
        data,
        totalPages: Math.ceil(count / limit),
        currentPage: page
      });
    } catch (error) {
        res.status(500).send({
            message: error.message
        })
        console.error(error.message);
    }
})

router.get('/product/:id', async (req, res) => {

try {
    const id = req.params.id;
    const verifyProduct = await productModel.findOne({ _id: id })
    if(!verifyProduct) throw new Error("Product not found")
    res.send({
        message: `get product by id: ${verifyProduct._id} success`,
        data: verifyProduct
    });
    return;
} catch (error) {
    res.status(500).send({
        message: error.message
    })
    console.error(error.message);
}
   
  
})
router.get("/products/:name",async (req, res) => {

    try {
        const body = req.body
        const name = req.params.name
        const verifyProductName = await  productModel.find({ 
   
            name: { $regex: `${name}` }
         })
         if(!verifyProductName)throw new Error("product not Found")

         res.send({
            message: `get product by success`,
            data: verifyProductName,
          });

    } catch (error) {
        res.status(500).send({
            message: error.message
        })
        console.error(error.message);
    }

  });


  router.get("/products/:productType",async (req, res) => {

    try {
        const body = req.body
        const productType = req.params.productType
        const verifyProductName = await  productModel.find({ 
   
            productType: { $regex: `${productType}` }
         })
         if(!verifyProductName)throw new Error("product not Found")

         res.send({
            message: `get product by success`,
            data: verifyProductName,
          });

    } catch (error) {
        res.status(500).send({
            message: error.message
        })
        console.error(error.message);
    }

  });
router.get('/products',async (req, res) => {
try {
    const userId = new mongoose.Types.ObjectId(req.body.token._id);
    console.log(userId)
    
    const verifyUser=  await productModel.find(
            { owner: userId
                // , isDeleted: false 
                }, {},{
                sort: { "_id": -1 },
                limit: 100,
                skip: 0
            })

if(!verifyUser) throw new Error("server error")
            res.send({
                message: "got all products successfully",
                data: data
            })
} catch (error) {
    res.status(500).send({
        message: error.message
    })
    console.error(error.message);

}
   
})

router.delete('/product/:id',async (req, res) => {
    const id = req.params.id;
    productModel.deleteOne({ _id: id }, (err, deletedData) => {
        console.log("deleted: ", deletedData);
        if (!err) {

            if (deletedData.deletedCount !== 0) {
                res.send({
                    message: "Product has been deleted successfully",
                })
            } else {
                res.status(404);
                res.send({
                    message: "No Product found",                    //  with this id: " + id,
                });
            }
        } else {
            res.status(500).send({
                message: "server error"
            })
        }
    });
})

router.put('/product/:id',async (req, res) => {

    const body = req.body;
    const id = req.params.id;

    if (
        !body.name ||
        !body.price ||
        !body.description
    ) {
        res.status(400).send(` required parameter missing. example request body:
        {
            "name": "value",
            "price": "value",
            "description": "value",
            "productImage": "value"
        }`)
        return;
    }

    try {
        let data = await productModel.findByIdAndUpdate(id,
            {
                name: body.name,
                price: body.price,
                description: body.description,
                productImage:body.productImage
            },
            { new: true }
        ).exec();

        console.log('updated: ', data);

        res.send({
            message: "product modified successfully"
        });

    } catch (error) {
        res.status(500).send({
            message: "server error"
        })
    }
})
router.post('/category',
//  multipartMiddleware
 uploadMiddleware.any()
,  async (req, res) => {
   
   try {
    const body =req.body
    // this is The we are sending
if(req.fileValidationError){
    res.status(400).send({message:"Only .png, .jpg and .jpeg format allowed!"})
    return
}
    const token = jwt.decode(req.cookies.Token)


   

    

// if(countProduct >= 1 ) throw new Error("Sorry, you can only add 1 product")
// for multer
// if(!req.files[0]) throw new Error("Error in creating product")

// for multi Part (in multi part no file[0])
if(!req.files[0]) throw new Error("please upload product Image")
// console.log(req.files[0].mimetype)

if(req.files[0].mimetype === "image/png"||
req.files[0].mimetype === "image/jpeg"||
req.files[0].mimetype === "image/jpg" ) console.log(" accept png, jpg, jpeg")
else{
    fs.unlink(req.files[0].path, (err) => {
        if (err) {
          console.error(err)
          return
        }
        else{
          console.log("Delete sus")
        }
      })
    throw new Error("only accept png, jpg, jpeg")
}

if(req.files[0].size >= 1000000)throw new Error("only accept 1 Mb Image")
// const UploadInStorageBucket = await bucket.upload(    req.files[0].path,
//     {
//         destination: `tweetPictures/${req.files[0].filename}`, // give destination name if you want to give a certain name to file in bucket, include date to make name unique otherwise it will replace previous file with the same name
//     })
//     if(!UploadInStorageBucket) throw new Error("Server Error")
    
// console.log('UploadInStorageBucket',UploadInStorageBucket)
bucket.upload(
    req.files[0].path,
    {
        destination: `SaylaniHacthon/${req.files[0].filename}`, // give destination name if you want to give a certain name to file in bucket, include date to make name unique otherwise it will replace previous file with the same name
    },
    function (err, file, apiResponse) {
        if (!err) {

            file.getSignedUrl({
                action: 'read',
                expires: '03-09-2999'
            }).then((urlData, err) => {
                if (!err) {


fs.unlink(req.files[0].path, (err) => {
  if (err) {
    console.error(err,"dd")
    return
  }
  else{
    console.log("Delete sus")
  }
})
                  
               category.create({
                        name: body.name,
                       

                        CategoryImage: urlData[0],
                        owner: new mongoose.Types.ObjectId(token._id)
                    },
                        (err, saved) => {
                            if (!err) {
                                console.log("saved: ", saved);

                                res.send({
                                    message: "Category added successfully"
                                });
                            } else {
                                console.log("err: ", err);
                                res.status(500).send({
                                    message: "server error"
                                })
                            }
                        })
                }
            })
        } else {
            console.log("err: ", err)
            res.status(500).send({message:err});
        }
    });



} catch (error) {

    res.status(500).send({
        message: error.message
    })
    console.error(error.message);

   }
})


router.get('/categoryFeed' , async(req,res)=>{
    const { page, limit = 8 } = req.query;
    try {
        const data = await category.find()
        .sort({"_id":-1})
        .limit(limit * 1)
      .skip((page - 1) * limit)
      .exec();
   if(!data) throw new Error("Category Not Found")
      const count = await  category.countDocuments();
      console.log(count)
      
      res.json({
        data,
        totalPages: Math.ceil(count / limit),
        currentPage: page
      });
    } catch (error) {
        res.status(500).send({
            message: error.message
        })
        console.error(error.message);
    }
})
router.post("/placeOrder",async (req, res) => {
    try {
    let body = req.body
          
         
        
    
       const placeOrder= await placeorder.create({
        FullName: body.FullName,
        email: body.email,
        status: body.status,
        TotalAmount:body.TotalAmount,
        totalItems:body.totalItems,
        number:body.number,
        shippingAddress:body.shippingAddress
             
        })
        if(!placeOrder) {
            res.status(500).send({message:"Server Error"})
            return;
        }
    
        res.status(201).send({ message: "Order Is Placed" });
    
    } catch (error) {
        if (error.isJoi === true ||error.message) error.status = 422
      
        console.log("placeOrder Error: ", error,error.status);
        console.log("placeOrder Error Message: ", error.message);
        error.status
        res.status(error.status).send({
            message: error.message
        })
        
    }
    
    
    
    
        
    
    });

    router.get('/placeOrders',async (req, res) => {
        try {
            const userId = new mongoose.Types.ObjectId(req.body.token._id);
            console.log(userId)
            
            const verifyUser=  await placeorder.find(
                    { owner: userId
                        // , isDeleted: false 
                        }, {},{
                        sort: { "_id": -1 },
                        limit: 10,
                        skip: 0
                    })
        
        if(!verifyUser) throw new Error("server error")
                    res.send({
                        message: "got all products successfully",
                        data: verifyUser
                    })
        } catch (error) {
            res.status(500).send({
                message: error.message
            })
            console.error(error.message);
        
        }
           
        })


    router.get('/placeOrderFeed' , async(req,res)=>{
        const { page, limit = 8 } = req.query;
        try {
            const data = await placeorder.find()
            .sort({"_id":-1})
            .limit(limit * 1)
          .skip((page - 1) * limit)
          .exec();
       if(!data) throw new Error("Category Not Found")
          const count = await  placeorder.countDocuments();
          console.log(count)
          
          res.json({
            data,
            totalPages: Math.ceil(count / limit),
            currentPage: page
          });
        } catch (error) {
            res.status(500).send({
                message: error.message
            })
            console.error(error.message);
        }
    })
    router.put('/placeOrder/:id',async (req, res) => {

        const body = req.body;
        const id = req.params.id;
    
        if (
            !body
          
        ) {
            res.status(400).send(` required parameter missing. example request body:
            {
                "name": "value",
                "price": "value",
                "description": "value",
                "productImage": "value"
            }`)
            return;
        }
    
        try {
            let data = await placeorder.findByIdAndUpdate(id,
                {
                    status: body.status,
                },
                { new: true }
            ).exec();
    
            console.log('updated: ', data);
    
            res.send({
                message: "product modified successfully"
            });
    
        } catch (error) {
            res.status(500).send({
                message: "server error"
            })
        }
    })
export default router