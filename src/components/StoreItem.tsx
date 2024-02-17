
import {
  Button,
  Card,
  CardContent,
  CardActions,
  Typography,
  IconButton,
} from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import RemoveIcon from "@mui/icons-material/Remove";
import DeleteIcon from "@mui/icons-material/Delete";
import { useShoppingCart } from "../context/ShoppingCartContext";
import { formatCurrency } from "../utilities/formatCurrency";

export type StoreItemProps = {
  id: number;
  name: string;
  price: number;
  imgUrl: string;
};

export function StoreItem({ id, name, price, imgUrl }: StoreItemProps) {
  const {
    getItemQuantity,
    adjustCartQuantity,
    removeFromCart,
  } = useShoppingCart();
  const quantity = getItemQuantity(id);

  return (
    <Card sx={{ height: "100%", display: "flex", flexDirection: "column" }}>
      
      <img
        src={imgUrl}
        alt={name}
        style={{ width: "100%", height: "200px", objectFit: "cover" }}
      />
      <CardContent sx={{ flex: 1, overflow: "hidden" }}>
        <Typography variant="h6" gutterBottom>
          {name}
        </Typography>

        <Typography
          variant="body1"
          color="textSecondary"
          mb={2}
          sx={{
            overflow: "hidden",
            textOverflow: "ellipsis",
          }}
        >
          {formatCurrency(price)}
        </Typography>
      </CardContent>
      <CardActions
        sx={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
        }}
      >
        {quantity === 0 ? (
          <Button
            variant="contained"
            onClick={() => adjustCartQuantity(id,  1)}
          >
            <AddIcon /> Add To Cart
          </Button>
        ) : (
          <div style={{ 
            display: "flex", 
            alignItems: "center", 
            gap: ".5rem" }}>
           
            <div style={{ 
              display: "flex", 
              alignItems: "center",
               gap: ".5rem" }}>
             
              <IconButton onClick={() => adjustCartQuantity(id, -1)}>
                <RemoveIcon />
              </IconButton>
              
              <Typography variant="h5">{quantity}</Typography>
              <IconButton onClick={() =>  adjustCartQuantity(id,  1)}> 
                <AddIcon />
              </IconButton>
            </div>

            <Button
              variant="outlined"
              onClick={() => removeFromCart(id)}
              color="error"
              startIcon={<DeleteIcon />}
            >
              Remove
            </Button>
          </div>
        )}
      </CardActions>
    </Card>
  );
}
