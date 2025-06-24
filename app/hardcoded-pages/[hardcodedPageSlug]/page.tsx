import RapidrailPage from "./components/RapidrailPage";
import LifespanPage from "./components/LifespanPage";
import TierclassicPage from "./components/TierclassicPage";
import TierelementPage from "./components/TierelementPage";

interface Props {
  params: { hardcodedPageSlug: string };
  searchParams?: { lang?: string; categorySlug?: string };
}

export default function HardcodedPage({ params, searchParams }: Props) {
  switch (params.hardcodedPageSlug) {
    case "rapidrail":
      return <RapidrailPage searchParams={searchParams} />;
      case "lifespan":
        return <LifespanPage searchParams={searchParams} />;
    case "tierclassic":
      return <TierclassicPage searchParams={searchParams} />;
    case "tierelement":
      return <TierelementPage searchParams={searchParams} />;
    // Add more cases for other hardcoded pages as needed
    default:
      return <div>Page not found</div>;
  }
}