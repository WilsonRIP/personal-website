import { Metadata } from "next";
import MyWebsitesClient from "./components/MyWebsitesClient";

// Define metadata for the page
export const metadata: Metadata = {
  title: "My Websites",
  description: "Collection of websites I have created and published",
};

export default function MyWebsitesPage() {
  return <MyWebsitesClient />;
}
