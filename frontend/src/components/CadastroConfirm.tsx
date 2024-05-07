import { View, Text, AlertDialog, Button } from "native-base";
import React from "react";
import { useState } from "react";

type Props = {
    onOpenModal: () => void;
}

export function CadastroConfirm({ onOpenModal }: Props) {
    const [isOpen, setIsOpen] = useState(false);
    const cancelRef = React.useRef(null);
    
    const onClose = () => {
        setIsOpen(false)
    }

    function handleCadastrar(){
        onOpenModal(); 
        setIsOpen(false);
    }

    return (
        <View>
            <Button
                bgColor="orange.500"
                w="full"
                h="16"
                _pressed={{ bg: "orange.400" }}
                onPress={() => { setIsOpen(!isOpen)}}
            >
                <Text fontSize="lg" color="white" fontFamily="heading">
                    Cadastrar
                </Text>
            </Button>
            <AlertDialog bg="rgba(0, 2, 14, 0.918)" leastDestructiveRef={cancelRef} isOpen={isOpen} onClose={onClose}>
                <AlertDialog.Content>
                    <AlertDialog.CloseButton />
                    <AlertDialog.Header bgColor="blue.300"> Cadastar em coleta?</AlertDialog.Header>
                    <AlertDialog.Body bgColor="blue.300">
                        Ao se cadastrar nessa coleta, você se disponibilza a realizar essa tarefa em prol de sua comunicadade.
                    </AlertDialog.Body>
                    <AlertDialog.Footer bgColor="blue.300">
                        <Button.Group space={2}>
                            <Button variant="unstyled" onPress={onClose} ref={cancelRef}>
                                Cancelar
                            </Button>
                            <Button bgColor="green.500" onPress={handleCadastrar}>
                                Cadastrar
                            </Button>
                        </Button.Group>
                    </AlertDialog.Footer>
                </AlertDialog.Content>
            </AlertDialog>
        </View>
    );
};