import RapidrailPage from "./components/RapidrailPage";
import LifespanPage from "./components/LifespanPage";
import TierclassicPage from "./components/TierclassicPage";
import TierelementPage from "./components/TierelementPage";
import VistacladPage from "./components/VistacladPage";
import InfinityPage from "./components/InfinityPage";
import { getCategoryBySlug, getProductsBySubcategory, getProductsByCategory } from "@/lib/data";
import { notFound } from "next/navigation";
import EvatechPage from "./components/EvatechPage";

interface Props {
  params: { hardcodedPageSlug: string };
  searchParams?: { lang?: string; categorySlug?: string };
}

export default async function HardcodedPage({ params, searchParams }: Props) {
  switch (params.hardcodedPageSlug) {
    case "rapidrail":
      return <RapidrailPage searchParams={searchParams} />;
    case "lifespan":
      return <LifespanPage searchParams={searchParams} />;
    case "tierclassic":
      return <TierclassicPage searchParams={searchParams} />;
    case "tierelement":
      return <TierelementPage searchParams={searchParams} />;
    case "vistaclad":
      return <VistacladPage searchParams={searchParams} />;
    case "infinity": {
      const categorySlug = searchParams?.categorySlug;
      if (!categorySlug) return <div className="text-red-600">Missing categorySlug in URL.</div>;
      const category = await getCategoryBySlug(categorySlug);
      if (!category) return notFound();

      // Try to find subcategory by hardcodedPageSlug, fallback to slug, or fallback to category
      let subcategory = category.subcategories?.find(
        (sub: any) => sub.hardcodedPageSlug === "infinity"
      );
      if (!subcategory) {
        subcategory = category.subcategories?.find(
          (sub: any) => sub.slug === "infinity"
        );
      }

      let products = [];
      if (subcategory) {
        products = await getProductsBySubcategory(category.slug, subcategory.slug);
      } else {
        products = await getProductsByCategory(category.slug);
      }

      // If subcategory is undefined, provide a default object to satisfy props typing
      const subcategoryForPage = subcategory || {
        id: "",
        name: { en: "", ar: "" },
        slug: "",
        description: { en: "", ar: "" },
        logo: undefined,
        slogan: undefined,
        benefits: [],
        colors: [],
      };

      return <InfinityPage category={category} subcategory={subcategoryForPage} products={products} />;
    }
    case "evatech": {
      const categorySlug = searchParams?.categorySlug;
      if (!categorySlug) return <div className="text-red-600">Missing categorySlug in URL.</div>;
      const category = await getCategoryBySlug(categorySlug);
      if (!category) return notFound();

      // Try to find subcategory by hardcodedPageSlug, fallback to slug, or fallback to category
      let subcategory = category.subcategories?.find(
        (sub: any) => sub.hardcodedPageSlug === "evatech"
      );
      if (!subcategory) {
        subcategory = category.subcategories?.find(
          (sub: any) => sub.slug === "evatech"
        );
      }

      let products = [];
      if (subcategory) {
        products = await getProductsBySubcategory(category.slug, subcategory.slug);
      } else {
        products = await getProductsByCategory(category.slug);
      }

      // If subcategory is undefined, provide a default object to satisfy props typing
      const subcategoryForPage = subcategory || {
        id: "",
        name: { en: "", ar: "" },
        slug: "",
        description: { en: "", ar: "" },
        logo: undefined,
        slogan: undefined,
        benefits: [],
        colors: [],
      };

      return <EvatechPage category={category} subcategory={subcategoryForPage} products={products} />;
    }
    // Add more cases for other hardcoded pages as needed
    default:
      return <div>Page not found</div>;
  }
}