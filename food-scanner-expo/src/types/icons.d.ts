declare module '@tabler/icons-react-native' {
  import { SvgProps } from 'react-native-svg';
  
  export interface IconProps extends SvgProps {
    size?: number | string;
    stroke?: string;
    color?: string;
    strokeWidth?: number | string;
  }
  
  export const IconScan: React.FC<IconProps>;
  export const IconHistory: React.FC<IconProps>;
  export const IconUser: React.FC<IconProps>;
  export const IconBolt: React.FC<IconProps>;
  export const IconBoltOff: React.FC<IconProps>;
  export const IconFlame: React.FC<IconProps>;
  export const IconDroplet: React.FC<IconProps>;
  export const IconEggFried: React.FC<IconProps>;
  export const IconWheat: React.FC<IconProps>;
  export const IconPhotoOff: React.FC<IconProps>;
  export const IconMoodSurprised: React.FC<IconProps>;
  export const IconHeart: React.FC<IconProps>;
  export const IconBell: React.FC<IconProps>;
  export const IconLanguage: React.FC<IconProps>;
  export const IconPalette: React.FC<IconProps>;
  export const IconShieldCheck: React.FC<IconProps>;
  export const IconInfoCircle: React.FC<IconProps>;
  export const IconChevronRight: React.FC<IconProps>;
  export const IconSettings: React.FC<IconProps>;
  export const IconArrowLeft: React.FC<IconProps>;
}

