import * as dotenv from 'dotenv' // see https://github.com/motdotla/dotenv#how-do-i-use-dotenv-with-import
dotenv.config()
import mongoose from 'mongoose';


let otpSchema = new mongoose.Schema({

    otp: String,
     email: String,
     isUsed: { type: Boolean, default: false },
    //  isDeleted: { type: Boolean, default: false },
    createdOn: { type: Date, default: Date.now }
});
export const OtpRecordModel = mongoose.model('OtpRecords', otpSchema);


let productSchema = new mongoose.Schema({
    name: { type: String, required: true },
    priceUnit:String,
    price: Number,
    description: String,
     productImage: String,
     productType:String,
     owner: { type: mongoose.ObjectId, required: true },
//   isDeleted: { type: Boolean, default: false },
    createdOn: { type: Date, default: Date.now }
});
export const productModel = mongoose.model('products', productSchema);


let addtocartSchema = new mongoose.Schema({
    id:String,
    name: { type: String, required: true },
    priceUnit:{ type: String },
    price: Number,
    description: String,
    productImage: String,
    productType:String,
    owner: { type: mongoose.ObjectId, required: true },
    createdOn: { type: Date, default: Date.now }
});
export const addtocartModel = mongoose.model('addtocarts', addtocartSchema);


const userSchema = new mongoose.Schema({
    firstName: { type: String },
    lastName: { type: String },
    // number:{type:Number,required: true},
    email: { type: String, required: true },
    profileImage: {type:String},
    password: { type: String, required: true },
    isAdmin:{ type: Boolean, default: false },
    createdOn: { type: Date, default: Date.now },
});
export const userModel = mongoose.model('Users', userSchema);

const CategorySchema = new mongoose.Schema({
    name: { type: String },
    CategoryImage: {type:String},
    createdOn: { type: Date, default: Date.now },
});
export const category= mongoose.model('Category', CategorySchema);
const placeOrderSchema = new mongoose.Schema({
    FullName: { type: String },
    email: { type: String },
    status: { type: String },
    TotalAmount:{ type: Number },
    totalItems:{ type: String },
    number:{ type: Number },
    shippingAddress:{ type: String },
    createdOn: { type: Date, default: Date.now },
});

export const placeorder= mongoose.model('placeOrder', placeOrderSchema);
const mongodbURI = process.env.mongodbURI



/////////////////////////////////////////////////////////////////////////////////////////////////
mongoose.connect(mongodbURI);

////////////////mongodb connected disconnected events///////////////////////////////////////////////
mongoose.connection.on('connected', function () {//connected
    console.log("Mongoose is connected");
});

mongoose.connection.on('disconnected', function () {//disconnected
    console.log("Mongoose is disconnected");
    process.exit(1);
});

mongoose.connection.on('error', function (err) {//any error
    console.log('Mongoose connection error: ', err);
    process.exit(1);
});

process.on('SIGINT', function () {/////this function will run jst before app is closing
    console.log("app is terminating");
    mongoose.connection.close(function () {
        console.log('Mongoose default connection closed');
        process.exit(0);
    });
});
////////////////mongodb connected disconnected events///////////////////////////////////////////////