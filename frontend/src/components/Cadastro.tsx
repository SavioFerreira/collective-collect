import { View, Text, Heading, Center, Alert, AlertDialog, Button } from "native-base";
import React from "react";
import { useState } from "react";

export function Cadastro() {
    const [isOpen, setIsOpen] = useState(false);
    const onClose = () => setIsOpen(false);
    const cancelRef = React.useRef(null);

    return (
        <Center pb={2}>
            <Button 
              bgColor="green.500" 
              w="full" 
              h="16"
              onPress={() => setIsOpen(!isOpen)}
            >
                <Text fontSize="lg" color="white" fontFamily="heading">
                    Cadastrar
                </Text>
            </Button>
            <AlertDialog bgColor="black" leastDestructiveRef={cancelRef} isOpen={isOpen} onClose={onClose}>
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
                            <Button bgColor="green.500" onPress={onClose}>
                                Cadastrar
                            </Button>
                        </Button.Group>
                    </AlertDialog.Footer>
                </AlertDialog.Content>
            </AlertDialog>
        </Center>
    );
};