// shopping cart context logic stores the state of the shopping cart

import { createContext, ReactNode, useContext, useEffect, useState } from "react"
import { ShoppingCart } from "../components/ShoppingCart"
import { useLocalStorage } from "../hooks/useLocalStorage"
import { fetchProducts } from "../data/api"




type ShoppingCartProviderProps = {
    children: ReactNode
  }
//card contains id and quantity
type CartItem = {
    id: number
    quantity: number
  }

// to add and remove items from the cart, we need to know the quantity of each item
type ShoppingCartContext = {
    openCart: () => void;
    closeCart: () => void;
    getItemQuantity: (id: number) => number;
    increaseCartQuantity: (id: number) => void;
    decreaseCartQuantity: (id: number) => void;
    removeFromCart: (id: number) => void;
    cartQuantity: number;
    cartItems: CartItem[];
    products: Product[];
    loading: boolean;
    error: string | null;
    searchTerm: string;
    setSearchTerm: React.Dispatch<React.SetStateAction<string>>;
}


const ShoppingCartContext = createContext({} as ShoppingCartContext)

export function useShoppingCart() {
    return useContext(ShoppingCartContext)
}


export function ShoppingCartProvider({ children }: ShoppingCartProviderProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [cartItems, setCartItems] = useLocalStorage<CartItem[]>('shopping-cart', []);
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);  
  const [error, setError] = useState<string | null>(null);  
  const [searchTerm, setSearchTerm] = useState("");

  const cartQuantity = cartItems.reduce((quantity, item) => item.quantity + quantity, 0);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const productsData = await fetchProducts();
        setProducts(productsData);
        setLoading(false); //  to false when the data is fetched
        setError(null); // reset the error state
      
      } catch (error) {
        setLoading(false); 
        setError(error.message); // set the error msg
      }
    };

    fetchData();
  }, []);
    

    function openCart() {
         setIsOpen(true)
    }

    function closeCart() {
        setIsOpen(false)
    }
   
    //quamtity logic
   function getItemQuantity(id:number) {
    return cartItems.find(item => item.id === id)?.quantity || 0;
   }

   function increaseCartQuantity(id : number) {
    setCartItems(currentItems => {
        if(currentItems.find(item => item.id === id) == null) {
            return [...currentItems, {id, quantity: 1}] // add a new item to the cart

        } else {
            return currentItems.map(item => {
                if(item.id === id) {
                    return {...item, quantity: item.quantity + 1} //reuse the item object and update the quantity
                } else {
                    return item; //default case
                }
            });
        }
    });
}
function decreaseCartQuantity(id: number) {
    setCartItems(currItems => {
      if (currItems.find(item => item.id === id)?.quantity === 1) {
        return currItems.filter(item => item.id !== id) // new list without the item
      } else {
        return currItems.map(item => {
          if (item.id === id) {
            return { ...item, quantity: item.quantity - 1 } // removes one from the quantity
          } else {
            return item
          }
        })
      }
    })
  }

  function removeFromCart(id: number) {
    setCartItems(currItems => {
    return currItems.filter(item => item.id !== id)
    })
  }

return (
  <>
    {loading ? (
      <div style={{
         display: 'flex', 
         justifyContent: 'center', 
         alignItems: 'center', 
         height: '100vh', 
         flexDirection: 'column' }}>
        <h1>Loading...</h1>
        <div style={{ 
          margin: '20px', 
          width: '50px', 
          height: '50px', 
          borderTop: '4px solid #3498db', 
          borderRadius: '50%', 
          animation: 'spin 1s linear infinite' }}></div>
      </div>

    ) : error ? (
      <div style={{ 
        display: 'flex', 
        justifyContent: 'center', 
        alignItems: 'center',
         height: '100vh', 
         flexDirection: 'column' }}>
        <h1>Error</h1>
        <p>{error}</p>
      </div>
  ) : (
    <ShoppingCartContext.Provider
      value={{ 
          getItemQuantity,
          increaseCartQuantity,
          decreaseCartQuantity, 
          removeFromCart, 
          openCart,
          closeCart,
          cartItems,
          cartQuantity,
          products,
          loading,
          error,
          searchTerm,
          setSearchTerm
          
        }}
    >
      {children}
      <ShoppingCart isOpen = {isOpen} />
    </ShoppingCartContext.Provider>
  )}
  </>
  );
}
