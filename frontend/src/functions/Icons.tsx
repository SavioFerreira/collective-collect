import { MaterialCommunityIcons, MaterialIcons, FontAwesome, FontAwesome6, Feather, Octicons, Entypo } from '@expo/vector-icons/';

type IconInfo = {
    name: string;
    Component: React.ComponentType<any>;
    color?: string;
  };
  
  type IconMap = {
    [key: string]: IconInfo;
  };

 
  export function getTypeIcon(residuoType: string): IconInfo {
    const iconMap: IconMap = {
      PLASTICO: { name: 'bottle-water', Component: FontAwesome6 },
      VIDRO: { name: 'glass-wine', Component: MaterialCommunityIcons },
      METAL: { name: 'table-cog', Component: MaterialCommunityIcons },
      MADEIRA: { name: 'tree', Component: FontAwesome },
      ORGANICO: { name: 'fruit-watermelon', Component: MaterialCommunityIcons },
      ELETRONICO: { name: 'phonelink', Component: MaterialIcons },
      PAPEL: { name: 'newspaper', Component: FontAwesome6 }, 
      PERIGOSO: { name: 'radioactive-circle', Component: MaterialCommunityIcons },
      ENTULHO: { name: 'toy-brick-outline', Component: MaterialCommunityIcons },
      INDEFINIDO: { name: 'trash', Component: Entypo }
    };
    return iconMap[residuoType] || { name: 'alert-circle', Component: Feather };
  };

  export function getGravityIcon(gravity: string): IconInfo {
    const iconMap: IconMap = {
      BAIXO: { name: 'crisis-alert', Component: MaterialIcons, color: "green.400" },
      MEDIO: { name: 'crisis-alert', Component: MaterialIcons, color: "amber.200" },
      ALTO: { name: 'crisis-alert', Component: MaterialIcons, color: "orange.500" },
      CRITICO: { name: 'crisis-alert', Component: MaterialIcons, color: "red.600"  }
    };

    return iconMap[gravity] || { name: 'alert-circle', Component: Feather };
  };

  export function getStatusIcon(status: string): IconInfo {
    const iconMap: IconMap = {

      DISPONIVEL: { name: 'pending-actions', Component: MaterialIcons, color:"cyan.300" },
      PENDENTE: { name: 'pending-actions', Component: MaterialIcons, color:"gray.200" },
      APROVADO: { name: 'check-circle-o', Component: FontAwesome, color:"emerald.500" },
      REJEITADO: { name: 'alert-triangle', Component: Feather, color:"red.700" },
      EM_ANALISE: { name: 'unverified', Component: Octicons, color:"purple.400" },
      OCORRENDO: { name: 'unverified', Component: Octicons, color:"amber.500" }
    };
    return iconMap[status] || { name: 'alert-circle', Component: Feather };
  };