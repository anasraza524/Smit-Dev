// import React from 'react'
import React,{useState,useEffect,useContext} from 'react'
import SlideShow from '../Components/SlideShow'
import axios from 'axios';
import {
  Typography, Card, CardContent,CircularProgress,
  TextField, Button, Paper, Chip, Box, Grid,
  CardActions, CardActionArea, Divider, CardMedia,Stack
} from '@mui/material'
import { GlobalContext } from '../Context/Context';
import { useParams } from 'react-router-dom';

const CourseDetail = () => {
  const { id } = useParams();
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

useEffect(() => {
  getAProduct()

}, [])
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
console.log("response2: ", response.data.data)
      setCurrentProduct(response.data.data)
      // console.log("CurrentProduct",CurrentProduct)
    

      } 
      
      catch (error) {
      console.log("error cart in getting all products", error);
    }
  }
  return (
    <div>CourseDetail</div>
  )
}

export default CourseDetail