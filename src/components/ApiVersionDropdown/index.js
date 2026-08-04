import { useLocation } from "@docusaurus/router";
import DocsVersionDropdownNavbarItem from "@theme/NavbarItem/DocsVersionDropdownNavbarItem";

// The version picker only makes sense inside the versioned RPC reference;
// on every other page it would wrongly imply that page is versioned.
export default function ApiVersionDropdown(props) {
  const { pathname } = useLocation();
  if (!pathname.startsWith("/docs/build/rpc-api")) {
    return null;
  }
  return (
    <DocsVersionDropdownNavbarItem
      dropdownItemsBefore={[]}
      dropdownItemsAfter={[]}
      {...props}
      docsPluginId="api"
    />
  );
}
