import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import dayjs from "dayjs";


export const DT_CATEGORY_COLUMN =[

  {
    accessorKey: "name",
    header:"Category Name",
  },
  {
    accessorKey: "slug",
    header:"Slug",
  }
]

export const DT_PRODUCT_COLUMN =[

  {
    accessorKey: "name",
    header:"Product Name",
  },
  {
    accessorKey: "slug",
    header:"Slug",
  },
  {
    accessorKey: "category",
    header:"Category",
  },
  {
    accessorKey: "mrp",
    header:"MRP",
  },
  {
    accessorKey: "sellingPrice",
    header:"Selling Price",
  },
  {
    accessorKey: "discountPercentage",
    header:"Discount Percentage",
  },

]
export const DT_PRODUCT_VARIANT_COLUMN =[

  {
    accessorKey: "product",
    header:"Product Name",
  },
  {
    accessorKey: "color",
    header:"Color",
  },
  {
    accessorKey: "size",
    header:"Size",
  },
  {
    accessorKey: "sku",
    header:"Sku",
  },

  {
    accessorKey: "mrp",
    header:"MRP",
  },
  {
    accessorKey: "sellingPrice",
    header:"Selling Price",
  },
  {
    accessorKey: "discountPercentage",
    header:"Discount Percentage",
  },

]
export const DT_COUPON_COLUMN =[

  {
    accessorKey: "code",
    header:"code",
  },
  {
    accessorKey: "minShoppingAmount",
    header:"Min Shopping Amount",
  },
  {
    accessorKey: "discountPercentage",
    header:"Discount Percentage",
  },
{
  accessorKey: "validity",
  header: "Validity",
  Cell: ({ cell }) => {
    const value = cell.getValue();
    if (!value) return <span style={{ color: '#9e9e9e' }}>No Date</span>;

    const dateValue = dayjs(value);
    // isBefore(dayjs()) checks if the date is in the past
    const isExpired = dateValue.isBefore(dayjs(), 'day');

    return (
      <div
        style={{
          // Red background for expired, Green for valid
          backgroundColor: isExpired ? '#f8d7da' : '#d4edda', 
          // Darker text color for better contrast/readability
          color: isExpired ? '#721c24' : '#155724',
          padding: '4px 10px',
          borderRadius: '6px',
          textAlign: 'center',
          fontWeight: 'bold',
          display: 'inline-block',
          minWidth: '100px',
          fontSize: '0.85rem',
          border: `1px solid ${isExpired ? '#f5c6cb' : '#c3e6cb'}`
        }}
      >
        {dateValue.format("DD-MM-YYYY")}
        <span style={{ marginLeft: '5px', fontSize: '0.7rem' }}>
          ({isExpired ? 'EXPIRED' : 'VALID'})
        </span>
      </div>

    );
  },
},

]
export const DT_CUSTOMER_COLUMN = [


  {
  accessorKey: "avatar",
  header: "Avatar",
  Cell: ({ renderedCellValue }) => {
    const imageUrl =
      renderedCellValue?.url || "/assets/images/user.png";

    return (
      <Avatar>
        <AvatarImage src={imageUrl} alt="User Avatar" />
        <AvatarFallback>U</AvatarFallback>
      </Avatar>
    );
  },
},

  {
    accessorKey: "name",
    header:"Name",
  },
  {
    accessorKey: "email",
    header:"Email",
  },
  {
    accessorKey: "phone",
    header:"Phone",

  },
  {
    accessorKey: "address",
    header:"Address",
  },
  {
    accessorKey: "role",
    header:"Role",
  },

 {
  accessorKey: "isEmailVerified",
  header: "Email Verified",
  Cell: ({ renderedCellValue }) => (
    <span
      style={{
        backgroundColor: renderedCellValue ? "#dcfce7" : "#fee2e2", // green / red bg
        color: renderedCellValue ? "#166534" : "#991b1b",
        padding: "4px 10px",
        borderRadius: "6px",
        fontWeight: 600,
        display: "inline-block",
        minWidth: "50px",
        textAlign: "center",
      }}
    >
      {renderedCellValue ? "Verified" : "Not Verified"}
    </span>
  ),
}

]
export const DT_REVIEW_COLUMN = [
  {
    accessorKey: "product",
    header:"Product",
  },
  {
    accessorKey: "user",
    header:"User",
  },
  {
    accessorKey: "title",
    header:"Title",

  },
  {
    accessorKey: "review",
    header:"Review",
  },
  {
    accessorKey: "rating",
    header:"Rating",
  },

]