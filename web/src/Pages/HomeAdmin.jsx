import React,{useState,useEffect,useContext} from 'react'
import {
  Typography, Card, CardContent,CircularProgress,
  TextField, Button, Paper, Chip, Box, Grid,
  CardActions, CardActionArea, Divider, CardMedia,Stack
} from '@mui/material'
import { GlobalContext } from '../Context/Context';
import { SlideLeft } from '../utils/motion';
import { motion } from "framer-motion";
import axios from 'axios';
import ProductCard from '../Components/ProductCard';
const HomeAdmin = () => {
  let { state, dispatch } = useContext(GlobalContext);
  const [eof, setEof] = useState(false)

 const [homeProductData, setHomeProductData] = useState([])
const [loadProduct, setLoadProduct] = useState(false)
const [open, setOpen] = useState(false);
const [page, setPage] = useState(0)
const [CurrentPage, setCurrentPage] = useState(1)
  const getAllProducts = async () => {
    if (eof) return;
    dispatch({
      type:"LOAD_SKELETON",
      payload:true
    })
    try {
    
      const response = await axios.get(`${state.baseUrl}/productFeed?page=${CurrentPage}`,{
           
        withCredentials: true,
        
     
    });
  
   
    console.log("hjhj",response)
    setPage(response.data)
    setHomeProductData(response.data.data)
   

      dispatch({
        type:"LOAD_SKELETON",
        payload:false
      })
    } catch (error) {
      dispatch({
        type:"LOAD_SKELETON",
        payload:false
      })
    //   if(error){
    //     ClickOpenError()
    //   }else{
    //   handleCloseError()
    //  }
     console.log(error,"error")

    }
  }
  useEffect(() => {
    getAllProducts()
  
  }, [loadProduct])
  return (
    <div style={{marginTop:"10px"}}>
<Typography sx={{m:2,fontSize:{xs:30,sm:50,lg:50}}} >

 All Products
</Typography>
<Divider sx={{color:"white"}}/>
      <Grid 
      sx={{display:{lg:"flex",sx:"flex",xs:"block"},flexWrap:"wrap",m:{xs:1,sm:3,lg:3},
      mb:{xs:6,sm:5,lg:3},ml:{xs:3,sm:0,lg:0}}}
    
   >
 {(!homeProductData) ? null :


homeProductData?.map((eachProduct, index) => ( 
      
<ProductCard
key={index}
image={eachProduct?.productImage}
price={eachProduct?.price}
des={eachProduct?.description}
productType={eachProduct?.productType}
name={eachProduct?.name}
priceUnit={eachProduct?.priceUnit}

/>
))}
</Grid>
    </div>
  )
}

export default HomeAdmin;