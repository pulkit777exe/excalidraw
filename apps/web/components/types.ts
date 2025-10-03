import { LucideIcon } from "lucide-react";

export interface TopBarComponent {
  Icon: LucideIcon;
  name: string;
  action: () => void;
}