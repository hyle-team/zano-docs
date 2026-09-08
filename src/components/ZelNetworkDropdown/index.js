import { useLocation } from "@docusaurus/router";
import DropdownNavbarItem from "@theme/NavbarItem/DropdownNavbarItem";

const ZEL_BASE_PATH = "/docs/build/zel";

export default function ZelNetworkDropdown(props) {
  const { pathname } = useLocation();

  if (!pathname.startsWith(ZEL_BASE_PATH)) {
    return null;
  }

  return (
    <DropdownNavbarItem
      {...props}
      label="Network: Testnet"
      items={[
        {
          label: "Testnet",
          to: pathname,
          activeBasePath: ZEL_BASE_PATH,
        },
        {
          label: "Mainnet (not live)",
          href: "#",
          className: "zel-network-option-disabled",
          "aria-disabled": "true",
          tabIndex: -1,
          onClick: (event) => event.preventDefault(),
        },
      ]}
    />
  );
}
