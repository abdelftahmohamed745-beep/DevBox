import React from 'react';
import {
  Code, Palette, Image as ImageIcon, Type, FileText, Paintbrush, RefreshCw, Cpu, Shield, Search, Sliders,
  Fingerprint, Shuffle, Link, Braces, CodeXml, Binary, Key, Keyboard, ExternalLink, Maximize2, Layers,
  Compass, SquarePlus, Sparkles, Feather, Minimize, Move, FileSymlink, Crown, SlidersHorizontal, Crop,
  CheckSquare, CaseSensitive, AlignLeft, Columns, FileSearch, Edit3, FileUp, Grid, Eye, Blend, Droplet,
  Sun, Clock, FileCode, Code2, Lock, QrCode, Barcode, Hash, UserCheck, ShieldAlert, KeyRound, LockKeyhole,
  Tags, Bot, Network, Percent, CalendarDays, Activity, CalendarClock, Hourglass, Star, Heart, MessageSquare, Info
} from 'lucide-react';

const iconMap: Record<string, React.ComponentType<any>> = {
  Code, Palette, Image: ImageIcon, Type, FileText, Paintbrush, RefreshCw, Cpu, Shield, Search, Sliders,
  Fingerprint, Shuffle, Link, Braces, CodeXml, Binary, Key, Keyboard, ExternalLink, Maximize2, Layers,
  Compass, SquarePlus, Sparkles, Feather, Minimize, Move, FileSymlink, Crown, SlidersHorizontal, Crop,
  CheckSquare, CaseSensitive, AlignLeft, Columns, FileSearch, Edit3, FileUp, Grid, Eye, Blend, Droplet,
  Sun, Clock, FileCode, Code2, Lock, QrCode, Barcode, Hash, UserCheck, ShieldAlert, KeyRound, LockKeyhole,
  Tags, Bot, Network, Percent, CalendarDays, Activity, CalendarClock, Hourglass, Star, Heart, MessageSquare, Info
};

interface LucideIconProps {
  name: string;
  className?: string;
}

export const LucideIcon = ({ name, className = "w-5 h-5" }: LucideIconProps) => {
  const IconComponent = iconMap[name] || Code;
  return <IconComponent className={className} />;
};
export default LucideIcon;
