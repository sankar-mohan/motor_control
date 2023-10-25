# coding: utf-8
"""*****************************************************************************
* Copyright (C) 2021 Microchip Technology Inc. and its subsidiaries.
*
* Subject to your compliance with these terms, you may use Microchip software
* and any derivatives exclusively with Microchip products. It is your
* responsibility to comply with third party license terms applicable to your
* use of third party software (including open source software) that may
* accompany Microchip software.
*
* THIS SOFTWARE IS SUPPLIED BY MICROCHIP "AS IS". NO WARRANTIES, WHETHER
* EXPRESS, IMPLIED OR STATUTORY, APPLY TO THIS SOFTWARE, INCLUDING ANY IMPLIED
* WARRANTIES OF NON-INFRINGEMENT, MERCHANTABILITY, AND FITNESS FOR A
* PARTICULAR PURPOSE.
*
* IN NO EVENT WILL MICROCHIP BE LIABLE FOR ANY INDIRECT, SPECIAL, PUNITIVE,
* INCIDENTAL OR CONSEQUENTIAL LOSS, DAMAGE, COST OR EXPENSE OF ANY KIND
* WHATSOEVER RELATED TO THE SOFTWARE, HOWEVER CAUSED, EVEN IF MICROCHIP HAS
* BEEN ADVISED OF THE POSSIBILITY OR THE DAMAGES ARE FORESEEABLE. TO THE
* FULLEST EXTENT ALLOWED BY LAW, MICROCHIP'S TOTAL LIABILITY ON ALL CLAIMS IN
* ANY WAY RELATED TO THIS SOFTWARE WILL NOT EXCEED THE AMOUNT OF FEES, IF ANY,
* THAT YOU HAVE PAID DIRECTLY TO MICROCHIP FOR THIS SOFTWARE.
*****************************************************************************"""


#---------------------------------------------------------------------------------------#
#                               Import                                                  #
#---------------------------------------------------------------------------------------#
import inspect
import xml.etree.ElementTree as ET
import os.path

#---------------------------------------------------------------------------------------#
#                              Global variables                                         #
#---------------------------------------------------------------------------------------#

#---------------------------------------------------------------------------------------#
#                              Classes                                                  #
#---------------------------------------------------------------------------------------#
class mcFocI_DigitalInterfaceClass:
    def __init__(self, component, pin_manager):
        self.component = component
        self.pin_manager = pin_manager

        # Instantiate analog interface class
        device = mcDevI_DigitalInterfaceClass(component)
        self.information = device.function_Map


    def createButtonSymbolGroup(self, index, root):
        # Update button list function
        def updateButtonList(symbol, event):
            if idx.getValue() < event["value"]:
                node.setVisible(True)
            else:
                node.setVisible(False)

        def updateButtonPad(symbol, event):
            # Remove old pin from pin list
            self.pin_manager.removePinFromList( old_pad.getValue())
            old_pad.setValue(pad.getValue())

            # Update configured pad list
            self.pin_manager.addPinToList(pad.getValue())

            # Update the button data to be sent to custom BSP
            args =  {
                            "TYPE": "BUTTON",
                            "ID": name.getValue(),
                            "PAD": pad.getValue()
                    }

            # Send message to custom BSP
            Database.sendMessage("cstom_mc_bsp", "MCPMSMFOC_DIGITAL_INTERFACE_SET", args)

            if event["id"] == "MCPMSMFOC_USED_PIN_LIST":
                pad_list = sorted(self.information)
                pad_list = [entry for entry in pad_list if entry not in self.pin_manager.getUsedPinList() or entry == pad.getValue()]
                value = pad.getValue()
                pad.setRange(["** Select **"] + pad_list )
                pad.setValue(value)

        node_id = "MCPMSMFOC_BUTTON_"+ str(index) + "_NODE"
        node = self.component.createMenuSymbol(node_id, root)
        node.setLabel("Button"+ " " + str(index))
        node.setVisible(False)
        node.setDependencies( updateButtonList, ["MCPMSMFOC_BUTTONS_AVAILABLE"])

        idx_id = "MCPMSMFOC_BUTTON_"+ str(index) + "_INDEX"
        idx = self.component.createIntegerSymbol( idx_id, node)
        idx.setDefaultValue(int(index))

        name_id = "MCPMSMFOC_BUTTON_"+ str(index)+"_NAME"
        name  = self.component.createStringSymbol( name_id, node)
        name.setLabel("Name")
        name.setDefaultValue("BUTTON" + str(index))

        types = ["Physical"]
        types_id = "MCPMSMFOC_BUTTON_"+ str(index)+"_TYPE"
        type  = self.component.createComboSymbol( types_id, node, types)
        type.setLabel("Type")
        type.setDefaultValue("Physical")

        pad_id = "MCPMSMFOC_BUTTON_"+ str(index)+"_NUMBER"
        pad  = self.component.createComboSymbol( pad_id, node, self.information)
        pad.setLabel("Pin Number")
        pad.setDefaultValue("** Select **")
        pad.setDependencies(updateButtonPad, [ pad_id, "MCPMSMFOC_USED_PIN_LIST"])

        old_pad_id = "MCPMSMFOC_BUTTON_"+ str(index)+"_OLD_NUMBER"
        old_pad  = self.component.createStringSymbol( old_pad_id, node)
        old_pad.setLabel("Old Pin Number")
        old_pad.setDefaultValue("** Select **")
        old_pad.setVisible(False)

        actions = ["Start/Stop", "Direction Toggle", "Custom"]
        actions_id = "MCPMSMFOC_BUTTON_"+ str(index)+ "_FUNCTION"
        action  = self.component.createComboSymbol( actions_id, node, actions)
        action.setLabel("Function")

    def createLedSymbolGroup(self, index, root):
        # Update LED list function
        def updateLedList(symbol, event):
            if idx.getValue() < event["value"]:
                node.setVisible(True)
            else:
                node.setVisible(False)

        def updateLedPad(symbol, event):
            # Remove old pin from pin list
            self.pin_manager.removePinFromList( old_pad.getValue())
            old_pad.setValue(pad.getValue())

            # Update configured pad list
            self.pin_manager.addPinToList(pad.getValue())

            # Update the button data to be sent to custom BSP
            args =  {
                        "TYPE": "LED",
                        "ID": name.getValue(),
                        "PAD": pad.getValue()
                    }

            # Send message to custom BSP
            Database.sendMessage("cstom_mc_bsp", "MCPMSMFOC_DIGITAL_INTERFACE_SET", args)

            if event["id"] == "MCPMSMFOC_USED_PIN_LIST":
                pad_list = sorted(self.information)
                pad_list = [entry for entry in pad_list if entry not in self.pin_manager.getUsedPinList() or entry == pad.getValue()]
                value = pad.getValue()
                pad.setRange(["** Select **"] + pad_list )
                pad.setValue(value)

        node_id = "MCPMSMFOC_LED_"+ str(index) + "_NODE"
        node = self.component.createMenuSymbol( node_id, root)
        node.setLabel("Led"+ " " + str(index))
        node.setVisible(False)
        node.setDependencies( updateLedList, ["MCPMSMFOC_LEDS_AVAILABLE"])

        idx_id = "MCPMSMFOC_LED_"+ str(index) + "_INDEX"
        idx = self.component.createIntegerSymbol( idx_id, node)
        idx.setDefaultValue(int(index))

        name_id = "MCPMSMFOC_LED_"+ str(index) +"_NAME"
        name  = self.component.createStringSymbol( name_id, node)
        name.setLabel("Name")
        name.setDefaultValue("LED" + str(index))

        types = ["Physical"]
        types_id = "MCPMSMFOC_LED_"+ str(index)+"_TYPE"
        type  = self.component.createComboSymbol( types_id, node, types)
        type.setLabel("Type")
        type.setDefaultValue("Physical")

        pad_id = "MCPMSMFOC_LED_"+ str(index)+"_NUMBER"
        pad  = self.component.createComboSymbol( pad_id, node, self.information)
        pad.setLabel("Pin Number")
        pad.setDefaultValue("** Select **")
        pad.setDependencies(updateLedPad, [ pad_id, "MCPMSMFOC_USED_PIN_LIST"])

        old_pad_id = "MCPMSMFOC_LED_"+ str(index)+"_OLD_NUMBER"
        old_pad  = self.component.createStringSymbol( old_pad_id, node)
        old_pad.setLabel("Old Pin Number")
        old_pad.setDefaultValue("** Select **")
        old_pad.setVisible(False)

        actions = ["Start/Stop", "Direction Toggle", "Custom"]
        actions_id = "MCPMSMFOC_LED_"+ str(index)+ "_FUNCTION"
        action  = self.component.createComboSymbol( actions_id, node, actions)
        action.setLabel("Function")

    def createSymbols(self):
        self.sym_NODE = self.component.createMenuSymbol(None, None)
        self.sym_NODE.setLabel("Digital Interface")

        self.max_NUMBER_OF_BUTTONS = 2
        self.sym_BUTTON_NODE = self.component.createMenuSymbol(None, self.sym_NODE)
        self.sym_BUTTON_NODE.setLabel("Buttons")

        self.sym_AVAILABLE_BUTTONS = self.component.createIntegerSymbol("MCPMSMFOC_BUTTONS_AVAILABLE", self.sym_BUTTON_NODE)
        self.sym_AVAILABLE_BUTTONS.setLabel("Number of available buttons")
        self.sym_AVAILABLE_BUTTONS.setDefaultValue(0)
        self.sym_AVAILABLE_BUTTONS.setVisible(True)

        for index in range(self.max_NUMBER_OF_BUTTONS):
           self.createButtonSymbolGroup(index, self.sym_BUTTON_NODE)

        self.max_NUMBER_OF_LEDS = 2
        self.sym_LED_NODE = self.component.createMenuSymbol(None, self.sym_NODE)
        self.sym_LED_NODE.setLabel("Leds")

        self.sym_AVAILABLE_LEDS = self.component.createIntegerSymbol("MCPMSMFOC_LEDS_AVAILABLE", self.sym_LED_NODE)
        self.sym_AVAILABLE_LEDS.setLabel("Number of available leds")
        self.sym_AVAILABLE_LEDS.setDefaultValue(0)
        self.sym_AVAILABLE_LEDS.setVisible(True)

        for index in range(self.max_NUMBER_OF_LEDS):
            self.createLedSymbolGroup(index, self.sym_LED_NODE)

    """
    Description:
    This function discards alphabets and returns the numbers only
    """
    def numericFilter( self, input_String ):
        numeric_filter = filter(str.isdigit, str(input_String))
        return "".join(numeric_filter)

    def handleMessage(self, ID, information):
        pass
        # if ("BSP_DIGITAL_INTERFACE" == ID) and (None != information):
        #     index = 0
        #     for key, value in information["BUTTONS"].items():
        #         self.sym_BUTTON_INDEX[index].setVisible(True)
        #         self.sym_BUTTON_NAME[index].setValue(key)
        #         self.sym_BUTTON_PIN[index].setValue(value["PAD"])
        #         index += 1

        #     self.sym_AVAILABLE_BUTTONS.setValue(index)

        #     index = 0
        #     for key, value in information["LEDS"].items():
        #         self.sym_LED_INDEX[index].setVisible(True)
        #         self.sym_LED_NAME[index].setValue(key)
        #         self.sym_LED_PIN[index].setValue(value["PAD"])
        #         index += 1

        #     self.sym_AVAILABLE_LEDS.setValue(index)

    def __call__(self):
        self.createSymbols()

