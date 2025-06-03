import { getCategories } from "@/lib/data"
import ProductsPage from "./page"

export default async function ProductsPageServer() {
  const categories = await getCategories()
  return <ProductsPage />
} 