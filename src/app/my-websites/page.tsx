import { Metadata } from "next";
import ClientPage from "./ClientPage";

// Define metadata for the page (server component)
export const metadata: Metadata = {
  title: "My Websites",
  description: "Collection of websites I have created and published",
};

export default function MyWebsitesPage() {
  return <ClientPage />;
}
