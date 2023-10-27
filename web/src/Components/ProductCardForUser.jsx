import {
  Typography, Card, CardContent,CircularProgress,
  TextField, Button, Paper, Chip, Box, Grid,
  CardActions, CardActionArea, Divider, CardMedia,Stack
} from '@mui/material'
import DeleteIcon from '@mui/icons-material/Delete';
const ProductCardForUser = ({image,price,name,des,productType,priceUnit}) => {
  return (
 
    <Box sx={{ width: '100%', maxWidth:{ lg:300,xs:300,sm:300},
    bgcolor: 'white',p:1,borderRadius:"10px",color:"green",m:"1em"}}>
     
      
      
      <CardMedia
        component="img"
        width="150"
        loading="lazy "
        height="180"
      image={image}
     
        alt="green iguana"
      />
      <Box sx={{ my: 1, mx: 2 }}>
        <Grid container alignItems="center">
          <Grid item xs>
            <Typography gutterBottom variant="h5" component="div">
          {name}
              
            </Typography>
          </Grid>
          <Grid item>
            <Typography gutterBottom variant="h5" component="div">
              {priceUnit } : 
              {price}
            </Typography>
            
          </Grid>
        </Grid>
        <Typography sx={{ opacity: 0.5}} color="gray" variant="body2">
         {productType}
        </Typography>
        <Typography sx={{ opacity: 0.5}} color="gray" variant="body2">
         {des}
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
           <Button 

color='susses' variant='contained'>Add to Cart</Button>
        <Button 

        color='error' variant='contained'>Delete</Button>
      </Box>
    </Box>
  )
}

export default ProductCardForUser