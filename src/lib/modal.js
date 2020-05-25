import React from "react";
import { createContext, useContext, useState } from "react";

export const ModalContext = createContext();

export function ModalContextProvider({ children }) {
  const modal = useProvideModal();
  return (
    <ModalContext.Provider value={modal}>{children}</ModalContext.Provider>
  );
}

export const useModal = () => {
  return useContext(ModalContext);
};

function useProvideModal() {
  const [isModalOpen, setIsModalOpen] = useState(false);

  const showModal = (show) => {
    return setIsModalOpen(true);
  };

  const hideModal = (show) => {
    return setIsModalOpen(false);
  };

  return {
    isModalOpen,
    showModal,
    hideModal,
  };
}
