import React,{useState,useEffect,useContext} from 'react'
import SlideShow from '../Components/SlideShow'
import axios from 'axios';
import {
  Typography, Card, CardContent,CircularProgress,
  TextField, Button, Paper, Chip, Box, Grid,
  CardActions, CardActionArea, Divider, CardMedia,Stack
} from '@mui/material'
import ProductCard from '../Components/ProductCard';
// import Paper from '@mui/material/Paper';
import InputBase from '@mui/material/InputBase';
// import Divider from '@mui/material/Divider';
import IconButton from '@mui/material/IconButton';
import MenuIcon from '@mui/icons-material/Menu';
import SearchIcon from '@mui/icons-material/Search';
import DirectionsIcon from '@mui/icons-material/Directions';
import { useNavigate ,Link} from "react-router-dom";
import { GlobalContext } from '../Context/Context';
import { Navigate } from 'react-router-dom';
const HomeUser = () => {
    let { state, dispatch } = useContext(GlobalContext);
  const [eof, setEof] = useState(false)
  const [CurrentProduct, setCurrentProduct] = useState(null)
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
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
  
   
    console.log("hjhjfffffff",response)
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

  const getAProduct = async (id) => {
    // if(error || success){
    //   handleClickMsg()
    // }
    setSuccess('')
setError('')
    try {
      const response = await axios.get(`${state.baseUrl}/product/${id}`,{
         
        withCredentials: true,
        
     
    })
//       console.log("responseCart: ", response);
// console.log("response2: ", response.data.data)
      setCurrentProduct(response.data.data)
      // console.log("CurrentProduct",CurrentProduct)
      let cart = {
        id:response.data.data._id,
        name:response.data.data.name,
        price:response.data.data.price,
        priceUnit:response.data.data.priceUnit,
        productType:response.data.data.productType,
        description:response.data.data.description,
        productImage:response.data.data.productImage,
       
      }
   

      
      addcart(cart)

      } 
      
      catch (error) {
      console.log("error cart in getting all products", error);
    }
  }


  const addcart = async (objectCart) => {
 
    setSuccess('')
setError('')
    try {
      const response = await
      axios.post(`${state.baseUrl}/addtocart`, objectCart,{
         
        withCredentials: true,

    });
  
  //  console.log("asds",response)
   setSuccess(response.data.message
    )
//    setLoadCart(!loadCart)
   

    } catch (error) {
      setError(error.response.data.message)
       console.log("error cart in getting all products", error);
    
    }
  }
  return (
    <div>
          <SlideShow/>
      <Divider/>
      <Typography sx={{m:2,fontSize:{xs:30,sm:50,lg:50}}} >

 All Courses
</Typography>
<Divider/>
<div style={{display:"flex", justifyContent:"center", alignItems:"center"}}>
<Paper
      component="form"
      sx={{ p: '6px 8px', display: 'flex', alignItems: 'center', width: {lg:800,sm:600,xs:400}, justifyContent:"center" }}
    >
      <IconButton sx={{ p: '10px' }} aria-label="menu">
        <MenuIcon />
      </IconButton>
      <InputBase
        sx={{ ml: 1, flex: 1 }}
        placeholder="Search Courses"
        inputProps={{ 'aria-label': 'search Courses' }}
      />
      <IconButton type="button" sx={{ p: '10px' }} aria-label="search">
        <SearchIcon />
      </IconButton>
      <Divider sx={{ height: 28, m: 0.5 }} orientation="vertical" />
      <IconButton color="primary" sx={{ p: '10px' }} aria-label="directions">
        <DirectionsIcon />
      </IconButton>
    </Paper>
    </div>
<Grid 
      sx={{display:{lg:"flex",sx:"flex",xs:"block"},flexWrap:"wrap",m:{xs:1,sm:3,lg:3},
      mb:{xs:6,sm:5,lg:3},ml:{xs:3,sm:0,lg:0}}}
    
   >
 {(!homeProductData) ? null :


homeProductData?.map((eachProduct, index) => ( 
      
<Box
key={index}
sx={{ width: '100%', maxWidth:{ lg:300,xs:300,sm:300},
    bgcolor: 'white',p:1,borderRadius:"10px",color:"green",m:"1em"}}>
<CardMedia
        component="img"
        width="150"
        loading="lazy "
        height="180"
      image={eachProduct?.productImage
      }
     
        alt="green iguana"
      />
      <Box sx={{ my: 1, mx: 2 }}>
        <Grid container alignItems="center">
          <Grid item xs>
            <Typography gutterBottom variant="h5" component="div">
          {eachProduct.name}
              
            </Typography>
          </Grid>
          <Grid item>
            <Typography gutterBottom variant="h5" component="div">
              {eachProduct.priceUnit } : 
              {eachProduct.price}
            </Typography>
            
          </Grid>
        </Grid>
        <Typography sx={{ opacity: 0.5}} color="gray" variant="body2">
         {eachProduct.productType}
        </Typography>
        <Typography sx={{ opacity: 0.5}} color="gray" variant="body2">
         {eachProduct.description}
        </Typography>
        
      </Box>
      <Divider variant="middle" />

      <Box sx={{
        display: "flex", justifyContent: "space-evenly",
        m: 1, p: 1
      }}>
        {/* <Button
        onClick={()=>{
          handleClickOpen();
          setEditing({
            editingid:eachProduct._id,
            editingName:eachProduct.name,
            editingPrice:eachProduct.price
            ,editingDescription:eachProduct.description,
            editingProdImage:eachProduct.productImage,
        })
          }}
        
        color='success' variant='contained'>Edit</Button> */}
      <Link to={`CourseDetail:${eachProduct?._id}`}>  <Button fullWidth
                //  onClick={AddTheProduct}
                // onClick={() => {
                //   // getAProduct(eachProduct?._id)
                //   Navigate(`CourseDetail/${eachProduct?._id}`)
                 
                // }}

                 color='success' variant='contained'>Enroll</Button></Link>
        {/* <Button 

        color='error' variant='contained'>Delete</Button> */}
      </Box>
    </Box>
))}
</Grid>

    </div>
  )
}

export default HomeUser