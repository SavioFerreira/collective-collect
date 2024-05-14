import React, { createContext, ReactNode, useCallback, useEffect, useState } from "react";
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useToast } from 'native-base';

import { api } from '@services/api';
import { ResiduoType } from 'src/enums/ResiduoTypesEnum';
import { ColetaDTO } from "@dtos/ColetaDTO";
import { AppError } from "@utils/AppError";

export type CollectContextDataProps = {
  coletas: ColetaDTO[];
  isLoading: boolean;
  typeSelected: ResiduoType;
  handleTypeSelected: (type: ResiduoType) => void;
};

type CollectContextProviderProps = {
  children: ReactNode;
};

export const CollectContext = createContext<CollectContextDataProps>({} as CollectContextDataProps);

export function CollectContextProvider({ children }: CollectContextProviderProps) {
  const [coletas, setColetas] = useState<ColetaDTO[]>([]);
  const [allColetas, setAllColetas] = useState<ColetaDTO[]>([]);
  const [typeSelected, setTypeSelected] = useState<ResiduoType>(ResiduoType.TODOS);
  const [isLoading, setIsLoading] = useState(true);
  const toast = useToast();

  const fetchColetas = async () => {
    setIsLoading(true);
    try {
      const response = await api.get('api/collect');
      setAllColetas(response.data);
      applyFilter();
    } catch (error) {
      console.error("Erro ao buscar coletas", error);
      const isAppError = error instanceof AppError;
      const title = isAppError ? error.message : 'Não foi possível carregar os dados das coletas';
      console.log("Erro específico:", error);
      toast.show({
        title: title,
        placement: 'top',
        bgColor: 'red.500'
      });
    } finally {
      setIsLoading(false);
    }
  };

  const applyFilter = useCallback(() => {
    const filtered = typeSelected === ResiduoType.TODOS ? allColetas : allColetas.filter(coleta => coleta.type === typeSelected);
    setColetas(filtered);
  }, [typeSelected, allColetas]);

  const handleTypeSelected = useCallback((type: ResiduoType) => {
    setTypeSelected(type);
    AsyncStorage.setItem('typeSelected', type);
  }, []);

  async function loadStoredType() {
    const storedType = await AsyncStorage.getItem('typeSelected');
    if (storedType && Object.values(ResiduoType).includes(storedType as ResiduoType)) {
      setTypeSelected(storedType as ResiduoType);
    }
  }

  useEffect(() => {
    async function initializeData() {
      await loadStoredType(); 
      fetchColetas();
    }
    initializeData();
  }, []);

  useEffect(() => {
    applyFilter();
  }, [typeSelected, allColetas]);

  return (
    <CollectContext.Provider value={{ coletas, isLoading, typeSelected, handleTypeSelected }}>
      {children}
    </CollectContext.Provider>
  );
}
