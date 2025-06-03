import Link from "next/link";
import { Category } from "@/lib/data";
import { useSearchParams } from "next/navigation";

interface CategorySidebarProps {
  categories: Category[];
}

export default function CategorySidebar({ categories }: CategorySidebarProps) {
  const searchParams = useSearchParams();
  const lang = searchParams.get("lang") === "ar" ? "ar" : "en";
  return (
    <div className="space-y-4">
      <h2 className="font-semibold text-lg">Categories</h2>
      <nav className="space-y-2">
        {categories.map((category) => (
          <div key={category.id} className="space-y-1">
            <Link
              href={{ pathname: `/products/${category.slug}`, query: lang === "ar" ? { lang } : undefined }}
              className="block text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-gray-200"
            >
              {typeof category.name === 'string' ? category.name : (category.name?.[lang] || '')}
            </Link>
            {category.subcategories && category.subcategories.length > 0 && (
              <div className="pl-4 space-y-1">
                {category.subcategories.map((sub) => (
                  <Link
                    key={sub.id}
                    href={{ pathname: `/products/${category.slug}/${sub.slug}`, query: lang === "ar" ? { lang } : undefined }}
                    className="block text-sm text-gray-500 hover:text-gray-700 dark:text-gray-500 dark:hover:text-gray-300"
                  >
                    {typeof sub.name === 'string' ? sub.name : (sub.name?.[lang] || '')}
                  </Link>
                ))}
              </div>
            )}
          </div>
        ))}
      </nav>
    </div>
  );
}
