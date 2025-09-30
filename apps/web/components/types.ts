export interface TopBarComponent {
    Icon: React.FC<React.SVGProps<SVGSVGElement>>;
    name: string;
    action: () => void;
}